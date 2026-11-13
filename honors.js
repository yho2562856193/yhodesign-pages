import {copy,getLanguage} from './i18n.js';
import {icons} from './icons.js';
import {exhibitionHonorRecords} from './honors-order.js';
import {coverFlowLayout} from './honors-layout.js';
import {honorCategories,filterHonors,sortHonorsByDate} from './honors-categories.js';
import {mountLiquidGlass} from './glass.js';
const deckSeed=Math.floor(Math.random()*0xffffffff);

const categories=honorCategories;
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=file=>`assets/${file}`;
const mod=(value,length)=>((value%length)+length)%length;
const difference=(value,length)=>mod(value+length/2,length)-length/2;
function records(items){return items.map((item,i)=>({...item,id:String(item.id??`honor-${i}`),category:item.category||'competition'}));}
function categoryKey(value){return categories.some(c=>c.id===value)?value:['scholarship','personal'].includes(value)?'recognition':'all';}
function materialName(kind){return kind==='notification'?copy('获奖通知','Award notification','獲獎通知'):kind==='announcement'?copy('表彰文件','Recognition document','表彰文件'):copy('获奖证书','Award certificate','獲獎證書');}
function captionFields(caption){
  return Object.fromEntries(['year','kind','kind-separator','level','name','work','related'].map(key=>[key,caption.querySelector(`[data-honors-${key}]`)]));
}
function writeCaption(fields,honor,links){
  const showKind=honor.materialKind==='notification'||honor.materialKind==='announcement';
  fields.year.textContent=honor.year||'';
  fields.kind.textContent=showKind?materialName(honor.materialKind):'';
  fields.kind.hidden=fields['kind-separator'].hidden=!showKind;
  fields.level.textContent=honor.level||'';
  fields.name.textContent=honor.name||'';
  fields.work.textContent=honor.work||'';
  fields.work.hidden=!honor.work;
  fields.related.replaceChildren(...links.map(link=>{
    const anchor=document.createElement('a');
    anchor.href=link.href;anchor.textContent=link.label+' ↗';
    return anchor;
  }));
}
const pauseIcon='<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="7" y="5" width="3" height="14" rx="1"/><rect x="14" y="5" width="3" height="14" rx="1"/></svg>';
const playIcon='<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.8a.8.8 0 0 1 1.2-.7l10 6.2a.8.8 0 0 1 0 1.4l-10 6.2A.8.8 0 0 1 8 18.2Z"/></svg>';
const pauseLabel=()=>copy('暂停自动轮换','Pause automatic rotation','暫停自動輪播');
function filterMarkup(items,selected){return `<div class="honors-filter-wrap"><nav class="honors-categories nav" data-honors-filter aria-label="${copy('荣誉分类','Filter honours','榮譽分類')}">${categories.map(({id,...labels})=>`<a href="#/honors" role="button" class="honors-category" data-honors-category="${id}" aria-pressed="${id===selected}"${id===selected?' aria-current="true"':''}><span>${labels[getLanguage()]??labels.zh}</span><span class="honors-category-count">${filterHonors(items,id).length}</span></a>`).join('')}</nav></div>`;}
function directoryRows(items,selectedId){return sortHonorsByDate(items).map(h=>`<article class="honors-list-item${h.id===selectedId?' is-active':''}" id="honor-row-${escape(h.id)}" data-reading-anchor data-honor-row="${escape(h.id)}"><button type="button" class="honors-list-select" data-honors-select="${escape(h.id)}"${h.id===selectedId?' aria-current="true"':''} aria-label="${escape(copy('在证书墙中查看：','Show in certificate gallery: ','在證書牆查看：')+[h.name,h.level,h.work].filter(Boolean).join(' · '))}"><span class="honors-list-year">${escape(h.year)}</span><span class="honors-list-copy"><span class="honors-list-name">${escape(h.name)}</span>${h.work?`<span class="honors-list-work">${escape(h.work)}</span>`:''}${h.materialKind&&h.materialKind!=='certificate'?`<span class="honors-list-material">${materialName(h.materialKind)}</span>`:''}</span><strong class="honors-list-level">${escape(h.level)}</strong><span class="honors-list-arrow" aria-hidden="true">↑</span></button><button type="button" class="honors-list-certificate" data-honors-proof="${escape(h.id)}" aria-label="${escape(copy('查看证书：','View certificate: ','查看證明文件：')+h.name+' · '+h.level)}">${icons.search||''}</button></article>`).join('');}

