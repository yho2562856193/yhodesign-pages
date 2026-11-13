import {copy,getLanguage} from './i18n.js';
import {icons} from './icons.js';
import {aboutBodyMarkup} from './about-body.js';
import {mountAboutMotion} from './about-motion.js';
import {badgeProfileFor} from './badge-profile-data.js';

const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const portraitUrl='assets/portrait-card-v3.webp';
const arrow=icons['external-link'];

function fallbackMarkup(profile,flipped){
  const data=badgeProfileFor(getLanguage(),profile);
  return `<button class="about-fallback" data-badge-fallback type="button" aria-label="${copy('翻转个人名片','Flip personal card','翻轉個人名片')}" aria-describedby="about-card-description" aria-pressed="${flipped}">
    <span class="about-fallback-inner">
      <span class="about-fallback-face about-fallback-front" data-fallback-front aria-hidden="${flipped}">
        <span class="about-fallback-top">HAOCONG YE <span>${escape(data.designLabel)} / 01</span></span>
        <span class="about-fallback-photo"><img src="${portraitUrl}" alt="" width="1122" height="1402" fetchpriority="high"></span>
        <span class="about-fallback-name">${escape(data.name)}</span>
        <span class="about-fallback-sub">${escape(data.secondaryName)}</span>
        <span class="about-fallback-front-focus">${escape(data.focus)}</span>
      </span>
      <span class="about-fallback-face about-fallback-back" data-fallback-back aria-hidden="${!flipped}">
        <span class="about-fallback-top">${escape(data.profileLabel)} <span>02</span></span>
        <span class="about-fallback-back-name">${escape(data.name)}</span>
        <span class="about-fallback-back-english">${escape(data.secondaryName)}</span>
        <span class="about-fallback-school">${escape(data.school)}</span>
        <span class="about-fallback-major">${escape(data.major)}</span>
        <span class="about-fallback-period">${escape(data.period)}</span>
        <span class="about-fallback-metrics"><span class="about-fallback-stat"><span>GPA</span><strong>${escape(data.gpa)}</strong></span><span class="about-fallback-stat"><span>${escape(data.ieltsLabel)}</span><strong>${escape(data.ielts)}</strong></span></span>
        <span class="about-fallback-weighted"><span>${escape(data.weightedAverageLabel)}</span><strong>${escape(data.weightedAverage)}</strong></span>
        ${data.academicLine?`<span class="about-fallback-academic">${escape(data.academicLine)}</span>`:''}
        <span class="about-fallback-focus-detail"><span>${escape(data.focusLabel)}</span><strong>${escape(data.focus)}</strong></span>
        <span class="about-fallback-location">${escape(data.location)}</span>
        <span class="about-fallback-email">${escape(data.email)}</span>
        <span class="about-fallback-bottom-rule" aria-hidden="true"></span>
      </span>
    </span>
  </button>`;
}

export function aboutMarkup({profile,honors=[],initialFlipped=false,initialOpenDetails=[]}){
  const badge=badgeProfileFor(getLanguage(),profile);
  const badgeDescription=[badge.name,badge.school,badge.major,badge.period,`GPA ${badge.gpa}`,`IELTS ${badge.ielts}`,`${badge.weightedAverageLabel} ${badge.weightedAverage}`,badge.academicLine,badge.focus,badge.location,`${copy('邮箱','Email','電郵')}: ${badge.email}`].filter(Boolean).join(getLanguage()==='en'?'. ':'。');
  return `<div class="about-experience${initialFlipped?' is-flipped':''}" data-about-experience>
    <div class="about-opening" data-about-opening>
    <section class="about-intro" data-about-intro aria-labelledby="about-title">
      <h1 class="sr-only" id="about-title">${copy('你好，我是叶昊聪。','Hello, I’m Haocong YE.','你好，我是葉昊聰。')}</h1>
      <div class="about-badge-stage" data-badge-stage role="group" aria-label="${copy('悬挂的个人名片','Hanging personal card','懸掛式個人名片')}">
        <canvas data-badge-canvas aria-hidden="true"></canvas>
        ${fallbackMarkup(profile,initialFlipped)}
        <button type="button" class="about-badge-hit" data-badge-hit tabindex="-1" aria-hidden="true" aria-label="${copy('拖动或翻转名片','Drag or flip the card','拖動或翻轉名片')}" hidden></button>
      </div>
      <div class="about-card-controls">
        <p class="about-card-instruction" data-badge-instruction>${copy('拖动 · 点击翻面','Drag · Click to flip','拖動 · 點擊翻面')}</p>
        <button class="about-flip-button" data-badge-flip type="button" aria-describedby="about-card-description"><span data-badge-flip-label>${initialFlipped?copy('翻回正面','Show front','翻回正面'):copy('翻至背面','Show back','翻到背面')}</span>${arrow}</button>
        <p class="sr-only" id="about-card-description">${escape(badgeDescription)}</p>
        <p class="sr-only" data-badge-status role="status" aria-live="polite"></p>
      </div>
      <div class="about-intro-bottom shell"><button type="button" data-about-scroll aria-controls="about-context">${copy('继续了解','Explore more','繼續了解')}<span class="about-down-icon">${icons.back}</span></button></div>
    </section>
    </div>
    <div class="about-curtain" data-about-curtain>
      ${aboutBodyMarkup({profile,honors,initialOpenDetails})}
    </div>
  </div>`;
}

