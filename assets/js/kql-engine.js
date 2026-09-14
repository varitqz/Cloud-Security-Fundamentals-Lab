(function(){
  function clone(v){ return JSON.parse(JSON.stringify(v)); }
  function scalar(v){
    if (v === 'true') return true;
    if (v === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    return v.replace(/^['"]|['"]$/g,'');
  }
  function fieldValue(row, field){
    return field.split('.').reduce((acc,key)=> acc == null ? undefined : acc[key], row);
  }
  function compare(left, op, right){
    if(op==='==') return left == right;
    if(op==='!=') return left != right;
    if(op==='>') return Number(left) > Number(right);
    if(op==='<') return Number(left) < Number(right);
    if(op==='>=') return Number(left) >= Number(right);
    if(op==='<=') return Number(left) <= Number(right);
    return false;
  }
  function parseAgo(value){
    const m=String(value).match(/ago\((\d+)(m|h|d)\)/i); if(!m) return null;
    const n=Number(m[1]), unit=m[2].toLowerCase();
    const ms=n*(unit==='m'?60000:unit==='h'?3600000:86400000);
    return Date.now()-ms;
  }
  function applyWhere(rows, expr){
    expr=expr.trim();
    // TimeGenerated > ago(24h)
    let m=expr.match(/^([\w.]+)\s*(>=|<=|>|<)\s*(ago\([^)]*\))$/i);
    if(m){ const threshold=parseAgo(m[3]); return rows.filter(r=>compare(new Date(fieldValue(r,m[1])).getTime(),m[2],threshold)); }
    // has_any ("x","y")
    m=expr.match(/^([\w.]+)\s+has_any\s*\((.*)\)$/i);
    if(m){ const vals=(m[2].match(/"[^"]*"|'[^']*'/g)||[]).map(s=>scalar(s).toLowerCase()); return rows.filter(r=> vals.some(v=>String(fieldValue(r,m[1])??'').toLowerCase().includes(v))); }
    // has "value"
    m=expr.match(/^([\w.]+)\s+has\s+["']([^"']+)["']$/i);
    if(m){ return rows.filter(r=>String(fieldValue(r,m[1])??'').toLowerCase().includes(m[2].toLowerCase())); }
    // contains
    m=expr.match(/^([\w.]+)\s+contains\s+["']([^"']+)["']$/i);
    if(m){ return rows.filter(r=>String(fieldValue(r,m[1])??'').toLowerCase().includes(m[2].toLowerCase())); }
    // normal comparison
    m=expr.match(/^([\w.]+)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
    if(m){ const right=scalar(m[3].trim()); return rows.filter(r=>compare(fieldValue(r,m[1]),m[2],right)); }
    throw new Error('Unsupported where expression: '+expr);
  }
  function applyProject(rows, expr){
    const fields=expr.split(',').map(x=>x.trim()).filter(Boolean);
    return rows.map(row=>{
      const out={};
      for(const token of fields){
        const alias=token.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
        if(alias){
          const raw=alias[2].trim().replace(/^tostring\((.*)\)$/i,'$1');
          out[alias[1]]=fieldValue(row,raw);
        } else out[token]=fieldValue(row,token);
      }
      return out;
    });
  }
  function applySummarize(rows, expr){
    const m=expr.match(/^([A-Za-z_]\w*)\s*=\s*count\(\)\s*(?:by\s+(.+))?$/i);
    if(!m) throw new Error('Only summarize Alias = count() by ... is supported locally.');
    const alias=m[1], fields=m[2]?m[2].split(',').map(s=>s.trim()).filter(Boolean):[];
    if(!fields.length) return [{[alias]:rows.length}];
    const groups=new Map();
    for(const row of rows){
      const values=fields.map(f=>fieldValue(row,f)); const key=JSON.stringify(values);
      if(!groups.has(key)){ const base={}; fields.forEach((f,i)=>base[f]=values[i]); base[alias]=0; groups.set(key,base); }
      groups.get(key)[alias]++;
    }
    return [...groups.values()];
  }
  function applyOrder(rows, expr){
    const m=expr.match(/^([\w.]+)\s*(asc|desc)?$/i); if(!m) return rows;
    const field=m[1], dir=(m[2]||'asc').toLowerCase()==='desc'?-1:1;
    return rows.slice().sort((a,b)=>{
      const av=fieldValue(a,field), bv=fieldValue(b,field);
      if(av==null&&bv==null)return 0;if(av==null)return 1;if(bv==null)return -1;
      if(typeof av==='number'&&typeof bv==='number')return (av-bv)*dir;
      const ad=Date.parse(av),bd=Date.parse(bv); if(!Number.isNaN(ad)&&!Number.isNaN(bd)) return (ad-bd)*dir;
      return String(av).localeCompare(String(bv))*dir;
    });
  }
  function explain(query){
    const lines=query.split('\n').map(s=>s.trim()).filter(Boolean); const out=[];
    lines.forEach((line,i)=>{
      let title=line, body='';
      if(i===0&&!line.startsWith('|')) body='Selects the source table.';
      else if(line.startsWith('| where')) body='Filters rows so only matching events continue through the pipeline.';
      else if(line.startsWith('| summarize')) body='Aggregates matching rows. This local engine supports count() grouped by one or more fields.';
      else if(line.startsWith('| project')) body='Keeps only the fields needed for investigation output.';
      else if(line.startsWith('| order by')) body='Sorts the result set.';
      else if(line.startsWith('| take')) body='Limits the number of returned rows.';
      else body='Pipeline step recognized as part of the query.';
      out.push({title,body});
    }); return out;
  }
  function run(query, tables){
    const lines=query.split('\n').map(s=>s.trim()).filter(Boolean);
    if(!lines.length) throw new Error('Query is empty.');
    const table=lines.shift(); if(!tables[table]) throw new Error('Unknown local table: '+table);
    let rows=clone(tables[table]);
    for(let line of lines){
      line=line.replace(/^\|\s*/, '');
      if(/^where\s+/i.test(line)) rows=applyWhere(rows,line.replace(/^where\s+/i,''));
      else if(/^project\s+/i.test(line)) rows=applyProject(rows,line.replace(/^project\s+/i,''));
      else if(/^summarize\s+/i.test(line)) rows=applySummarize(rows,line.replace(/^summarize\s+/i,''));
      else if(/^order\s+by\s+/i.test(line)) rows=applyOrder(rows,line.replace(/^order\s+by\s+/i,''));
      else if(/^take\s+/i.test(line)){ const n=Number(line.replace(/^take\s+/i,'')); rows=rows.slice(0,Number.isFinite(n)?n:10); }
      else if(/^mv-expand\s+/i.test(line)){ /* synthetic datasets are already flattened */ }
      else throw new Error('Unsupported local KQL step: | '+line);
    }
    return {table,rows,count:rows.length,explanation:explain(query)};
  }
  window.CSFLKQL={run,explain};
})();
