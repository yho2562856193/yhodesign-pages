import * as zhContent from './content.js';
import * as enContent from './content.en.js';
import * as hkContent from './content.zh-hk.js';
import { icons } from './icons.js';
import {homeMarkup,mountHome} from './home.js';
import {honorsMarkup,mountHonors} from './honors.js';
import {aboutMarkup,mountAbout} from './about.js';
import {getLanguage,setLanguage,preferredLanguage,t,copy,localizeHTML,localizeShell} from './i18n.js';
import {workMarkup,projectMarkup} from './work.js';
import {journeyMarkup,mountJourney} from './journey.js';
import {homeProjectIds,resumeProjectIds} from './projects-data.js';
import {targetsForAward,honorsForTarget,lumoInclusionFor} from './content-relations.js';
import {parseContentRoute,targetHref} from './content-model.js';
import {journeyEnabled} from './site-config.js';
import {mountWorkNavigation} from './work-navigation.js';
import {aboutFor,aboutSearchEntriesFor} from './about-data.js';
import {resumeMarkup} from './resume.js';
import {contactMarkup} from './contact.js';
import {mountImageViewer} from './image-viewer.js';
import {syncThemeControl} from './theme.js';
const contentByLanguage={zh:zhContent,'zh-HK':hkContent,en:enContent};
let {profile,projects,experiences,honors}=contentByLanguage[getLanguage()];
const withHonorIdentity=items=>items.map((h,i)=>({...h,id:h.id||`legacy-${i}`,category:h.category||'competition'}));
honors=withHonorIdentity(honors);

const $ = (s, root=document) => root.querySelector(s);
const app = $('#app');
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = name => icons[name] || '';
const asset = name => `assets/${name}`;
const pageName = {home:'设计与日常',work:'作品',journey:'我的经历',honors:'荣誉与认可',about:'关于我',contact:'联系我',resume:'简历'};
const state = {workFilter:'all', journeyFilter:'全部',honorCategory:'all',honorId:null,honorAutoplay:true,aboutFlipped:false,aboutOpenDetails:[]};
let currentRoute='home', toastTimer, revealObserver, pendingSearchTarget;
let homeView=null,sceneSnapshot=null;
let honorView=null;
let aboutView=null;
let journeyView=null;
let workNavigation=null;
const viewer=mountImageViewer($('#image-dialog'));
const searchDialog=$('#search-dialog');
let searchOpener=null;

function fillIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));}
function imageButton(src,caption,group='case',index=0){return `<button class="image-button" data-image="${escape(src)}" data-caption="${escape(caption)}" data-group="${group}" data-index="${index}" aria-label="放大查看：${escape(caption)}"><img src="${src}" alt="${escape(caption)}" loading="lazy" decoding="async"><span class="zoom-hint">${icon('search')}放大查看</span></button>`;}
function card(p,wide=false){return `<a class="project-card reveal${wide?' wide':''}" href="#/project/${p.id}" style="--project-bg:${p.bg}"><div class="project-image"><img src="${asset(p.cover)}" alt="${p.title} 项目设计展示" loading="lazy" width="1800" height="1200"></div><div class="project-info"><p class="eyebrow">${p.number} / ${p.category} · ${p.year}</p><h3>${p.title}</h3><p>${p.subtitle}</p><div class="card-tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}<span>${p.type}</span></div><span class="card-arrow" aria-hidden="true">↗</span></div></a>`;}
function filters(items,selected,group){return `<div class="filter-bar" role="group" aria-label="${group==='work'?'作品分类':group==='journey'?'经历分类':'荣誉分类'}">${items.map(t=>`<button class="filter-chip" data-filter="${group}" data-value="${t}" aria-pressed="${selected===t}">${t}</button>`).join('')}</div>`;}
// Home and Work are two positions in one persistent scene, using the complete archive.
function home(){return homeMarkup({projects,category:state.workFilter});}
function work(){return workMarkup({projects,category:state.workFilter});}
function project(id){const selected=projects.find(p=>p.id===id);return selected?projectMarkup({project:selected,projects,honors,relatedHonors:honorsForTarget,experiences,inclusion:id==='lumo'?lumoInclusionFor(getLanguage()):null}):notFound();}
function journey(){return journeyMarkup({experiences,projects,honors,relatedHonors:honorsForTarget});}