export function mountAbout(root,{profile,initialFlipped=false,onFlip=()=>{}}={}){
  const experience=root.querySelector('[data-about-experience]');
  if(!experience)return {destroy(){},getState(){return {flipped:initialFlipped};}};
  const hero=root.querySelector('[data-about-intro]'),stage=root.querySelector('[data-badge-stage]'),canvas=root.querySelector('[data-badge-canvas]'),hitTarget=root.querySelector('[data-badge-hit]'),contextHeading=root.querySelector('#about-context-title');
  const fallback=root.querySelector('[data-badge-fallback]'),flipButton=root.querySelector('[data-badge-flip]'),flipLabel=root.querySelector('[data-badge-flip-label]'),instruction=root.querySelector('[data-badge-instruction]'),status=root.querySelector('[data-badge-status]');
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),forcedColors=matchMedia('(forced-colors: active)'),abort=new AbortController(),options={signal:abort.signal};
  const profileMotion=mountAboutMotion(experience);
  let flipped=initialFlipped,disposed=false,scene=null,loadToken=0,frame=0,sceneVisible=false,introCovered=false,lastProgress=-1,heroHeight=hero.offsetHeight,storyTop=0;

  function focusOverview(){
    contextHeading.focus({preventScroll:true});
  }

  function paintFlip(announce=false){
    experience.classList.toggle('is-flipped',flipped);
    experience.dataset.flipped=String(flipped);
    fallback.setAttribute('aria-pressed',String(flipped));
    fallback.querySelector('[data-fallback-front]').setAttribute('aria-hidden',String(flipped));
    fallback.querySelector('[data-fallback-back]').setAttribute('aria-hidden',String(!flipped));
    flipLabel.textContent=flipped?copy('翻回正面','Show front','翻回正面'):copy('翻至背面','Show back','翻到背面');
    if(announce)status.textContent=flipped?copy('名片背面：个人信息。','Back of card: personal information.','名片背面，個人資料。'):copy('名片正面：个人照片与姓名。','Front of card: portrait and name.','名片正面，個人照片與姓名。');
  }
  function setFlipped(value,fromScene=false){
    if(disposed)return;
    flipped=Boolean(value);paintFlip(true);
    if(!fromScene)scene?.setFlipped(flipped);
    onFlip(flipped);
  }
  function showFallback(){
    experience.classList.remove('is-scene-ready');
    stage.dataset.mode=motion.matches?'reduced-motion':'fallback';
    experience.dataset.mode=stage.dataset.mode;
    hitTarget.hidden=true;hitTarget.inert=true;fallback.inert=false;
    instruction.textContent=copy('点击翻面','Click to flip','點擊翻面');
  }
  function showScene(){
    if(disposed||motion.matches||forcedColors.matches)return;
    experience.classList.add('is-scene-ready');stage.dataset.mode='three';
    experience.dataset.mode='three';
    if(document.activeElement===fallback&&!introCovered)flipButton.focus({preventScroll:true});
    fallback.inert=true;hitTarget.hidden=false;hitTarget.inert=false;
    instruction.textContent=copy('拖动 · 点击翻面','Drag · Click to flip','拖動 · 點擊翻面');
  }
  function updateVisibility(){
    const heroBounds=hero.getBoundingClientRect();
    const covered=motion.matches?heroBounds.bottom<=1:lastProgress>=1;
    if(covered!==introCovered){
      introCovered=covered;
      if(covered&&hero.contains(document.activeElement))focusOverview();
      hero.inert=covered;
      hero.setAttribute('aria-hidden',String(covered));
      experience.classList.toggle('is-intro-covered',covered);
    }
    hero.dataset.visibility=covered?'covered':'visible';
    const visible=!disposed&&!motion.matches&&!forcedColors.matches&&!document.hidden&&!covered&&heroBounds.bottom>0;
    if(sceneVisible!==visible){sceneVisible=visible;scene?.setVisible(visible);}
  }
  function paintScroll(){
    frame=0;if(disposed)return;
    const travel=heroHeight*.7;
    const distance=Math.max(0,window.scrollY-storyTop);
    // A smooth scroll can land a fraction of a CSS pixel below its target.
    const next=motion.matches?0:distance>=travel-1?1:distance/travel;
    if(next!==lastProgress){
      lastProgress=next;
      experience.dataset.scrollProgress=next.toFixed(3);
      experience.style.setProperty('--about-progress',String(next));
      experience.style.setProperty('--about-opening-overlap',`${heroHeight*(.7+.3*next)}px`);
      experience.style.setProperty('--about-hero-y',`${-44*next}px`);
      experience.style.setProperty('--about-hero-scale',String(1-next*.035));
      experience.style.setProperty('--about-curtain-radius',`${32*(1-next)}px`);
    }
    updateVisibility();
  }
  function scheduleScroll(){if(!disposed&&!frame)frame=requestAnimationFrame(paintScroll);}
  function measure(){
    if(disposed)return;
    heroHeight=hero.offsetHeight;storyTop=experience.getBoundingClientRect().top+window.scrollY;
    experience.style.setProperty('--about-hero-height',`${heroHeight}px`);
    lastProgress=-1;paintScroll();scene?.resize();
  }
  async function loadScene(){
    const token=++loadToken;
    if(motion.matches||forcedColors.matches){showFallback();return;}
    stage.dataset.mode='loading';experience.dataset.mode='loading';
    try{
      const {createBadgeScene}=await import('./about-scene.js');
      if(disposed||token!==loadToken||motion.matches||forcedColors.matches)return;
      const next=await createBadgeScene({canvas,hitTarget,profile,language:getLanguage(),portraitUrl,initialFlipped:flipped,onFlip:value=>setFlipped(value,true),onReady:()=>{if(!disposed&&token===loadToken)showScene();},onError:()=>{if(!disposed&&token===loadToken)showFallback();}});
      if(disposed||token!==loadToken||motion.matches||forcedColors.matches){next?.destroy();return;}
      scene=next;scene.setFlipped(flipped);scene.setVisible(sceneVisible);scene.resize();
    }catch{if(!disposed&&token===loadToken)showFallback();}
  }
  function motionChanged(){
    loadToken++;scene?.destroy();scene=null;sceneVisible=false;
    showFallback();measure();if(!motion.matches&&!forcedColors.matches)loadScene();
  }
  flipButton.addEventListener('click',()=>setFlipped(!flipped),options);
  fallback.addEventListener('click',()=>setFlipped(!flipped),options);
  root.querySelector('[data-about-scroll]').addEventListener('click',event=>{
    if(event.detail===0)focusOverview();
    window.scrollTo({top:storyTop+heroHeight*(motion.matches?1:.7),behavior:motion.matches?'instant':'smooth'});
  },options);
  window.addEventListener('scroll',scheduleScroll,{passive:true,signal:abort.signal});
  window.addEventListener('resize',measure,{passive:true,signal:abort.signal});
  document.addEventListener('visibilitychange',updateVisibility,options);
  motion.addEventListener('change',motionChanged,options);
  forcedColors.addEventListener('change',motionChanged,options);
  const resize=typeof ResizeObserver!=='undefined'?new ResizeObserver(measure):null;resize?.observe(hero);
  paintFlip();showFallback();measure();loadScene();
  return {
    scrollToSection(id,{behavior='instant'}={}){
      const aliases={overview:'context',context:'context',tools:'skills',methods:'focus',everyday:'life',recognition:'education'};
      const target=root.querySelector(`#about-${aliases[id]||id}`);if(!target)return false;
      const endOfIntro=storyTop+heroHeight*(motion.matches?1:.7);
      if(window.scrollY<endOfIntro){window.scrollTo({top:endOfIntro,behavior:'instant'});paintScroll();}
      target.scrollIntoView({behavior,block:'start'});return true;
    },
    getState(){return {flipped,openDetails:[...root.querySelectorAll('[data-about-detail][open]')].map(el=>el.dataset.aboutDetail)};},
    destroy(){
      disposed=true;loadToken++;abort.abort();resize?.disconnect();if(frame)cancelAnimationFrame(frame);
      profileMotion.destroy();scene?.destroy();scene=null;
    }
  };
}
