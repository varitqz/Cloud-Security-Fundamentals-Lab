(function(){
  const KEY='csfl-v5-state';
  const now=()=>new Date().toISOString();
  const fresh=()=>({
    version:'5.0.0',xp:0,level:1,lastView:'dashboard',
    completedModules:{},
    skills:{Azure:34,Identity:42,ZeroTrust:38,KQL:31,Detection:28,IncidentResponse:24,IaC:30},
    quiz:{'AZ-900':{history:[],wrongByDomain:{}},'SC-900':{history:[],wrongByDomain:{}}},
    identity:{notes:'',tasks:{},remediations:[],completed:false},
    zeroTrust:{notes:'',tasks:{},actions:[],completed:false,extraSignals:[]},
    detections:{saved:[],runs:[],alerts:[]},
    incidents:JSON.parse(JSON.stringify(window.CSFLData.incidents)),
    posture:{findings:JSON.parse(JSON.stringify(window.CSFLData.postureFindings))},
    iac:{scanRuns:0,lastScan:null},
    achievements:{},
    actions:[{time:now(),text:'Cloud Security Fundamentals Lab v5.0 initialized.'}],
    casebook:[]
  });
  function load(){
    try{
      const raw=localStorage.getItem(KEY); if(!raw) return fresh();
      const parsed=JSON.parse(raw);
      if(!parsed.version || !parsed.version.startsWith('5.')) return fresh();
      return parsed;
    }catch(e){return fresh();}
  }
  let state=load();
  function save(){ try{ localStorage.setItem(KEY,JSON.stringify(state)); }catch(e){ /* opaque/file origins may block persistence; app remains functional in-memory */ } }
  function reset(){ state=fresh(); save(); return state; }
  function get(){ return state; }
  function patch(fn){ fn(state); recompute(); save(); return state; }
  function recompute(){
    state.level=Math.max(1,Math.floor(state.xp/250)+1);
    const unlocked={
      firstQuery: state.detections.runs.length>=1,
      accessReviewer: !!state.identity.completed,
      zeroTrustAnalyst: !!state.zeroTrust.completed,
      responder: state.incidents.some(i=>i.status==='Resolved'),
      postureEngineer: state.posture.findings.filter(f=>f.remediated).length>=3,
      iacReviewer: state.iac.scanRuns>=1,
      detector: state.detections.saved.length>=2,
      caseWriter: state.casebook.length>=1
    };
    state.achievements={...state.achievements,...unlocked};
  }
  function addXP(amount,reason){ patch(s=>{s.xp+=amount;s.actions.unshift({time:now(),text:`+${amount} XP — ${reason}`});s.actions=s.actions.slice(0,20);}); }
  function addAction(text){ patch(s=>{s.actions.unshift({time:now(),text});s.actions=s.actions.slice(0,20);}); }
  function exportState(){ return JSON.stringify(state,null,2); }
  function importState(text){
    const parsed=JSON.parse(text);
    if(!parsed.version || !String(parsed.version).startsWith('5.')) throw new Error('Not a Cloud Security Fundamentals Lab v5 state file.');
    state=parsed;recompute();save();return state;
  }
  window.CSFLState={get,save,patch,reset,addXP,addAction,exportState,importState,recompute,KEY};
})();
