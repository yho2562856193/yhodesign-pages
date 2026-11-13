import {copy} from './i18n.js';
import {icons} from './icons.js';

const key='portfolio-theme';
const system=matchMedia('(prefers-color-scheme: dark)');
const root=document.documentElement;
const button=document.querySelector('#theme-toggle');
const symbol=button.querySelector('.theme-symbol');
const themeColor=document.querySelector('meta[name="theme-color"]');
const valid=value=>value==='light'||value==='dark'?value:null;
let preference=null;
try{preference=valid(localStorage.getItem(key));}catch{}

export function syncThemeControl(){
  const dark=root.dataset.theme==='dark';
  button.setAttribute('aria-pressed',String(dark));
  button.setAttribute('aria-label',copy('暗夜模式','Dark mode','暗夜模式'));
  button.title=dark
    ?copy('切换到白天模式','Switch to light mode','切換至日間模式')
    :copy('切换到暗夜模式','Switch to dark mode','切換至暗夜模式');
  symbol.innerHTML=icons[dark?'moon':'sun'];
}

function applyTheme(){
  const theme=preference||(system.matches?'dark':'light');
  const changed=root.dataset.theme!==theme;
  root.dataset.theme=theme;
  themeColor.content=theme==='dark'?'#101012':'#f5f5f7';
  syncThemeControl();
  if(changed)window.dispatchEvent(new CustomEvent('themechange',{detail:{theme}}));
}

button.addEventListener('click',()=>{
  preference=root.dataset.theme==='dark'?'light':'dark';
  try{localStorage.setItem(key,preference);}catch{}
  applyTheme();
});
system.addEventListener('change',()=>{if(!preference)applyTheme();});
window.addEventListener('storage',event=>{
  if(event.key!==null&&event.key!==key)return;
  preference=valid(event.newValue);
  applyTheme();
});
applyTheme();
