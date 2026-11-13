import {copy} from './i18n.js';
import {workMarkup} from './work.js';
import {syncWorkFilter,updateWorkResults} from './work-motion.js';
import {calculatePortalFrame,portalContour,sourceWidth,sourceHeight,movieInkBounds} from './home-portal-geometry.js';
import {nameVectorMarkup, nameVectorDarkMarkup, nameVectorColors} from './home-name-vector.js';

const mediaByTheme={
  light:{
    movie:'assets/letters-intro-continuous-v5.mp4',
    start:'assets/letters-intro-start-v5.webp',
    final:'assets/letters-intro-final-v5.webp'
  },
  dark:{
    movie:'assets/letters-intro-continuous-dark-v5.mp4',
    start:'assets/letters-intro-start-dark-v5.webp',
    final:'assets/letters-intro-final-dark-v5.webp'
  }
};
const portalTheme=()=>globalThis.document?.documentElement?.dataset?.theme==='dark'?'dark':'light';

const clamp=value=>Math.max(0,Math.min(1,value));

export function homeMarkup({projects,category='all'}){
  const theme=portalTheme(),media=mediaByTheme[theme];
  const vectorMarkup=theme==='dark'?nameVectorDarkMarkup:nameVectorMarkup;
  return `<div class="home-work-scene" data-home-scene>
    <div class="portal-runway" data-portal-runway>
      <section class="portal-opening" aria-labelledby="home-title" data-portal-opening>
        <h1 class="sr-only" id="home-title">${copy('叶昊聪的设计作品','Design by Haocong YE')}</h1>
        <div class="portal-video-backdrop" data-video-backdrop aria-hidden="true"><video class="portal-video" data-letter-video muted playsinline preload="auto" poster="${media.start}" tabindex="-1"><source src="${media.movie}" type="video/mp4"></video></div>
        <svg class="portal-poster" data-portal-poster aria-hidden="true" focusable="false" preserveAspectRatio="none">
          <defs><mask id="handwriting-portal" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0"><rect data-mask-field fill="white"/><path data-portal-counter d="${portalContour}" fill="black"/></mask></defs>
          <g data-poster-layer mask="url(#handwriting-portal)"><rect data-poster-field fill="#f5f5f5"/><g data-name-poster><image data-raster-name href="${media.final}" width="${sourceWidth}" height="${sourceHeight}"/><g data-vector-name><rect data-vector-backing width="${sourceWidth}" height="${sourceHeight}" fill="#f5f5f5"/>${vectorMarkup}</g></g></g>
        </svg>
        <span class="portal-text-fallback" aria-hidden="true">haocong ye</span>
        <button class="portal-film-control" data-letter-film aria-label="${copy('暂停手写动画','Pause handwriting animation')}" aria-pressed="false"></button>
        <button class="portal-explore" data-explore-work>${copy('探索作品','Explore work')} <span aria-hidden="true">↓</span></button>
      </section>
    </div>
    <div class="portal-work" data-portal-work>${workMarkup({projects,category})}</div>
  </div>`;
}

