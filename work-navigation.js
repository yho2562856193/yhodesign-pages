import {mountLiquidGlass} from './glass.js';

// Reveal on intent to navigate; give the artwork room during continuous reading.
export function mountWorkNavigation(root){
 const nav=root.querySelector('.case-section-nav');
 if(!nav)return {destroy(){}};
 const links=[...nav.querySelectorAll('[data-scroll]')],track=nav.querySelector('[data-glass-track]');
 const sections=links.map(link=>({link,target:root.querySelector(`#${link.dataset.scroll}`)})).filter(x=>x.target);
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const glass=mountLiquidGlass(nav,{cloneFilter:true});
 const disposers=[];
 let destroyed=false,frame=0,idleTimer=0,lastY=window.scrollY,travel=0,direction=0,activeId='',holdUntil=performance.now()+900,held=false;
 const listen=(target,type,handler,options)=>{target.addEventListener(type,handler,options);disposers.push(()=>target.removeEventListener(type,handler,options));};
 function ensureActiveVisible(){
  if(!track||held||nav.dataset.visibility==='hidden')return;
  const focused=links.find(link=>link===document.activeElement&&link.matches(':focus-visible'));
  const current=focused||sections.find(x=>x.target.id===activeId)?.link;if(!current)return;
  const item=current.getBoundingClientRect(),bounds=track.getBoundingClientRect();
  if(item.left<bounds.left+4||item.right>bounds.right-4)track.scrollTo({left:current.offsetLeft-(track.clientWidth-current.offsetWidth)/2,behavior:'instant'});
 }
 function show(){
  if(destroyed)return;
  const changed=nav.dataset.visibility==='hidden';nav.dataset.visibility='visible';delete nav.dataset.glassSuspended;
  if(changed){glass?.refresh();ensureActiveVisible();}
 }
 function hide(){
  if(destroyed||reduced.matches||held||(nav.contains(document.activeElement)&&document.activeElement.matches(':focus-visible'))||performance.now()<holdUntil)return;
  nav.dataset.visibility='hidden';nav.dataset.glassSuspended='true';
 }
 function updateActive(){
  const top=Number.parseFloat(getComputedStyle(nav).top)||0,readingLine=top+nav.offsetHeight+32;
  let current=sections[0];for(const section of sections)if(section.target.getBoundingClientRect().top<=readingLine)current=section;
  const last=sections[sections.length-1];
  if(last&&window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-3&&last.target.getBoundingClientRect().top<window.innerHeight)current=last;
  if(!current||current.target.id===activeId)return;
  activeId=current.target.id;for(const section of sections){if(section===current)section.link.setAttribute('aria-current','location');else section.link.removeAttribute('aria-current');}
  ensureActiveVisible();
 }
 function sampleScroll(){
  frame=0;if(destroyed)return;
  const y=Math.max(0,window.scrollY),delta=y-lastY;lastY=y;updateActive();
  const stickyTop=Number.parseFloat(getComputedStyle(nav).top)||0,pinned=nav.getBoundingClientRect().top<=stickyTop+2;
  if(!pinned||reduced.matches){travel=0;direction=0;show();return;}
  if(Math.abs(delta)<1)return;
  const nextDirection=Math.sign(delta);travel=nextDirection===direction?travel+Math.abs(delta):Math.abs(delta);direction=nextDirection;
  if(delta<0&&travel>=5)show();else if(delta>0&&travel>=18)hide();
 }
 function onScroll(){
  if(!frame)frame=requestAnimationFrame(sampleScroll);
  clearTimeout(idleTimer);idleTimer=setTimeout(()=>{travel=0;direction=0;show();updateActive();},700);
 }
 function onResize(){lastY=window.scrollY;travel=0;show();updateActive();glass?.refresh();}
 function hold(){held=true;show();}
 function release(){held=false;holdUntil=performance.now()+250;}
 listen(window,'scroll',onScroll,{passive:true});listen(window,'resize',onResize,{passive:true});
 listen(nav,'pointerenter',show);listen(nav,'pointerleave',release);
 listen(nav,'pointermove',()=>{show();holdUntil=performance.now()+250;},{passive:true});
 listen(nav,'pointerdown',hold);listen(window,'pointerup',release,{passive:true});listen(window,'pointercancel',release,{passive:true});
 listen(nav,'focusin',()=>{show();ensureActiveVisible();});
 listen(nav,'click',()=>{show();holdUntil=performance.now()+1000;travel=0;});
 listen(nav,'transitionend',event=>{if(event.target===nav&&nav.dataset.visibility!=='hidden')glass?.refresh();});
 listen(reduced,'change',()=>{show();travel=0;direction=0;});
 listen(window,'blur',()=>{held=false;lastY=window.scrollY;travel=0;direction=0;show();});
 listen(document,'visibilitychange',()=>{held=false;clearTimeout(idleTimer);cancelAnimationFrame(frame);frame=0;if(!document.hidden){lastY=window.scrollY;show();updateActive();}});
 nav.dataset.visibility='visible';updateActive();
 return {destroy(){if(destroyed)return;destroyed=true;clearTimeout(idleTimer);cancelAnimationFrame(frame);for(const dispose of disposers)dispose();glass?.destroy();}};
}