function honorLinks(honor){return targetsForAward(honor.id).flatMap(target=>{if(target.kind==='experience'&&!journeyEnabled)return [];const item=target.kind==='project'?projects.find(p=>p.id===target.id):experiences.find(e=>e.id===target.id);if(!item)return [];const label=target.kind==='project'?`${copy('查看作品','View work')} · ${item.title}${target.section==='workbench'?(' · '+copy('工作台','Workbench')):''}`:`${copy('查看经历','View experience')} · ${item.company}`;return [{href:targetHref(target),label}];});}

function honorsPage(){return honorsMarkup({honors,category:state.honorCategory,selectedId:state.honorId});}
function resumeHonors(){const selected=honors.filter(h=>h.resume);return selected.length?selected.sort((a,b)=>a.resumeOrder-b.resumeOrder):honors.slice(0,7);}
function openHonor(h,trigger){
  const caption=[h.name,h.level,h.work].filter(Boolean).join(' · ');
  const material=h.materialKind==='notification'?t('获奖通知'):h.materialKind==='announcement'?t('获奖记录'):t('获奖证书');
  const gallery=[{src:asset(h.full||h.certificate),preview:asset(h.certificate),caption:`${caption} · ${material}`},...(h.supportingFiles||[]).map(f=>({src:asset(f.file),caption:`${caption} · ${f.label}`}))];
  viewer.open(gallery,0,trigger);
}
function about(){return aboutMarkup({profile,honors,initialFlipped:state.aboutFlipped,initialOpenDetails:state.aboutOpenDetails});}
function contact(){return contactMarkup({profile});}
function resume(){return resumeMarkup({profile,projects,honors,projectIds:resumeProjectIds,honorIds:resumeHonors().map(h=>h.id),language:getLanguage()});}
function notFound(){return `<section class="not-found shell"><p class="eyebrow">404 / PAGE NOT FOUND</p><h1>这里还没有留下足迹。</h1><p>页面可能已经移到别处，先回到首页继续探索吧。</p><a class="button" href="#/">回到首页</a></section>`;}
function footer(){return `<div class="site-footer shell">${!['contact','resume','about'].includes(currentRoute)?`<div class="footer-contact"><div><h2>联系我</h2><p>叶昊聪 · 工业设计、交互与服务设计</p></div><a class="button" href="#/contact">联系我 ${icon('mail')}</a></div>`:''}<div class="footer-bottom"><p>© 2026 叶昊聪 · Haocong YE</p><nav aria-label="页脚导航"><a href="#/work">作品</a>${journeyEnabled?'<a href="#/journey">经历</a>':''}<a href="#/about">关于</a><button class="text-button" data-copy-email style="font-size:inherit;padding:0;min-height:24px;color:inherit">复制邮箱</button></nav><span>保持好奇，认真生活。</span></div></div>`;}
function syncFeatureShell(){
  document.querySelectorAll('[data-nav="journey"]').forEach(link=>{link.hidden=!journeyEnabled;});
  $('#search-title').textContent=t(journeyEnabled?'搜索作品、经历、个人资料与荣誉':'搜索作品、个人资料与荣誉');
  $('#site-search').placeholder=t(journeyEnabled?'搜索作品、经历、个人资料、荣誉或关键词…':'搜索作品、个人资料、荣誉或关键词…');
}
const aboutAliases={context:'overview',tools:'skills',methods:'focus',everyday:'life',recognition:'education'};
function aboutSection(value){const id=aboutAliases[value]||value;return aboutFor(getLanguage()).sections.some(section=>section.id===id)?id:'overview';}
function aboutTarget(value){return value==='overview'?'about-context':`about-${value}`;}
function focusSectionHeading(section){
  const target=section?.querySelector('h2,h3,h4')||section;
  if(!target)return;
  target.tabIndex=-1;
  target.focus({preventScroll:true});
}
function scrollAboutSection(value,{behavior='instant',focus=false}={}){
  if(!value){window.scrollTo({top:0,behavior});return;}
  const id=aboutSection(value);
  const section=document.getElementById(aboutTarget(id));
  if(focus)focusSectionHeading(section);
  if(aboutView?.scrollToSection){aboutView.scrollToSection(id,{behavior});return;}
  section?.scrollIntoView({behavior,block:'start'});
}
function keepAboutState(){const saved=aboutView?.getState();if(saved?.openDetails)state.aboutOpenDetails=[...saved.openDetails];}
function highlightSearchTarget(route){
  if(!pendingSearchTarget)return;
  const target=pendingSearchTarget;pendingSearchTarget=null;
  if(route==='honors'&&target.startsWith('award-')){const key=target.slice(6),match=honors.find(h=>h.id===key||String(h.legacyIndex)===key);honorView?.selectById(match?.id||key);}
  requestAnimationFrame(()=>{const el=route==='honors'?app.querySelector('[data-honors-caption]'):document.getElementById(target);if(el){if(route!=='about')el.scrollIntoView({behavior:'instant',block:'center'});el.classList.add('search-hit');setTimeout(()=>el.classList.remove('search-hit'),2500);}});
}
function setupReveal(){revealObserver?.disconnect();const nodes=app.querySelectorAll('.reveal');if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion:reduce)').matches){nodes.forEach(n=>n.classList.add('visible'));return;}revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{rootMargin:'30px',threshold:.05});nodes.forEach(n=>revealObserver.observe(n));}
const sceneRoute=route=>route==='home'||route==='work';
function presentRoute(route,id){
  currentRoute=route;
  for(const page of ['home','work','project','honors','about','journey'])document.body.classList.toggle(`${page}-page`,route===page);
  const title=route==='project'?(projects.find(p=>p.id===id)?.title||'作品'):(pageName[route]||'页面未找到');
  document.title=`${t(title)} · ${profile.name}`;
  document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===(route==='project'?'work':route==='resume'?'about':route))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
}
function syncSceneRoute(route){
  if(!sceneRoute(route))return;
  presentRoute(route);
  const hash=route==='work'?'#/work':'#/';
  if(location.hash!==hash){const url=new URL(location.href);url.hash=hash;history.replaceState(history.state,'',url);}
  window.dispatchEvent(new Event('routechange'));
}
function navigate({keepScroll=false}={}){
  const previousRoute=currentRoute;
  keepAboutState();
  workNavigation?.destroy();workNavigation=null;
  if(homeView){sceneSnapshot={...homeView.getState(),workFilter:app.querySelector('.work-filter[aria-pressed="true"]')?.dataset.value||state.workFilter};homeView.destroy();homeView=null;}
  honorView?.destroy();honorView=null;
  aboutView?.destroy();aboutView=null;
  journeyView?.destroy();journeyView=null;
  let {route,id,section}=parseContentRoute(location.hash);
  if(route==='honors'&&!id&&!keepScroll){state.honorCategory='all';state.honorId=null;}
  if(route==='journey'&&!journeyEnabled){const url=new URL(location.href);url.hash='/work';history.replaceState(history.state,'',url);route='work';id=null;section=null;}
  const restoredScene=route==='work'&&previousRoute==='project'?sceneSnapshot:null;
  if(restoredScene)state.workFilter=restoredScene.workFilter||'all';
  presentRoute(route,id);
  const render={home,work:home,journey,honors:honorsPage,about,contact,resume};
  app.innerHTML=localizeHTML(route==='project'?project(id):(render[route]||notFound)());
  $('#footer').innerHTML=localizeHTML(footer());fillIcons();setupReveal();
  if(sceneRoute(route))homeView=mountHome(app,{initialRoute:route,initialState:restoredScene,onRouteChange:syncSceneRoute});
  if(route==='honors')honorView=mountHonors(app,{honors,initialCategory:id&&id!==state.honorId?'all':state.honorCategory,initialId:id||state.honorId,initialAutoplay:state.honorAutoplay,onSelectionChange:selection=>{state.honorCategory=selection.category;state.honorId=selection.id;state.honorAutoplay=selection.autoplay;if(selection.id){const url=new URL(location.href);url.hash=`/honors/${selection.id}`;history.replaceState(history.state,'',url);}},linksForHonor:honorLinks,onOpen:openHonor});
  if(route==='journey')journeyView=mountJourney(app);
  if(route==='about')aboutView=mountAbout(app,{profile,initialFlipped:state.aboutFlipped,onFlip:flipped=>{state.aboutFlipped=flipped;}});
  if(route==='project'||route==='about')workNavigation=mountWorkNavigation(app);
  if(!keepScroll&&!sceneRoute(route))window.scrollTo({top:0,behavior:'instant'});
  if(!keepScroll&&route==='journey'&&id)requestAnimationFrame(()=>journeyView?.selectById(id,{instant:true}));
  if(!keepScroll&&route==='project'&&section)requestAnimationFrame(()=>document.getElementById(`case-${section}`)?.scrollIntoView({behavior:'instant',block:'start'}));
  if(!keepScroll&&route==='about'&&id)requestAnimationFrame(()=>scrollAboutSection(id));
  window.dispatchEvent(new Event('routechange'));
  highlightSearchTarget(route);
}
function useLanguage(language,{persist=true}={}){
  setLanguage(language,{persist});
  ({profile,projects,experiences,honors}=contentByLanguage[getLanguage()]);
  honors=withHonorIdentity(honors);
  localizeShell();syncThemeControl();syncFeatureShell();
}
function changeLanguage(language,{persist=true,restoreFocus=true}={}){
  if(language===getLanguage()){
    if(persist)setLanguage(language);
    return;
  }
  keepAboutState();
  const oldY=window.scrollY;
  const chapterNav=app.querySelector('.about-profile-nav'),navBounds=chapterNav?.getBoundingClientRect();
  const readingLine=currentRoute==='about'&&navBounds&&navBounds.top<180?Math.max(140,navBounds.bottom+40):140;
  const anchor=[...app.querySelectorAll('section[id],article[id],[data-reading-anchor]')].filter(el=>{const r=el.getBoundingClientRect();return r.top<=readingLine&&r.bottom>readingLine;}).pop();
  const anchorId=anchor?.id,anchorOffset=anchor?.getBoundingClientRect().top;
  closeOverlays();
  useLanguage(language,{persist});
  if(homeView&&sceneRoute(currentRoute)){
    // Only the archive and labels change; the playing or paused film stays mounted.
    homeView.replaceWork(localizeHTML(work()));homeView.setLanguage?.();
    presentRoute(currentRoute);$('#footer').innerHTML=localizeHTML(footer());fillIcons();setupReveal();
    if(restoreFocus)$('#language-toggle').focus({preventScroll:true});
    window.dispatchEvent(new Event('routechange'));return;
  }
  navigate({keepScroll:true});
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const el=anchorId&&document.getElementById(anchorId);window.scrollTo({top:el?window.scrollY+el.getBoundingClientRect().top-anchorOffset:oldY,behavior:'instant'});if(restoreFocus)$('#language-toggle').focus({preventScroll:true});}));
}
const languagePicker=$('.language-picker'),languageToggle=$('#language-toggle'),languageOptions=$('#language-options');
function showLanguageOptions(open,{focus=false}={}){
  languageOptions.hidden=!open;
  languageToggle.setAttribute('aria-expanded',String(open));
  if(focus)(open?languageOptions.querySelector('[aria-pressed="true"]'):languageToggle)?.focus({preventScroll:true});
}
function closeOverlays(){
  showLanguageOptions(false);
  viewer.close({immediate:true,restoreFocus:false});
  searchOpener=null;
  if(searchDialog.open)searchDialog.close();
}
languageToggle.addEventListener('click',()=>showLanguageOptions(languageOptions.hidden));
languagePicker.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!languageOptions.hidden){event.preventDefault();showLanguageOptions(false,{focus:true});}
  if(event.key==='ArrowDown'&&event.target===languageToggle){event.preventDefault();showLanguageOptions(true,{focus:true});}
});
languagePicker.addEventListener('focusout',event=>{
  if(event.relatedTarget&&!languagePicker.contains(event.relatedTarget))showLanguageOptions(false);
});
languageOptions.addEventListener('click',event=>{
  const option=event.target.closest('[data-locale]');
  if(!option)return;
  showLanguageOptions(false,{focus:true});
  changeLanguage(option.dataset.locale);
});
document.addEventListener('pointerdown',event=>{if(!languagePicker.contains(event.target))showLanguageOptions(false);});
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=t(message);$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,3000);}
const copyFeedback=new WeakMap();
function confirmCopy(button,message){
  const old=copyFeedback.get(button);
  clearTimeout(old?.timer);
  old?.check.remove();
  const check=document.createElement('span');
  check.className='copy-check';
  check.setAttribute('aria-hidden','true');
  check.innerHTML=icon('check');
  button.append(check);
  const timer=setTimeout(()=>{check.remove();copyFeedback.delete(button);},1500);
  copyFeedback.set(button,{check,timer});
  toast(message);
}
function openDialog(id){$('#'+id).showModal();document.body.classList.add('modal-open');}
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('close',()=>{
  if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');
}));
searchDialog.addEventListener('close',()=>{
  if(searchDialog.open)return;
  const trigger=searchOpener;
  searchOpener=null;
  if(trigger?.isConnected)trigger.focus({preventScroll:true});
});
searchDialog.addEventListener('click',event=>{
  if(event.target!==searchDialog)return;
  const bounds=searchDialog.getBoundingClientRect();
  if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)searchDialog.close();
});
searchDialog.addEventListener('keydown',event=>{
  if(event.key!=='Escape'||event.isComposing)return;
  event.preventDefault();
  searchDialog.close();
});
// Search what readers can see, plus verified aliases, rather than retired case-study prose.
function projectSearchText(p){return p?[p.title,p.subtitle,p.category,p.year,p.type,p.lead,p.description,p.role,...(p.tags||[]),...(p.aliases||[]),...(p.projectNotes||[]).flatMap(n=>[n.title,n.text]),...(p.projectOverview||[]).flatMap(n=>[n.title,n.text])].filter(Boolean).join(' '):'';}
const searchIndexes=new Map();
const byId=items=>new Map(items.map(item=>[item.id,item]));
const normalizeSearch=value=>String(value).normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
function searchIndex(){
  const language=getLanguage();
  if(searchIndexes.has(language))return searchIndexes.get(language);
  const publicContact=aboutFor(language).contact;
  const aboutEntries=aboutSearchEntriesFor(language);
  const corpora=Object.entries(contentByLanguage).map(([locale,content])=>({
    projects:byId(content.projects),experiences:byId(content.experiences),honors:byId(content.honors),
    about:byId(locale===language?aboutEntries:aboutSearchEntriesFor(locale))
  }));
  const translations=(group,id)=>corpora.map(corpus=>corpus[group].get(id)).filter(Boolean);
  const rows=[
    ...projects.map(p=>({title:p.title,subtitle:p.subtitle||p.lead,keywords:[
      ...translations('projects',p.id).map(projectSearchText),
      ...Object.values(contentByLanguage).flatMap(content=>honorsForTarget(content.honors,'project',p.id).flatMap(h=>[h.name,h.level,h.work]))
    ].join(' '),href:`#/project/${p.id}`})),
    ...(journeyEnabled?experiences.map(e=>({title:e.company,subtitle:`${e.role} · ${e.date}`,keywords:JSON.stringify(translations('experiences',e.id)),href:`#/journey/${e.id}`})) : []),
    ...honors.map(h=>({title:h.work||h.name,subtitle:`${h.name} · ${h.level}`,keywords:[
      h.id,...translations('honors',h.id).flatMap(item=>[item.name,item.work,item.level,item.group,item.date,...(item.supportingFiles||[]).map(file=>file.label)])
    ].join(' '),href:`#/honors/${h.id}`})),
    ...aboutEntries.map(entry=>({title:entry.title,subtitle:entry.subtitle,keywords:[
      ...translations('about',entry.id).flatMap(item=>[item.keywords,item.title,item.subtitle]),
      '叶昊聪 葉昊聰 Haocong YE About Resume 个人资料 個人資料'
    ].join(' '),href:`#/about/${entry.id}`,target:aboutTarget(entry.id)})),
    {title:t('联系我'),subtitle:profile.email,keywords:['邮箱 合作 联系方式 电话 手机 微信 電郵 聯絡方式 電話 手提電話 履歷 Email Contact Phone Mobile WeChat Gmail',publicContact.phone,publicContact.wechat].join(' '),href:'#/contact'}
  ].map(row=>({...row,searchText:normalizeSearch(`${row.title} ${row.subtitle} ${row.keywords}`)}));
  searchIndexes.set(language,rows);
  return rows;
}
function search(){
  const query=$('#site-search').value.trim(),term=normalizeSearch(query);
  const results=term?searchIndex().filter(row=>row.searchText.includes(term)):searchIndex().slice(0,3);
  const escaped=escape(query);
  const empty=copy(`没有找到“${escaped}”相关内容。`,`No results for “${escaped}”.`,`找不到與「${escaped}」相關的內容。`);
  $('#search-results').innerHTML=results.length
    ?`${term?'':`<p class="eyebrow" style="margin:10px 15px">${t('从这些作品开始探索')}</p>`}${results.map(x=>`<a class="search-result" href="${x.href}" data-target="${x.target||''}"><div><strong>${escape(x.title)}</strong><span>${escape(x.subtitle)}</span></div><span aria-hidden="true">↗</span></a>`).join('')}`
    :`<div class="search-empty">${empty}<br>${t('试试“咖啡”“露营”“交互”或“非遗”。')}</div>`;
}
function openSearch(trigger){
  if(searchDialog.open)return;
  viewer.close({immediate:true});
  searchOpener=trigger||document.activeElement;
  $('#site-search').value='';
  search();
  openDialog('search-dialog');
  $('#site-search').focus();
}
$('.search-toggle').addEventListener('click',event=>openSearch(event.currentTarget));
$('#site-search').addEventListener('input',search);
$('#site-search').addEventListener('keydown',event=>{
  if(event.isComposing||event.keyCode===229||event.key!=='Enter')return;
  const first=$('.search-result');
  if(first){event.preventDefault();first.click();}
});
document.addEventListener('keydown',event=>{
  if(!(event.ctrlKey||event.metaKey)||event.key.toLowerCase()!=='k')return;
  event.preventDefault();
  if(searchDialog.open)searchDialog.close();
  else openSearch();
});
document.addEventListener('click',async e=>{
  if(e.target.closest('.skip-link')){e.preventDefault();$('#main-content').focus();$('#main-content').scrollIntoView({behavior:'instant'});return;}
  const copyLink=e.target.closest('[data-copy-link]');
  if(copyLink){
    const url=new URL(location.href);
    url.searchParams.set('lang',getLanguage());
    try{await navigator.clipboard.writeText(url.href);confirmCopy(copyLink,'项目链接已复制，当前语言也会保留。');}
    catch{toast('请复制浏览器地址栏中的链接。');}
    return;
  }
  const searchLink=e.target.closest('.search-result');if(searchLink){state.journeyFilter='全部';state.honorCategory='all';state.workFilter='all';pendingSearchTarget=searchLink.dataset.target;}
  const close=e.target.closest('[data-close]');
  if(close){if(close.dataset.close==='image-dialog')viewer.close();else searchDialog.close();return;}
  const filter=e.target.closest('[data-filter]');if(filter){
    const y=window.scrollY;
    state[filter.dataset.filter==='honor'?'honorFilter':`${filter.dataset.filter}Filter`]=filter.dataset.value;
    if(filter.dataset.filter==='work'&&homeView)homeView.filterWork(localizeHTML(work()),filter);
    else{navigate({keepScroll:true});window.scrollTo({top:y,behavior:'instant'});}
    const replacement=Array.from(document.querySelectorAll('[data-filter]')).find(b=>b.dataset.filter===filter.dataset.filter&&b.dataset.value===filter.dataset.value);
    replacement?.focus({preventScroll:true});return;
  }
  const scroll=e.target.closest('[data-scroll]');
  if(scroll){
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    e.preventDefault();
    const href=scroll.getAttribute('href')||'';
    const focus=e.detail===0,behavior=matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth';
    if(/^#\/(project|about)\//.test(href)){const url=new URL(location.href);url.hash=href;history.replaceState(history.state,'',url);}
    if(href.startsWith('#/about/')&&currentRoute==='about')scrollAboutSection(parseContentRoute(href).id,{behavior,focus});
    else{
      const section=document.getElementById(scroll.dataset.scroll);
      if(focus)focusSectionHeading(section);
      section?.scrollIntoView({behavior});
    }
    return;
  }
  const img=e.target.closest('[data-image]');
  if(img){
    const group=img.dataset.viewerGroup;
    const nodes=group?[...app.querySelectorAll('[data-viewer-group]')].filter(n=>n.dataset.viewerGroup===group):[img];
    const gallery=nodes.map(n=>({src:n.dataset.image,preview:n.dataset.preview,caption:n.dataset.caption||'',width:Number(n.dataset.fullWidth)||undefined,height:Number(n.dataset.fullHeight)||undefined,origin:n}));
    viewer.open(gallery,nodes.indexOf(img),img);
    return;
  }
  const email=e.target.closest('[data-copy-email]');
  if(email){try{await navigator.clipboard.writeText(profile.email);confirmCopy(email,'邮箱已复制，期待你的来信。');}catch{openSearch(email);$('#site-search').value=profile.email;search();toast('请长按或选中邮箱地址进行复制。');}return;}
  const wechatButton=e.target.closest('[data-copy-wechat]');
  if(wechatButton){const wechat=aboutFor(getLanguage()).contact.wechat;if(!wechat)return;try{await navigator.clipboard.writeText(wechat);confirmCopy(wechatButton,'微信号已复制。');}catch{toast('请选中微信号进行复制。');}return;}
  if(e.target.closest('[data-print]')){window.print();return;}
  const link=e.target.closest('a[href^="#/"]');if(link){
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    closeOverlays();
    const destination=parseContentRoute(link.getAttribute('href'));
    if(homeView&&sceneRoute(destination.route)){
      e.preventDefault();
      const behavior=matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth';
      if(destination.route==='work')homeView.scrollToWork({behavior});else homeView.scrollToHome({behavior});
      return;
    }
    if(link.getAttribute('href')===location.hash){e.preventDefault();if(currentRoute==='about'&&aboutView){scrollAboutSection(parseContentRoute(location.hash).id);highlightSearchTarget('about');}else navigate();}else $('#main-content').focus({preventScroll:true});
  }
});
let scrollTick=false;window.addEventListener('scroll',()=>{if(scrollTick)return;scrollTick=true;requestAnimationFrame(()=>{$('#back-top').hidden=window.scrollY<700;scrollTick=false;});},{passive:true});$('#back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));
// The controller restores scene positions. Native history restoration would race it.
if('scrollRestoration'in history)history.scrollRestoration='manual';
window.addEventListener('popstate',()=>{
  // A different hash is handled by hashchange. Query-only history still needs
  // to restore its language while keeping the current reading position.
  setTimeout(()=>changeLanguage(preferredLanguage(),{persist:false,restoreFocus:false}),0);
});
window.addEventListener('hashchange',()=>{
  closeOverlays();
  const preferred=preferredLanguage();
  if(preferred!==getLanguage()){
    useLanguage(preferred,{persist:false});
    navigate();
    return;
  }
  const next=parseContentRoute(location.hash);
  if(homeView&&sceneRoute(next.route)){
    if(next.route==='work')homeView.scrollToWork({behavior:'instant'});else homeView.scrollToHome({behavior:'instant'});
  }else if(journeyEnabled&&next.route==='journey'&&currentRoute==='journey'&&journeyView&&next.id){journeyView.selectById(next.id);}
  else if(next.route==='about'&&currentRoute==='about'&&aboutView){scrollAboutSection(next.id);highlightSearchTarget('about');}
  else navigate();
});localizeShell();syncThemeControl();syncFeatureShell();fillIcons();navigate();