export function mountHome(root,{initialRoute='home',initialState=null,onRouteChange=()=>{}}={}){
  const scene=root.querySelector('[data-home-scene]');
  if(!scene)return {destroy(){},getState(){return null;}};
  const runway=scene.querySelector('[data-portal-runway]'),opening=scene.querySelector('[data-portal-opening]'),work=scene.querySelector('[data-portal-work]');
  const video=scene.querySelector('[data-letter-video]'),backdrop=scene.querySelector('[data-video-backdrop]'),poster=scene.querySelector('[data-portal-poster]');
  const source=video.querySelector('source');
  const name=scene.querySelector('[data-name-poster]'),counter=scene.querySelector('[data-portal-counter]'),mask=scene.querySelector('#handwriting-portal');
  const vector=scene.querySelector('[data-vector-name]'),raster=scene.querySelector('[data-raster-name]');
  const inkStops=[...vector.querySelectorAll('stop')];
  const film=scene.querySelector('[data-letter-film]'),cta=scene.querySelector('[data-explore-work]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),abort=new AbortController(),events={signal:abort.signal};
  let width=0,height=0,length=0,origin=0,progress=0,frameId=0,disposed=false,route=initialRoute;
  let shouldPlay=initialState?.wasPlaying??true,finished=initialState?.finished??false,pendingTime=initialState?.videoTime??null,playToken=0;
  let resetting=false,resetFrame=null;
  let keyboardEntry=false,entryStarted=false;
  let theme=portalTheme(),rasterReady=false,rasterProbe=null,changingMedia=false;
  const supportsSvg='SVGSVGElement'in window,supportsMask=supportsSvg&&'SVGMaskElement'in window;
  if(!supportsSvg)scene.classList.add('portal-missing-poster');
  let pausedForScroll=true,failed=false,simple=reduced.matches||!supportsMask,lastWorkOpen=null;

  function setLanguage(){
    cta.innerHTML=`${copy('探索作品','Explore work')} <span aria-hidden="true">↓</span>`;
    scene.querySelector('#home-title').textContent=copy('叶昊聪的设计作品','Design by Haocong YE');
    film.setAttribute('aria-label',finished?copy('重播手写动画','Replay handwriting animation'):shouldPlay?copy('暂停手写动画','Pause handwriting animation'):copy('继续手写动画','Resume handwriting animation'));
    film.setAttribute('aria-pressed',String(!shouldPlay));
  }
  function pauseVideo(){playToken++;video.pause();}
  function stopReplayFrame(){
    if(resetFrame!==null)video.cancelVideoFrameCallback?.(resetFrame);
    resetFrame=null;
  }
  function revealReplay(){
    if(!resetting||resetFrame!==null||video.seeking||video.readyState<2)return;
    const reveal=()=>{resetFrame=null;if(disposed)return;resetting=false;video.style.opacity='1';};
    if(video.requestVideoFrameCallback)resetFrame=video.requestVideoFrameCallback(reveal);
    else{resetting=false;video.style.opacity='1';}
  }
  function playVideo(){
    if(disposed||document.hidden||pausedForScroll||!shouldPlay||finished||simple||failed||(changingMedia&&video.readyState<1))return;
    const token=++playToken;video.muted=true;
    video.play().catch(error=>{if(disposed||token!==playToken||error.name==='AbortError')return;fallback();});
  }
  function loadRaster(){
    const url=mediaByTheme[theme].final,probe=new Image();
    rasterReady=false;
    rasterProbe=probe;
    raster.setAttribute('href',url);
    probe.addEventListener('load',()=>{
      if(disposed||probe!==rasterProbe)return;
      rasterReady=true;render();
    },{...events,once:true});
    probe.src=url;
  }
  function showThemedFrame(){
    if(!changingMedia||pendingTime!==null||video.seeking||video.readyState<2||video.currentSrc!==source.src)return;
    changingMedia=false;
    backdrop.style.backgroundImage='';
    video.style.opacity='1';
  }
  function restoreVideoTime(){
    if(video.readyState<1||video.currentSrc!==source.src)return;
    const switching=changingMedia;
    if(pendingTime!==null){
      video.currentTime=Math.min(pendingTime,video.duration||pendingTime);
      pendingTime=null;
    }
    showThemedFrame();
    if(switching)playVideo();
  }
  function setTheme(){
    const next=portalTheme();
    if(next===theme)return;
    const saved=failed?getState():null;
    theme=next;
    const media=mediaByTheme[theme],time=pendingTime??video.currentTime;
    pauseVideo();
    stopReplayFrame();
    resetting=false;
    changingMedia=true;
    pendingTime=time;
    video.style.opacity='0';
    backdrop.style.backgroundImage=`url("${media.start}")`;
    video.poster=media.start;
    source.src=media.movie;
    inkStops.forEach((stop,index)=>stop.setAttribute('stop-color',nameVectorColors[theme][index]));
    loadRaster();
    video.load();
    if(saved){
      failed=false;
      simple=reduced.matches||!supportsMask;
      measure();restoreState(saved);
    }else render();
  }
  function workAnchor(){
    const line=Math.min(180,height*.2);
    const cards=[...work.querySelectorAll('[data-project-id]')];
    const element=cards.find(el=>{const r=el.getBoundingClientRect();return r.bottom>line&&r.top<height;});
    return element?{id:element.dataset.projectId,offset:element.getBoundingClientRect().top}:null;
  }
  function getState(){const p=clamp((window.scrollY-origin)/length);return {progress:p,scrollBeyond:Math.max(0,window.scrollY-origin-length),videoTime:pendingTime??video.currentTime,wasPlaying:shouldPlay,finished,workAnchor:p>=1?workAnchor():null};}
  function measure(){
    width=document.documentElement.clientWidth;height=window.innerHeight;
    length=Math.round(height*(simple||matchMedia('(max-width:767px)').matches?1:1.3));
    origin=runway.getBoundingClientRect().top+window.scrollY;
    runway.style.height=`${length}px`;
    scene.classList.toggle('portal-simple',simple);
    scene.querySelector('[data-poster-layer]').setAttribute('mask',simple?'none':'url(#handwriting-portal)');
    poster.setAttribute('viewBox',`0 0 ${width} ${height}`);
    mask.setAttribute('width',width);mask.setAttribute('height',height);
    for(const field of scene.querySelectorAll('[data-mask-field],[data-poster-field]')){field.setAttribute('width',width);field.setAttribute('height',height);}
    opening.style.height=`${height}px`;
    const base=calculatePortalFrame({width,height,progress:0});
    Object.assign(video.style,{width:`${base.imageWidth}px`,height:`${base.imageHeight}px`,left:`${base.x}px`,top:`${base.y}px`});
    backdrop.style.backgroundSize=`${base.imageWidth}px ${base.imageHeight}px`;
    backdrop.style.backgroundPosition=`${base.x}px ${base.y}px`;
    const hitWidth=(movieInkBounds.right-movieInkBounds.left)*base.scale;
    const hitHeight=(movieInkBounds.bottom-movieInkBounds.top)*base.scale;
    Object.assign(film.style,{width:`${hitWidth+24}px`,height:`${Math.max(96,hitHeight+24)}px`});
    syncWorkFilter(work);
  }
  function render(){
    if(disposed)return;
    frameId=0;
    const y=Math.max(0,window.scrollY-origin);progress=clamp(y/length);
    const nextPaused=progress>.001;
    if(nextPaused!==pausedForScroll){pausedForScroll=nextPaused;if(nextPaused)pauseVideo();else playVideo();}
    const f=calculatePortalFrame({width,height,progress:simple?0:progress});
    const transform=`translate(${f.x} ${f.y}) scale(${f.scale})`;
    name.setAttribute('transform',transform);counter.setAttribute('transform',transform);
    counter.setAttribute('opacity',simple?'0':String(f.maskOpacity));
    const showPoster=simple||failed||finished?1:f.posterOpacity;
    poster.style.opacity=String(showPoster);
    // Keep the film opaque underneath the first crossfade. Complementary layer
    // opacities otherwise leak the entire archive through their grey backgrounds.
    backdrop.style.opacity=String(simple?0:f.backdropOpacity);
    // The opaque source-sized backing makes the vector takeover a true dissolve,
    // rather than fading two transparent ink layers through each other.
    const vectorOpacity=simple||!rasterReady?1:f.posterOpacity;
    vector.style.opacity=String(vectorOpacity);
    raster.style.visibility=vectorOpacity>=1?'hidden':'visible';
    cta.style.opacity=String(simple?1:f.ctaOpacity);
    // A single real archive stays at the same viewport coordinates throughout the portal.
    // At the exact seam the transform reaches zero and natural document scrolling takes over.
    work.style.transform=simple?'none':`translate3d(0,${-Math.max(0,length-y)}px,0)`;
    const workOpen=simple||progress>=.999;
    if(keyboardEntry&&progress>.005)entryStarted=true;
    if(keyboardEntry&&entryStarted&&progress<.001){keyboardEntry=false;entryStarted=false;}
    if(workOpen!==lastWorkOpen){
      work.inert=!workOpen;work.setAttribute('aria-hidden',String(!workOpen));lastWorkOpen=workOpen;
      if(workOpen&&opening.contains(document.activeElement))work.querySelector('h1')?.focus({preventScroll:true});
    }
    if(keyboardEntry&&progress>=.999){work.querySelector('h1')?.focus({preventScroll:true});keyboardEntry=false;}
    const gone=!simple&&progress>=1;
    opening.style.visibility=gone?'hidden':'visible';
    opening.inert=(!simple&&progress>.12)||gone;
    film.tabIndex=simple||progress>.001?-1:0;
    cta.tabIndex=!simple&&progress>.1?-1:0;
    scene.dataset.portalProgress=progress.toFixed(5);
    // Wider reverse threshold prevents route/capsule chatter at the seam.
    const nextRoute=route==='home'?(progress>=.995?'work':'home'):(progress<.94?'home':'work');
    if(nextRoute!==route){route=nextRoute;onRouteChange(route);}
  }
  function queueRender(){if(!frameId&&!document.hidden)frameId=requestAnimationFrame(render);}
  function restoreState(saved){
    const top=origin+(saved.progress<1?saved.progress*length:length+(saved.scrollBeyond||0));
    window.scrollTo({top,behavior:'instant'});render();
    if(saved.progress>=1&&saved.workAnchor){
      const el=[...work.querySelectorAll('[data-project-id]')].find(el=>el.dataset.projectId===saved.workAnchor.id);
      if(el)window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-saved.workAnchor.offset,behavior:'instant'});
      render();
    }
  }
  function fallback(){
    if(disposed||failed)return;
    const saved=getState();
    failed=true;simple=true;changingMedia=false;
    pauseVideo();
    backdrop.style.backgroundImage='';
    measure();restoreState(saved);
  }
  function scrollToHome({behavior='smooth'}={}){window.scrollTo({top:origin,behavior:simple?'instant':behavior});}
  function scrollToWork({behavior='smooth'}={}){window.scrollTo({top:origin+length,behavior:simple?'instant':behavior});}
  function replaceWork(html){const saved=getState();work.innerHTML=html;work.querySelector('h1')?.setAttribute('tabindex','-1');syncWorkFilter(work);restoreState(saved);}
  function filterWork(html,button){if(!updateWorkResults(work,html,button))replaceWork(html);}
  function toggleVideo(){
    if(simple||progress>.001)return;
    if(finished){
      finished=false;failed=false;
      if(changingMedia){pendingTime=0;restoreVideoTime();}
      else{resetting=true;video.style.opacity='0';video.currentTime=0;pendingTime=null;}
      shouldPlay=true;
    }
    else shouldPlay=!shouldPlay;
    if(shouldPlay)playVideo();else pauseVideo();setLanguage();render();
  }
  film.addEventListener('click',toggleVideo,events);
  cta.addEventListener('click',event=>{keyboardEntry=event.detail===0;entryStarted=false;scrollToWork();},events);
  video.addEventListener('ended',()=>{if(!video.ended||changingMedia)return;finished=true;shouldPlay=false;setLanguage();render();},events);
  video.addEventListener('seeked',()=>{showThemedFrame();revealReplay();},events);
  video.addEventListener('playing',revealReplay,events);
  video.addEventListener('loadeddata',showThemedFrame,events);
  video.addEventListener('error',fallback,events);
  source.addEventListener('error',fallback,events);
  video.addEventListener('loadedmetadata',restoreVideoTime,events);
  loadRaster();
  window.addEventListener('themechange',setTheme,events);
  window.addEventListener('scroll',queueRender,{...events,passive:true});
  window.addEventListener('resize',()=>{const saved=getState();measure();restoreState(saved);},events);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseVideo();cancelAnimationFrame(frameId);frameId=0;}else{render();playVideo();}},events);
  reduced.addEventListener('change',()=>{const saved=getState();simple=reduced.matches||!supportsMask||failed;pauseVideo();measure();restoreState(saved);if(!simple)playVideo();},events);
  work.querySelector('h1')?.setAttribute('tabindex','-1');
  measure();setLanguage();
  if(initialState)restoreState(initialState);else{window.scrollTo({top:origin+(initialRoute==='work'?length:0),behavior:'instant'});render();}
  restoreVideoTime();
  playVideo();
  return {getState,setLanguage,replaceWork,filterWork,restoreState,scrollToHome,scrollToWork,destroy(){disposed=true;pauseVideo();abort.abort();cancelAnimationFrame(frameId);stopReplayFrame();source.removeAttribute('src');video.removeAttribute('src');video.load();}};
}
