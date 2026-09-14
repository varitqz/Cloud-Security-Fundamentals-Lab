(function(){
  'use strict';
  const glow=document.getElementById('mouseGlow');
  let raf=0,tx=innerWidth/2,ty=innerHeight/3,cx=tx,cy=ty;
  document.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(step);},{passive:true});
  function step(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;if(glow){glow.style.left=cx+'px';glow.style.top=cy+'px';}raf=0;}

  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.08});
  function observe(){document.querySelectorAll('.panel,.card,.metric-card,.module-card').forEach(el=>{if(!el.dataset.fx){el.dataset.fx='1';el.classList.add('reveal');observer.observe(el)}})}
  observe();
  const mo=new MutationObserver(()=>observe());mo.observe(document.getElementById('app'),{childList:true,subtree:true});

  document.addEventListener('click',e=>{
    const b=e.target.closest('.btn,.nav-btn,.module-card,.detection-item');if(!b)return;
    const r=document.createElement('span');r.style.cssText='position:absolute;width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.3);pointer-events:none;transform:translate(-50%,-50%);animation:ripple .55s ease-out forwards;z-index:5';
    const rect=b.getBoundingClientRect();r.style.left=(e.clientX-rect.left)+'px';r.style.top=(e.clientY-rect.top)+'px';if(getComputedStyle(b).position==='static')b.style.position='relative';b.style.overflow='hidden';b.appendChild(r);setTimeout(()=>r.remove(),600);
  });
  const style=document.createElement('style');style.textContent='@keyframes ripple{from{opacity:.55;box-shadow:0 0 0 0 rgba(255,255,255,.18)}to{opacity:0;box-shadow:0 0 0 48px rgba(255,255,255,0)}}';document.head.appendChild(style);
})();
