// Small, once-per-session details. Static markup always contains the real values.
// Keys survive language and route reconstruction within this browser session.
const countedKeys=new Set();
const revealedKeys=new Set();
const clamp=value=>Math.max(0,Math.min(1,Number.isFinite(value)?value:0));
const readingInset=24;
const visibleFraction=.12;

export function formatCountValue(value,decimals=0){
  const number=Number(value),places=Math.max(0,Math.min(3,Math.trunc(Number(decimals)||0)));
  return (Number.isFinite(number)?number:0).toFixed(places);
}

export function countValueAt(value,progress,decimals=0){
  const p=clamp(progress),target=Number(value);
  return formatCountValue((Number.isFinite(target)?target:0)*(1-Math.pow(1-p,3)),decimals);
}

export function mountAboutMotion(root){
  const counters=[...root.querySelectorAll('[data-count-value]')];
  // Each surface gets one reveal. Nested motion would amplify the travel.
  const surfaces=[...root.querySelectorAll('[data-about-reveal]')].filter(element=>!element.parentElement?.closest('[data-about-reveal]'));
  if(!counters.length&&!surfaces.length)return {destroy(){}};

  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const abort=new AbortController(),events={signal:abort.signal};
  const activeCounts=new Map(),activeReveals=new Map(),pendingCounts=new Map(),pendingReveals=new Map();
  const countCandidates=new Set();
  let disposed=false,frame=0,countTimer=0;

  function inReadingArea(element){
    const bounds=element.getBoundingClientRect();
    const visibleHeight=Math.min(bounds.bottom,window.innerHeight-readingInset)-Math.max(bounds.top,0);
    return bounds.width>0&&bounds.height>0&&visibleHeight>=bounds.height*visibleFraction;
  }

  function scheduleCountStart(){
    clearTimeout(countTimer);
    countTimer=0;
    if(disposed||document.hidden||!countCandidates.size)return;
    // Route and language anchors restore their position over the first frames.
    // Wait for scroll to settle, then measure again before claiming the count.
    countTimer=setTimeout(()=>{
      countTimer=0;
      for(const element of countCandidates)if(inReadingArea(element))beginCount(element);
      countCandidates.clear();
    },90);
  }

  function queueCount(element){
    if(!pendingCounts.has(element)||document.hidden)return;
    if(motion.matches){beginCount(element);return;}
    countCandidates.add(element);
    scheduleCountStart();
  }

  function finishCount(element,track){
    element.textContent=track.final;
    element.style.minWidth=track.minWidth;
    activeCounts.delete(element);
    observer?.unobserve(element);
    if(!activeCounts.size&&frame){cancelAnimationFrame(frame);frame=0;}
  }
  function paintCounts(now){
    frame=0;
    if(disposed)return;
    if(document.hidden||motion.matches){finishActive();return;}
    for(const [element,track] of activeCounts){
      if(!element.isConnected){finishCount(element,track);continue;}
      const progress=clamp((now-track.start)/track.duration);
      element.textContent=countValueAt(track.value,progress,track.decimals);
      if(progress>=1)finishCount(element,track);
    }
    if(activeCounts.size)frame=requestAnimationFrame(paintCounts);
  }
  function beginCount(element){
    const track=pendingCounts.get(element);if(!track)return;
    if(document.hidden)return;
    pendingCounts.delete(element);
    if(motion.matches||countedKeys.has(track.key)){
      countedKeys.add(track.key);
      element.textContent=track.final;
      observer?.unobserve(element);
      return;
    }
    countedKeys.add(track.key);
    track.minWidth=element.style.minWidth;
    // The layout reserves the final number's width before the first changed digit.
    element.style.minWidth=`${element.getBoundingClientRect().width}px`;
    track.start=performance.now();
    element.textContent=formatCountValue(0,track.decimals);
    activeCounts.set(element,track);
    if(!frame)frame=requestAnimationFrame(paintCounts);
  }
  function beginReveal(element){
    const record=pendingReveals.get(element);if(!record||document.hidden)return;
    pendingReveals.delete(element);revealedKeys.add(record.key);observer?.unobserve(element);
    if(motion.matches||typeof element.animate!=='function')return;
    // Individual translate composes with the card's hover transform instead of
    // overriding it. The readable base surface is never made display:none/hidden.
    const animation=element.animate([
      {opacity:.86,translate:'0 6px'},
      {opacity:1,translate:'0 0'}
    ],{duration:320,delay:record.stagger*30,easing:'cubic-bezier(.22,.72,.28,1)',fill:'backwards'});
    activeReveals.set(element,animation);
    animation.finished.then(()=>{if(activeReveals.get(element)===animation)activeReveals.delete(element);},()=>{});
  }
  function finishActive(){
    clearTimeout(countTimer);countTimer=0;countCandidates.clear();
    if(frame){cancelAnimationFrame(frame);frame=0;}
    for(const [element,track] of activeCounts)finishCount(element,track);
    for(const animation of activeReveals.values())animation.cancel();
    activeReveals.clear();
  }
  function scanVisible(){
    if(disposed||document.hidden)return;
    for(const element of pendingCounts.keys())if(inReadingArea(element))queueCount(element);
    for(const element of pendingReveals.keys())if(inReadingArea(element))beginReveal(element);
  }

  // No observers means no motion: the complete static page remains usable.
  const observer=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(entries=>{
    if(disposed)return;
    for(const entry of entries){
      if(entry.isIntersecting&&entry.intersectionRatio>=visibleFraction){
        queueCount(entry.target);
        if(inReadingArea(entry.target))beginReveal(entry.target);
      }else{
        countCandidates.delete(entry.target);
        if(!entry.isIntersecting&&activeCounts.has(entry.target))finishCount(entry.target,activeCounts.get(entry.target));
      }
    }
  },{threshold:[0,visibleFraction],rootMargin:`0px 0px -${readingInset}px 0px`});

  for(const element of counters){
    const value=Number(element.dataset.countValue),decimals=Math.max(0,Math.min(3,Math.trunc(Number(element.dataset.countDecimals)||0)));
    if(!Number.isFinite(value))continue;
    const key=element.dataset.countKey||`value:${element.dataset.countValue}:${decimals}`;
    const final=formatCountValue(value,decimals);
    element.textContent=final;
    if(!observer||countedKeys.has(key))continue;
    pendingCounts.set(element,{key,value,decimals,final,duration:1150,minWidth:element.style.minWidth,start:0});
    observer.observe(element);
  }
  surfaces.forEach((element,index)=>{
    const context=element.id||element.closest('section[id],article[id]')?.id||'about';
    const key=element.dataset.aboutRevealKey||`${context}:${index}`;
    if(!observer||revealedKeys.has(key))return;
    const requested=Number(element.dataset.aboutStagger);
    pendingReveals.set(element,{key,stagger:Number.isFinite(requested)?Math.max(0,Math.min(3,requested)):index%4});
    observer.observe(element);
  });

  document.addEventListener('visibilitychange',()=>{if(document.hidden)finishActive();else scanVisible();},events);
  motion.addEventListener('change',()=>{if(motion.matches)finishActive();scanVisible();},events);
  window.addEventListener('scroll',()=>{if(countCandidates.size)scheduleCountStart();},{...events,passive:true});
  window.addEventListener('resize',()=>{finishActive();scanVisible();},{...events,passive:true});
  window.addEventListener('beforeprint',finishActive,events);

  return {destroy(){
    if(disposed)return;disposed=true;
    abort.abort();observer?.disconnect();finishActive();pendingCounts.clear();pendingReveals.clear();
  }};
}