export function honorsMarkup({honors,category='all',selectedId}={}){
  const items=records(honors||[]),selected=categoryKey(category),filtered=filterHonors(items,selected);
  return `<section class="honors-exhibition" aria-labelledby="honors-title" data-honors-exhibition>
    <header class="honors-heading shell"><h1 id="honors-title">${copy('荣誉','Honours','榮譽')}</h1></header>
    <div class="shell">${filterMarkup(items,selected)}</div>
    <div class="honors-stage" data-honors-stage role="region" aria-roledescription="${copy('轮播','carousel','輪播')}" aria-label="${copy('奖项证书封面墙','Award certificate Cover Flow','獎項證書牆')}" aria-describedby="honors-instructions" tabindex="0"><div class="honors-track" data-honors-track></div><p class="honors-empty" data-honors-empty hidden>${copy('这个分类还没有荣誉记录。','There are no records in this category yet.','這個分類暫未有榮譽紀錄。')}</p></div>
    <div class="honors-caption" data-honors-caption>
      <p class="honors-caption-meta"><span data-honors-year></span><span data-honors-kind-separator aria-hidden="true" hidden>·</span><span data-honors-kind hidden></span></p>
      <p class="honors-caption-level" data-honors-level></p>
      <h2 data-honors-name></h2><p class="honors-caption-work" data-honors-work></p>
      <div class="honors-related" data-honors-related></div>
    </div>
    <div class="honors-controls" data-honors-controls><button type="button" class="honors-step" data-honors-step="-1" aria-label="${copy('上一项荣誉','Previous award','上一項榮譽')}">${icons.back||''}</button><p class="honors-counter" data-honors-counter aria-label="${copy('当前奖项序号','Current award number','目前獎項次序')}"></p><button type="button" class="honors-step honors-step-next" data-honors-step="1" aria-label="${copy('下一项荣誉','Next award','下一項榮譽')}">${icons.back||''}</button><button type="button" class="honors-auto" data-honors-auto aria-label="${pauseLabel()}">${pauseIcon}</button></div>
    <section class="honors-directory shell" id="honors-directory" aria-labelledby="honors-directory-title"><header class="honors-directory-heading"><h2 id="honors-directory-title">${copy('全部荣誉','All honours','全部榮譽')}</h2><span data-honors-directory-count aria-live="polite">${filtered.length}</span></header>${filterMarkup(items,selected)}<div class="honors-list" data-honors-list>${directoryRows(filtered,selectedId)}</div></section>
    <p class="sr-only" id="honors-instructions">${copy('左右拖动或使用方向键切换，点击中央证书查看大图。','Drag horizontally or use arrow keys to browse. Select the centre certificate to enlarge it.','左右拖曳或使用方向鍵切換，點按中央證書可放大查看。')}</p>
    <p class="sr-only" data-honors-status role="status" aria-live="polite" aria-atomic="true"></p>
  </section>`;
}

