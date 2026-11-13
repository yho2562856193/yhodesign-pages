import {copy,t} from './i18n.js';

const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const easing='cubic-bezier(.22,.75,.26,1)';

function visibleThumbnail(trigger){
  const image=trigger?.querySelector('img');
  if(!image?.isConnected||!image.complete||!image.naturalWidth)return null;
  const rect=image.getBoundingClientRect();
  if(rect.width<12||rect.height<12||rect.left<0||rect.top<0||rect.right>innerWidth||rect.bottom>innerHeight)return null;
  return {rect,src:image.currentSrc||image.src,width:image.naturalWidth,height:image.naturalHeight};
}

export function mountImageViewer(dialog){
  const select=selector=>dialog.querySelector(selector);
  const image=select('#lightbox-image'),viewport=select('.lightbox-scroll');
  const previous=select('#image-prev'),next=select('#image-next'),zoom=select('#image-zoom');
  const hint=select('.keyboard-hint');
  let items=[],index=0,opener=null,revision=0,flight=null,closing=false,panelMotion=null,pictureMotion=null;
  let intrinsicWidth=0,intrinsicHeight=0;
  const canMove=()=>!reduced.matches&&typeof dialog.animate==='function';

  function stopFlight(){
    if(!flight)return;
    const current=flight;
    flight=null;
    current.animation.cancel();
    current.element.remove();
    image.style.visibility='';
    dialog.classList.remove('viewer-in-flight');
  }

  function fly(src,from,to,duration,onFinish){
    const element=new Image();
    element.className='viewer-flight';
    element.alt='';
    element.setAttribute('aria-hidden','true');
    element.src=src;
    Object.assign(element.style,{left:`${to.left}px`,top:`${to.top}px`,width:`${to.width}px`,height:`${to.height}px`});
    dialog.append(element);
    dialog.classList.add('viewer-in-flight');
    image.style.visibility='hidden';
    const animation=element.animate([
      {transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`},
      {transform:'none'}
    ],{duration,easing,fill:'both'});
    flight={element,animation};
    animation.finished.then(()=>{
      if(flight?.animation!==animation)return;
      stopFlight();onFinish?.();
    },()=>{});
  }

  function fittedRect(width,height){
    const bounds=viewport.getBoundingClientRect();
    if(width<=0||height<=0||!bounds.width||!bounds.height)return null;
    const scale=Math.min(1,bounds.width/width,bounds.height/height);
    const w=width*scale,h=height*scale;
    return {left:bounds.left+(bounds.width-w)/2,top:bounds.top+(bounds.height-h)/2,width:w,height:h};
  }

  function applyFit(){
    const fit=viewport.classList.contains('zoomed')?null:fittedRect(intrinsicWidth,intrinsicHeight);
    image.style.width=fit?`${fit.width}px`:'';
    image.style.height=fit?`${fit.height}px`:'';
  }

  function setZoom(enabled){
    viewport.classList.toggle('zoomed',enabled);
    viewport.tabIndex=enabled?0:-1;
    zoom.textContent=t(enabled?'适应窗口':'放大查看');
    zoom.setAttribute('aria-pressed',String(enabled));
    hint.textContent=enabled
      ?copy('方向键平移 · Esc 关闭','Arrow keys pan · Esc closes','方向鍵平移 · Esc 關閉')
      :t('← → 切换 · Esc 关闭');
    applyFit();
  }

  function fadeImage(opacity,duration){
    pictureMotion?.cancel();
    if(canMove()&&!flight)pictureMotion=image.animate([{opacity},{opacity:1}],{duration,easing});
  }

  function render(transition=false){
    const item=items[index],request=++revision;
    stopFlight();
    pictureMotion?.cancel();
    const thumb=item.origin?.querySelector('img');
    intrinsicWidth=item.width||thumb?.naturalWidth||0;
    intrinsicHeight=item.height||thumb?.naturalHeight||0;
    setZoom(false);
    viewport.scrollTo(0,0);
    if(item.width>0&&item.height>0){image.width=item.width;image.height=item.height;}
    else{image.removeAttribute('width');image.removeAttribute('height');}
    viewport.style.setProperty('--image-zoom-width',`${item.width||2400}px`);
    const caption=t(item.caption||'');
    image.alt=caption;
    image.removeAttribute('src');
    image.src=item.preview||item.src;
    select('#image-caption').textContent=caption;
    select('#image-count').textContent=`${index+1} / ${items.length}`;
    select('#image-download').href=item.src;
    previous.disabled=index===0;
    next.disabled=index===items.length-1;
    if(transition)fadeImage(.66,160);

    // Decode separately so the visible preview stays in place on slow connections.
    const original=new Image();
    original.onload=async()=>{
      try{await original.decode?.();}catch{}
      if(request!==revision||!dialog.open||closing)return;
      const replace=image.getAttribute('src')!==item.src;
      if(replace)image.src=item.src;
      viewport.style.setProperty('--image-zoom-width',`${item.width||original.naturalWidth}px`);
      intrinsicWidth=item.width||original.naturalWidth;
      intrinsicHeight=item.height||original.naturalHeight;
      applyFit();
      if(replace&&!viewport.classList.contains('zoomed'))fadeImage(.82,120);
    };
    original.src=item.src;
  }

  function dismiss(restoreFocus){
    revision++;
    stopFlight();
    panelMotion?.cancel();
    pictureMotion?.cancel();
    closing=false;
    const trigger=opener;
    opener=null;
    dialog.close();
    if(restoreFocus&&trigger?.isConnected)trigger.focus({preventScroll:true});
  }

  function close({immediate=false,restoreFocus=true}={}){
    if(!dialog.open)return;
    if(immediate||closing||!canMove()){dismiss(restoreFocus);return;}
    closing=true;
    const from=(flight?.element||image).getBoundingClientRect();
    const destination=visibleThumbnail(items[index]?.origin);
    const fitted=!viewport.classList.contains('zoomed');
    stopFlight();
    panelMotion?.cancel();
    pictureMotion?.cancel();
    const finish=()=>dismiss(restoreFocus);
    if(fitted&&destination&&from.width>0&&from.height>0){
      fly(destination.src,from,destination.rect,200,finish);
    }else{
      panelMotion=dialog.animate([{opacity:1},{opacity:0}],{duration:140,easing,fill:'forwards'});
      panelMotion.finished.then(finish,()=>{});
    }
  }

  function open(gallery,start,trigger){
    if(!gallery.length)return;
    if(dialog.open)dismiss(false);
    opener=trigger||document.activeElement;
    items=gallery;
    index=Math.max(0,Math.min(start,items.length-1));
    const source=visibleThumbnail(items[index].origin);
    dialog.showModal();
    document.body.classList.add('modal-open');
    render();
    if(!canMove())return;
    const target=source&&fittedRect(items[index].width||source.width,items[index].height||source.height);
    if(target)fly(source.src,source.rect,target,230);
    else panelMotion=dialog.animate([{opacity:.55},{opacity:1}],{duration:180,easing});
  }

  function step(direction){
    const target=index+direction;
    if(closing||target<0||target>=items.length)return;
    index=target;
    render(true);
    if(document.activeElement?.disabled)zoom.focus({preventScroll:true});
  }

  previous.addEventListener('click',()=>step(-1));
  next.addEventListener('click',()=>step(1));
  zoom.addEventListener('click',()=>{
    if(closing)return;
    stopFlight();
    const enabled=!viewport.classList.contains('zoomed');
    setZoom(enabled);
    (enabled?viewport:zoom).focus({preventScroll:true});
    if(!enabled)viewport.scrollTo(0,0);
  });
  dialog.addEventListener('keydown',event=>{
    if(event.altKey||event.metaKey||event.ctrlKey||!event.key.startsWith('Arrow'))return;
    if(viewport.classList.contains('zoomed')){
      event.preventDefault();
      const horizontal=event.key==='ArrowLeft'?-72:event.key==='ArrowRight'?72:0;
      const vertical=event.key==='ArrowUp'?-72:event.key==='ArrowDown'?72:0;
      viewport.scrollBy({left:horizontal,top:vertical,behavior:'instant'});
    }else if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();
      step(event.key==='ArrowLeft'?-1:1);
    }
  });
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const bounds=dialog.getBoundingClientRect();
    if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)close();
  });
  window.addEventListener('resize',()=>{
    if(!dialog.open)return;
    if(closing)dismiss(true);
    else{stopFlight();applyFit();}
  });
  reduced.addEventListener('change',()=>{
    if(!reduced.matches||!dialog.open)return;
    if(closing)dismiss(true);
    else{stopFlight();panelMotion?.cancel();pictureMotion?.cancel();}
  });
  return {open,close};
}
