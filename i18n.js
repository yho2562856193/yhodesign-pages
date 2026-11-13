import uiEn from './ui.en.js';
import uiHK from './ui.zh-hk.js';
import {localeInfo,normalizeLocale,resolveLocale} from './locales.js';
const translations=Object.entries(uiEn).sort((a,b)=>b[0].length-a[0].length);
export function preferredLanguage(){
  const query=typeof location==='undefined'?null:new URL(location.href).searchParams.get('lang');
  let saved;
  try{saved=localStorage.getItem('portfolio-language');}catch{}
  return resolveLocale(query,saved);
}
let language=preferredLanguage();
export const getLanguage=()=>language;
export function setLanguage(value,{persist=true}={}){
  const next=normalizeLocale(value);
  if(!next)return;
  language=next;
  if(!persist)return;
  try{localStorage.setItem('portfolio-language',language);}catch{}
  const url=new URL(location.href);
  url.searchParams.set('lang',language);
  history.replaceState(history.state,'',url);
}
export function t(value){
  if(language==='zh-HK'&&value){
    const key=String(value);
    if(Object.hasOwn(uiHK,key))return uiHK[key];
    const trimmed=key.trim();
    return trimmed&&Object.hasOwn(uiHK,trimmed)?key.replace(trimmed,()=>uiHK[trimmed]):value;
  }
  if(language!=='en'||!value)return value;
  if(Object.hasOwn(uiEn,value))return uiEn[value];
  let result=String(value);
  for(const [zh,en] of translations)if(result.includes(zh))result=result.split(zh).join(en);
  return result;
}
export const copy=(zh,en,hk)=>language==='en'?en:language==='zh-HK'?(hk??t(zh)):zh;
const visibleAttributes=['aria-label','title','alt','placeholder','data-caption'];
function translateTree(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode()))if(node.nodeValue.trim()&&!node.parentElement?.closest('script,style'))node.nodeValue=t(node.nodeValue);
  root.querySelectorAll('*').forEach(el=>visibleAttributes.forEach(attr=>{if(el.hasAttribute(attr))el.setAttribute(attr,t(el.getAttribute(attr)));}));
}
export function localizeHTML(html){
  if(language==='zh')return html;
  const template=document.createElement('template');template.innerHTML=html;
  translateTree(template.content);
  return template.innerHTML;
}
// Keep navigation nodes in place so the optical component retains its bindings.
const shellEntries=[];
for(const root of globalThis.document?.querySelectorAll('.header-wrap,dialog,.skip-link,#back-top')??[]){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode()))if(node.nodeValue.trim())shellEntries.push({node,value:node.nodeValue});
  for(const el of [root,...root.querySelectorAll('*')])for(const attr of visibleAttributes)if(el.hasAttribute(attr))shellEntries.push({el,attr,value:el.getAttribute(attr)});
}
for(const el of globalThis.document?.querySelectorAll('meta[name="description"],meta[property^="og:"]')??[])if(el.content)shellEntries.push({el,attr:'content',value:el.content});
export function localizeShell(){
  const {label,short,tag,chooser}=localeInfo[language];
  document.documentElement.lang=tag;
  for(const entry of shellEntries){if(entry.node)entry.node.nodeValue=t(entry.value);else entry.el.setAttribute(entry.attr,t(entry.value));}
  const button=document.querySelector('#language-toggle');
  if(button){button.textContent=short;button.setAttribute('aria-label',`${chooser} · ${label}`);button.title=chooser;}
  const options=document.querySelector('#language-options');
  if(options){
    options.setAttribute('aria-label',chooser);
    for(const option of options.querySelectorAll('[data-locale]'))option.setAttribute('aria-pressed',String(option.dataset.locale===language));
  }
  const brand=document.querySelector('.brand-name');
  if(brand)brand.textContent='yhodesign';
  const brandLink=document.querySelector('.brand');
  if(brandLink)brandLink.setAttribute('aria-label',copy('yhodesign，返回首页','yhodesign, back to home'));
}