export function mountHonors(root,{honors=[],initialCategory='all',initialId,initialAutoplay=true,onSelectionChange=()=>{},onOpen=()=>{},linksForHonor=()=>[]}={}){
  const exhibition=root.querySelector('[data-honors-exhibition]');
  if(!exhibition)return {destroy(){},selectById(){return false;},getState(){return {category:'all',id:null};}};
  const all=exhibitionHonorRecords(records(honors),deckSeed),stage=exhibition.querySelector('[data-honors-stage]'),track=exhibition.querySelector('[data-honors-track]');
  const caption=exhibition.querySelector('[data-honors-caption]'),counter=exhibition.querySelector('[data-honors-counter]'),empty=exhibition.querySelector('[data-honors-empty]'),status=exhibition.querySelector('[data-honors-status]');
  const fields=captionFields(caption),captionLinks=new Map(all.map(honor=>[honor.id,linksForHonor(honor)]));
  const captionTemplate=caption.cloneNode(true);
  captionTemplate.removeAttribute('data-honors-caption');
  captionTemplate.classList.add('honors-caption-measure');
  captionTemplate.setAttribute('aria-hidden','true');
  captionTemplate.inert=true;
  const filterButtons=[...exhibition.querySelectorAll('[data-honors-category]')],stepButtons=[...exhibition.querySelectorAll('[data-honors-step]')];
  const list=exhibition.querySelector('[data-honors-list]'),directoryCount=exhibition.querySelector('[data-honors-directory-count]');
  const filterNavs=[...exhibition.querySelectorAll('[data-honors-filter]')];
  const glasses=filterNavs.map(nav=>mountLiquidGlass(nav,{cloneFilter:true}));
  const autoButton=exhibition.querySelector('[data-honors-auto]');
  const controls=exhibition.querySelector('[data-honors-controls]');
  const abort=new AbortController(),options={signal:abort.signal},motion=matchMedia('(prefers-reduced-motion: reduce)');
  const nodes=new Map(),ratios=new Map(),layoutCache=new Map();
  let category=categoryKey(initialCategory);
  let items=category==='all'?all.slice():exhibitionHonorRecords(filterHonors(all,category),deckSeed,{category});
  if(initialId&&all.some(h=>h.id===initialId)&&!items.some(h=>h.id===initialId)){category='all';items=all.slice();}
  let phase=Math.max(0,items.findIndex(h=>h.id===initialId)),captionId=null,notifiedId=null,destroyed=false;
  let frame=0,animation=null,pointer=null,suppressClickUntil=0,lastAnnouncement='',geometry={width:0,height:0,coverWidth:0,coverHeight:0,radius:0,limit:7};
  let autoRequested=initialAutoplay!==false,autoTimer=0,inView=!('IntersectionObserver'in window);
  let hovering=matchMedia('(hover: hover)').matches&&stage.matches(':hover');
  let settledCaptionId=current()?.id,captionAnimation=null,measuredWidth=0;

  function focusHoldsAuto(){
    const active=document.activeElement;
    return active?.matches(':focus-visible')&&(filterNavs[0].contains(active)||stage.contains(active)||caption.contains(active)||controls.contains(active));
  }
  function autoBlocked(){
    return destroyed||!autoRequested||motion.matches||items.length<2||document.hidden||!inView||hovering||pointer||focusHoldsAuto()||document.querySelector('dialog[open]');
  }
  function updateAuto(){
    const playing=autoRequested&&!motion.matches;
    const label=motion.matches?copy('自动轮换已关闭','Automatic rotation disabled','已關閉自動輪播'):playing?pauseLabel():copy('开启自动轮换','Start automatic rotation','啟動自動輪播');
    if(autoButton.title!==label){
      autoButton.innerHTML=playing?pauseIcon:playIcon;
      autoButton.setAttribute('aria-label',label);autoButton.title=label;
    }
    autoButton.disabled=motion.matches||items.length<2;
    stage.dataset.autoplay=animation?.automatic?'moving':autoBlocked()?'paused':'waiting';
  }
  function clearAuto(){clearTimeout(autoTimer);autoTimer=0;}
  function scheduleAuto(delay=6500){
    clearAuto();updateAuto();
    if(autoBlocked()||animation)return;
    autoTimer=setTimeout(()=>{
      autoTimer=0;
      if(autoBlocked()){updateAuto();return;}
      animateTo(Math.round(phase)+1,true);
    },delay);
  }
  function activity(){scheduleAuto(7500);}
  function suspendAuto(){
    clearAuto();
    if(animation?.automatic){
      stopAnimation();
      phase=mod(Math.round(phase),items.length);
      paint();
      settledCaptionId=current()?.id;
    }
    updateAuto();
  }

  function current(){return items.length?items[mod(Math.round(phase),items.length)]:null;}
  function announce(){
    const honor=current();if(!honor)return;
    const index=mod(Math.round(phase),items.length);
    const message=copy(
      `第 ${index+1} 项，共 ${items.length} 项。${honor.name}，${honor.level}。`,
      `${index+1} of ${items.length}. ${honor.name}. ${honor.level}.`,
      `第 ${index+1} 項，共 ${items.length} 項。${honor.name}，${honor.level}。`
    );
    if(message!==lastAnnouncement){status.textContent=message;lastAnnouncement=message;}
  }
  function notify(){
    const honor=current(),key=`${category}:${honor?.id||''}:${autoRequested}`;
    if(notifiedId!==key){notifiedId=key;onSelectionChange({category,id:honor?.id||null,autoplay:autoRequested});}
  }
  function syncFilters(){
    filterButtons.forEach(button=>{const selected=button.dataset.honorsCategory===category;button.setAttribute('aria-pressed',String(selected));if(selected)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');});
    for(const nav of filterNavs){const active=nav.querySelector('[aria-current]'),wrap=nav.parentElement;if(active&&wrap.scrollWidth>wrap.clientWidth)wrap.scrollTo({left:Math.max(0,wrap.scrollLeft+active.getBoundingClientRect().left-wrap.getBoundingClientRect().left-(wrap.clientWidth-active.offsetWidth)/2),behavior:'instant'});}
    glasses.forEach(glass=>glass?.refresh());
  }
  function updateDirectorySelection(id){
    for(const row of list.querySelectorAll('[data-honor-row]')){const selected=row.dataset.honorRow===id;row.classList.toggle('is-active',selected);const button=row.querySelector('[data-honors-select]');if(selected)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');}
  }
  function renderDirectory(){const ordered=filterHonors(records(honors),category);list.innerHTML=directoryRows(ordered,current()?.id);directoryCount.textContent=String(ordered.length);}
  function updateCaption(){
    const honor=current(),id=honor?.id||null;
    caption.hidden=!honor;
    if(id!==captionId){
      captionId=id;
      if(honor){
        writeCaption(fields,honor,captionLinks.get(id));
        caption.dataset.honorId=honor.id;
      }
      updateDirectorySelection(id);
    }
    const index=honor?mod(Math.round(phase),items.length)+1:0;
    counter.textContent=`${String(index).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
    stepButtons.forEach(button=>button.disabled=items.length<2);
    empty.hidden=items.length>0;
    notify();
  }
  function measureCaption(force=false){
    if(destroyed||!all.length||caption.hidden)return;
    const width=caption.getBoundingClientRect().width;
    if(!width||(!force&&width===measuredWidth))return;
    measuredWidth=width;
    // Reserve the tallest caption at this width, including wrapped links.
    const fragment=document.createDocumentFragment();
    const probes=all.map(honor=>{
      const probe=captionTemplate.cloneNode(true);
      probe.style.width=`${width}px`;
      writeCaption(captionFields(probe),honor,captionLinks.get(honor.id));
      fragment.append(probe);
      return probe;
    });
    exhibition.append(fragment);
    const height=Math.ceil(Math.max(...probes.map(probe=>probe.getBoundingClientRect().height)));
    probes.forEach(probe=>probe.remove());
    caption.style.setProperty('--honors-caption-reserve',`${height}px`);
  }
  function fadeSettledCaption(){
    const id=current()?.id;
    if(settledCaptionId===id)return;
    settledCaptionId=id;
    if(!id||motion.matches||document.hidden||!caption.animate||matchMedia('(prefers-contrast: more), (forced-colors: active)').matches)return;
    captionAnimation?.cancel();
    captionAnimation=caption.animate([{opacity:.82},{opacity:1}],{duration:180,easing:'ease-out'});
  }
  function sizePaper(node){
    const ratio=node.ratio||.707;
    const height=Math.min(geometry.coverHeight,geometry.coverWidth/ratio),width=height*ratio;
    node.paper.style.width=`${width}px`;node.paper.style.height=`${height}px`;
    node.button.style.width=`${width}px`;node.button.style.height=`${height}px`;
  }
  function createCard(honor,index){
    const button=document.createElement('button');button.type='button';button.className='honors-cover';
    button.dataset.honorId=honor.id;button.dataset.honorIndex=String(index);button.tabIndex=-1;
    button.setAttribute('aria-label',`${honor.name} · ${honor.level}${honor.work?` · ${honor.work}`:''}`);
    button.innerHTML=`<span class="honors-paper"><img class="honors-certificate" src="${escape(asset(honor.certificate||honor.full))}" alt="" draggable="false" decoding="async"><span class="honors-reflection" aria-hidden="true"><img src="${escape(asset(honor.certificate||honor.full))}" alt="" draggable="false" decoding="async"></span></span>`;
    const image=button.querySelector('.honors-certificate'),paper=button.querySelector('.honors-paper');
    const node={button,image,paper,ratio:ratios.get(honor.id)||0};
    function loaded(){if(destroyed)return;node.ratio=image.naturalWidth/image.naturalHeight||.707;ratios.set(honor.id,node.ratio);layoutCache.clear();sizePaper(node);queuePaint();}
    image.onload=loaded;
    image.onerror=()=>{button.classList.add('honors-cover-unavailable');button.setAttribute('aria-label',`${button.getAttribute('aria-label')} · ${copy('证明图片暂时无法加载','Supporting image is temporarily unavailable','證明圖片暫時未能載入')}`);};
    if(image.complete&&image.naturalWidth)loaded();else sizePaper(node);
    track.append(button);return node;
  }
  function removeCard(node){node.image.onload=null;node.image.onerror=null;node.button.remove();}
  function layoutAt(center){
    const key=mod(center,items.length);
    if(!layoutCache.has(key))layoutCache.set(key,coverFlowLayout(items.map(h=>Math.min(geometry.coverWidth,geometry.coverHeight*(ratios.get(h.id)||.707))),key,geometry));
    return layoutCache.get(key);
  }
  function paint(){
    if(destroyed)return;
    updateCaption();
    if(!items.length){for(const node of nodes.values())removeCard(node);nodes.clear();stage.dataset.visibleCount='0';return;}
    const nearest=mod(Math.round(phase),items.length),limit=Math.min(geometry.limit,items.length);
    const visible=items.map((honor,index)=>({honor,index,distance:difference(index-phase,items.length)})).sort((a,b)=>Math.abs(a.distance)-Math.abs(b.distance)||a.index-b.index).slice(0,limit);
    const keep=new Set(visible.map(({honor})=>honor.id));
    for(const [id,node] of nodes){if(!keep.has(id)){if(node.button===document.activeElement)stage.focus({preventScroll:true});removeCard(node);nodes.delete(id);}}
    const base=Math.floor(phase),fraction=phase-base,before=layoutAt(base),after=layoutAt(base+1);
    stage.dataset.paperGap=before.gap.toFixed(2);
    for(const {honor,index,distance:d} of visible){
      let node=nodes.get(honor.id);if(!node){node=createCard(honor,index);nodes.set(honor.id,node);}
      const a=Math.abs(d),near=Math.min(1,a),far=Math.max(0,a-1);
      const from=before.cards.get(index)||after.cards.get(index),to=after.cards.get(index)||from;
      const blend=key=>from[key]+(to[key]-from[key])*fraction;
      const x=blend('x'),z=blend('z'),angle=blend('angle'),scale=blend('scale'),lift=blend('lift');
      node.button.style.transform=`translateX(-50%) translate3d(${x.toFixed(3)}px,${lift.toFixed(3)}px,${z.toFixed(3)}px) rotateY(${angle.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
      node.button.style.zIndex=String(1000-Math.round(a*100));
      node.button.style.opacity=String(Math.max(.58,1-.14*near-.09*far));
      const active=index===nearest;
      node.button.classList.toggle('is-centred',active);node.button.setAttribute('aria-current',String(active));node.button.tabIndex=active?0:-1;
    }
    stage.dataset.visibleCount=String(visible.length);
    stage.dataset.currentId=current()?.id||'';
    stage.dataset.currentIndex=String(nearest);
  }
  function queuePaint(){if(!frame&&!destroyed)frame=requestAnimationFrame(()=>{frame=0;paint();});}
  function stopAnimation(){
    if(frame){cancelAnimationFrame(frame);frame=0;}
    animation=null;
    captionAnimation?.cancel();
    captionAnimation=null;
  }
  function settle(){
    const automatic=animation?.automatic;
    if(items.length)phase=mod(Math.round(phase),items.length);
    animation=null;paint();fadeSettledCaption();if(!automatic)announce();scheduleAuto();
  }
  function animateTo(target,automatic=false){
    stopAnimation();
    clearAuto();
    if(items.length<2||motion.matches||Math.abs(target-phase)<.002){phase=target;settle();return;}
    animation={from:phase,to:target,start:performance.now(),duration:automatic?1800:Math.min(580,330+Math.abs(target-phase)*55),automatic};
    if(automatic)stage.dataset.autoplay='moving';
    const tick=now=>{
      frame=0;if(destroyed||!animation)return;
      const elapsed=Math.min(1,(now-animation.start)/animation.duration),eased=1-Math.pow(1-elapsed,4);
      phase=animation.from+(animation.to-animation.from)*eased;paint();
      if(elapsed<1)frame=requestAnimationFrame(tick);else{phase=animation.to;settle();}
    };
    frame=requestAnimationFrame(tick);
  }
  function step(direction){if(items.length<2)return;activity();const base=animation?animation.to:Math.round(phase);cancelPointer();animateTo(base+direction);}
  function chooseIndex(index){if(!items.length)return;animateTo(phase+difference(index-phase,items.length));}
  function clearCards(){for(const node of nodes.values())removeCard(node);nodes.clear();layoutCache.clear();captionId=null;}
  function setCategory(next){
    stopAnimation();cancelPointer();category=categoryKey(next);items=category==='all'?all.slice():exhibitionHonorRecords(filterHonors(all,category),deckSeed,{category});phase=0;clearCards();
    syncFilters();renderDirectory();
    resize();fadeSettledCaption();announce();activity();
  }
  function selectById(id,{scroll=false}={}){
    const honor=all.find(h=>h.id===id);if(!honor)return false;
    stopAnimation();cancelPointer();clearAuto();
    if(!items.some(h=>h.id===id)){category='all';items=all.slice();clearCards();syncFilters();renderDirectory();}
    phase=items.findIndex(h=>h.id===id);paint();fadeSettledCaption();announce();activity();
    if(scroll)stage.scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'center'});
    return true;
  }
  function resize(){
    if(destroyed)return;
    const width=stage.clientWidth,height=stage.clientHeight,viewport=window.innerWidth,mobile=viewport<768;
    const limit=viewport>=1024?7:viewport>=768?5:3;
    geometry={width,height,coverWidth:Math.min(mobile?360:660,width*(mobile?.8:.50)),coverHeight:Math.max(150,height-(mobile?73:90)),radius:Math.floor(limit/2),limit,perspective:parseFloat(getComputedStyle(stage).perspective)||1150};
    layoutCache.clear();
    stage.style.setProperty('--honor-cover-width',`${geometry.coverWidth}px`);stage.style.setProperty('--honor-cover-height',`${geometry.coverHeight}px`);
    nodes.forEach(sizePaper);paint();measureCaption();
  }
  function cancelPointer(){
    if(pointer&&stage.hasPointerCapture?.(pointer.id)){try{stage.releasePointerCapture(pointer.id);}catch{}}
    pointer=null;stage.classList.remove('is-dragging');
  }
  function finishPointer(event,cancelled=false){
    if(!pointer||event.pointerId!==pointer.id)return;
    const drag=pointer,wasDragging=drag.dragging;
    cancelPointer();
    activity();
    if(wasDragging){
      suppressClickUntil=performance.now()+350;
      const velocity=cancelled||motion.matches||performance.now()-drag.lastTime>100?0:drag.velocity;
      const projection=Math.max(-2.6,Math.min(2.6,velocity*160));
      animateTo(Math.round(phase+projection));
    }
    else if(Math.abs(phase-Math.round(phase))>.002)animateTo(Math.round(phase));
  }
  stage.addEventListener('pointerdown',event=>{
    if(event.button!==0||items.length<2||event.isPrimary===false)return;
    stopAnimation();
    clearAuto();
    pointer={id:event.pointerId,startX:event.clientX,startY:event.clientY,lastX:event.clientX,lastTime:performance.now(),startPhase:phase,velocity:0,dragging:false};
    updateAuto();
  },options);
  stage.addEventListener('pointerenter',event=>{
    if(event.pointerType!=='touch'){hovering=true;suspendAuto();}
  },options);
  stage.addEventListener('pointerleave',event=>{
    if(event.pointerType!=='touch'){hovering=false;activity();}
  },options);
  stage.addEventListener('pointermove',event=>{
    if(!pointer||event.pointerId!==pointer.id)return;
    const dx=event.clientX-pointer.startX,dy=event.clientY-pointer.startY;
    if(!pointer.dragging){
      if(Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)*1.15){finishPointer(event,true);return;}
      if(Math.abs(dx)<7||Math.abs(dx)<Math.abs(dy)*1.1)return;
      pointer.dragging=true;stage.classList.add('is-dragging');stage.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    const unit=Math.max(110,Math.min(245,geometry.width*.3)),now=performance.now(),dt=Math.max(1,now-pointer.lastTime);
    const velocity=-(event.clientX-pointer.lastX)/unit/dt;
    pointer.velocity=velocity*.7+pointer.velocity*.3;pointer.lastX=event.clientX;pointer.lastTime=now;
    phase=pointer.startPhase-dx/unit;queuePaint();
  },{...options,passive:false});
  stage.addEventListener('pointerup',event=>finishPointer(event),options);
  stage.addEventListener('pointercancel',event=>finishPointer(event,true),options);
  window.addEventListener('pointerup',event=>finishPointer(event),options);
  window.addEventListener('pointercancel',event=>finishPointer(event,true),options);
  stage.addEventListener('lostpointercapture',event=>finishPointer(event,true),options);
  stage.addEventListener('dragstart',event=>event.preventDefault(),options);
  stage.addEventListener('click',event=>{
    const button=event.target.closest('.honors-cover');if(!button)return;
    if(performance.now()<suppressClickUntil){event.preventDefault();return;}
    const index=Number(button.dataset.honorIndex);
    if(index===mod(Math.round(phase),items.length)&&Math.abs(phase-Math.round(phase))<.03){onOpen(items[index],button);}
    else chooseIndex(index);
  },options);
  stage.addEventListener('keydown',event=>{
    if(document.querySelector('dialog[open]'))return;
    if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
      event.preventDefault();
      if(event.target!==stage)stage.focus({preventScroll:true});
      if(event.key==='ArrowLeft'||event.key==='ArrowRight')step(event.key==='ArrowLeft'?-1:1);
      else chooseIndex(event.key==='Home'?0:items.length-1);
    }
    else if((event.key==='Enter'||event.key===' ')&&event.target===stage){event.preventDefault();const honor=current();if(honor)onOpen(honor,stage);}
  },options);
  filterButtons.forEach(button=>{
    button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();setCategory(button.dataset.honorsCategory);},options);
    button.addEventListener('keydown',event=>{if(event.code==='Space'){event.preventDefault();button.click();}},options);
  });
  list.addEventListener('click',event=>{
    const selected=event.target.closest('[data-honors-select]'),proof=event.target.closest('[data-honors-proof]');
    if(selected){selectById(selected.dataset.honorsSelect,{scroll:true});if(event.detail===0)stage.focus({preventScroll:true});}
    if(proof){const id=proof.dataset.honorsProof;selectById(id);const honor=all.find(h=>h.id===id);if(honor)onOpen(honor,proof);}
  },options);
  stepButtons.forEach(button=>button.addEventListener('click',()=>step(Number(button.dataset.honorsStep)),options));
  autoButton.addEventListener('click',()=>{
    autoRequested=!autoRequested;
    if(autoRequested)scheduleAuto(1500);
    else suspendAuto();
    notify();
  },options);
  exhibition.addEventListener('pointerdown',activity,options);
  exhibition.addEventListener('keydown',activity,options);
  exhibition.addEventListener('wheel',activity,{...options,passive:true});
  function syncFocusAuto(){
    queueMicrotask(()=>{
      if(destroyed)return;
      if(focusHoldsAuto()||document.querySelector('dialog[open]'))suspendAuto();
      else if(!autoTimer&&!animation)activity();
    });
  }
  document.addEventListener('focusin',syncFocusAuto,options);
  exhibition.addEventListener('focusout',syncFocusAuto,options);
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('close',activity,options));
  window.addEventListener('resize',resize,options);
  motion.addEventListener('change',()=>{stopAnimation();cancelPointer();phase=Math.round(phase);settle();},options);
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden){activity();return;}
    clearAuto();stopAnimation();cancelPointer();phase=Math.round(phase);paint();
    settledCaptionId=current()?.id;
    updateAuto();
  },options);
  const intersection='IntersectionObserver'in window?new IntersectionObserver(entries=>{
    if(destroyed)return;
    const entry=entries.at(-1);
    inView=entry.isIntersecting&&entry.intersectionRatio>=.25;
    if(inView)activity();else suspendAuto();
  },{threshold:.25}):null;intersection?.observe(stage);
  const observer='ResizeObserver'in window?new ResizeObserver(resize):null;observer?.observe(stage);
  syncFilters();renderDirectory();
  resize();
  document.fonts?.ready.then(()=>measureCaption(true));
  scheduleAuto(7500);
  return {
    getState(){return {category,id:current()?.id||null,autoplay:autoRequested};},
    selectById,
    destroy(){destroyed=true;clearAuto();stopAnimation();cancelPointer();abort.abort();observer?.disconnect();intersection?.disconnect();glasses.forEach(glass=>glass?.destroy());clearCards();}
  };
}
