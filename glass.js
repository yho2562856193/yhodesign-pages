let glassInstance=0;
export function mountLiquidGlass(navigation,{cloneFilter=false}={}){

let destroyed=false,routeFrame=0,opticalStyle=null,ownedSvg=null;
const disposers=[],observers=[];
const listen=(target,type,handler,options)=>{target.addEventListener(type,handler,options);disposers.push(()=>target.removeEventListener(type,handler,options));};
const observe=(observer,target,options)=>{observer.observe(target,options);observers.push(observer);};
// A web approximation, not Apple's native Liquid Glass renderer.
// The browser samples the live DOM backdrop. This map encodes lens geometry,
// not a screenshot; pointer/press/selection states retarget the optics in rAF.
if(!navigation)return;
let navFilter=document.querySelector('#navigation-glass');
if(cloneFilter&&navFilter){
 const ns='http://www.w3.org/2000/svg',id=`section-glass-${++glassInstance}`;
 ownedSvg=document.createElementNS(ns,'svg');ownedSvg.setAttribute('width','0');ownedSvg.setAttribute('height','0');ownedSvg.setAttribute('aria-hidden','true');ownedSvg.setAttribute('focusable','false');ownedSvg.style.cssText='position:absolute;pointer-events:none';
 const defs=document.createElementNS(ns,'defs'),filter=navFilter.cloneNode(true);
 for(const child of filter.querySelectorAll('[id]'))child.removeAttribute('id');
 filter.id=id;defs.append(filter);ownedSvg.append(defs);document.body.append(ownedSvg);navFilter=filter;
}
const navMap=navFilter?.querySelector('feImage'),filterId=navFilter?.id;
if(!navigation||!navFilter||!navMap)return;
const navLinks=[...navigation.querySelectorAll('a')],displacement=navFilter.querySelector('feDisplacementMap');
if(!navLinks.length||!displacement)return;
navigation.classList.add('glass-ready');navigation.dataset.glassSurface=filterId;
const selection=navigation.querySelector('.nav-selection')||document.createElement('span');selection.className='nav-selection';selection.setAttribute('aria-hidden','true');if(!selection.parentElement)(navigation.querySelector('[data-glass-track]')||navigation).prepend(selection);
// HIG Color: small glass controls adapt independently to content behind them.
// Browsers cannot expose arbitrary composited backdrop pixels to JS. For this
// local page, sample solid DOM backgrounds and decoded same-origin media.
const darkMaterial=matchMedia('(prefers-color-scheme: dark)'), forcedColors=matchMedia('(forced-colors:active)');
const imageSamples=new WeakMap();
const videoSamples=new WeakMap();
let videoSamplingPass=0;
let adaptiveTimer=0,adaptiveFrame=0,materialMode='';
function preferredDark(){
 const theme=document.documentElement.dataset.theme;
 return theme?theme==='dark':darkMaterial.matches;
}
function rgb(value){
 const normalized=value.startsWith('color(srgb ');
 const parts=(normalized?value.slice(11):value).match(/-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi);
 if(!parts||parts.length<3)return [0,0,0,0];
 const scale=normalized?255:1;
 return [+parts[0]*scale,+parts[1]*scale,+parts[2]*scale,parts.length>3?+parts[3]:1];
}
function over(fg,bg,alpha=fg[3]??1){return fg.slice(0,3).map((v,i)=>v*alpha+bg[i]*(1-alpha));}
function luminance(color){const c=color.map(v=>{v=v/255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);});return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
function sampleImage(img,x,y){
 if(!img.complete||!img.naturalWidth)return null;
 let sample=imageSamples.get(img);
 if(!sample||sample.src!==img.currentSrc){
  try{const canvas=document.createElement('canvas');canvas.width=96;canvas.height=96;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,96,96);sample={src:img.currentSrc,data:ctx.getImageData(0,0,96,96).data};imageSamples.set(img,sample);}catch{return null;}
 }
 const r=img.getBoundingClientRect(),style=getComputedStyle(img);
 const scale=style.objectFit==='cover'?Math.max(r.width/img.naturalWidth,r.height/img.naturalHeight):style.objectFit==='contain'?Math.min(r.width/img.naturalWidth,r.height/img.naturalHeight):null;
 const positions=style.objectPosition.split(' ').map(v=>v.endsWith('%')?parseFloat(v)/100:.5);
 const width=scale?img.naturalWidth*scale:r.width,height=scale?img.naturalHeight*scale:r.height;
 const u=(x-r.left-(r.width-width)*positions[0])/width,v=(y-r.top-(r.height-height)*(positions[1]??.5))/height;
 if(u<0||v<0||u>1||v>1)return null;
 const i=(Math.min(95,Math.floor(v*96))*96+Math.min(95,Math.floor(u*96)))*4;
 return [sample.data[i],sample.data[i+1],sample.data[i+2],sample.data[i+3]/255];
}
function mediaOffset(value,freeSpace){
 if(value.endsWith('%'))return freeSpace*parseFloat(value)/100;
 if(value.endsWith('px'))return parseFloat(value);
 const calc=value.match(/^calc\(\s*([-\d.]+)%\s*([+-])\s*([-\d.]+)px\s*\)$/);
 if(calc)return freeSpace*Number(calc[1])/100+(calc[2]==='-'?-1:1)*Number(calc[3]);
 if(value==='left'||value==='top')return 0;
 if(value==='right'||value==='bottom')return freeSpace;
 return freeSpace/2;
}
function sampleVideo(video,x,y,style){
 if(video.readyState<2||!video.videoWidth||!video.videoHeight||!video.currentSrc)return null;
 const src=video.currentSrc;
 let sample=videoSamples.get(video);
 // Use one frame snapshot for all 27 points in a material sampling pass.
 const time=sample?.pass===videoSamplingPass&&sample.src===src?sample.time:video.currentTime;
 if(!sample||sample.src!==src||sample.time!==time){
  try{
   if(new URL(src,location.href).origin!==location.origin)return null;
   const canvas=sample?.canvas||document.createElement('canvas');
   if(!sample||sample.src!==src){canvas.width=96;canvas.height=96;}
   const ctx=canvas.getContext('2d',{willReadFrequently:true});
   sample={src,time,canvas,data:null,pass:videoSamplingPass};
   videoSamples.set(video,sample);
   if(!ctx)return null;
   ctx.clearRect(0,0,96,96);ctx.drawImage(video,0,0,96,96);
   sample.data=ctx.getImageData(0,0,96,96).data;
  }catch{return null;}
 }
 sample.pass=videoSamplingPass;
 if(!sample.data)return null;
 const r=video.getBoundingClientRect();
 if(!r.width||!r.height)return null;
 const contain=Math.min(r.width/video.videoWidth,r.height/video.videoHeight);
 const scale=style.objectFit==='cover'?Math.max(r.width/video.videoWidth,r.height/video.videoHeight):style.objectFit==='contain'?contain:style.objectFit==='none'?1:style.objectFit==='scale-down'?Math.min(1,contain):null;
 const width=scale===null?r.width:video.videoWidth*scale,height=scale===null?r.height:video.videoHeight*scale;
 const position=style.objectPosition.match(/calc\([^)]*\)|[^\s]+/g)||['50%','50%'];
 const u=(x-r.left-mediaOffset(position[0],r.width-width))/width,v=(y-r.top-mediaOffset(position[1]||'50%',r.height-height))/height;
 if(u<0||v<0||u>=1||v>=1)return null;
 const i=(Math.min(95,Math.floor(v*96))*96+Math.min(95,Math.floor(u*96)))*4;
 return [sample.data[i],sample.data[i+1],sample.data[i+2],sample.data[i+3]/255];
}
function backdropAt(x,y,rootColor){
 const stack=document.elementsFromPoint(x,y);
 if(!stack.length)return null;
 let color=rootColor;
 for(const el of stack.reverse()){
  if(el===document.documentElement||el.closest('.header-wrap,[data-glass-surface],.skip-link,dialog,.toast,[data-glass-ignore]'))continue;
  const style=getComputedStyle(el),opacity=Math.max(0,Math.min(1,Number(style.opacity)));
  if(opacity===0)continue;
  const background=rgb(style.backgroundColor);color=over(background,color,background[3]*opacity);
  const pixel=el.tagName==='IMG'?sampleImage(el,x,y):el.tagName==='VIDEO'?sampleVideo(el,x,y,style):null;
  if(pixel)color=over(pixel,color,pixel[3]*opacity);
 }
 return color;
}
function setMaterialFilter(dark,coreAlpha,veil){
 const floods=navFilter.querySelectorAll('feFlood');
 for(const fill of floods)fill.setAttribute('flood-color',dark?'#1a1c20':'#fafafa');
 floods[0].setAttribute('flood-opacity',coreAlpha.toFixed(2));floods[1].setAttribute('flood-opacity',veil.toFixed(2));
}
function clearMaterial(){
 materialMode='';
 delete navigation.dataset.material;
 delete navigation.dataset.backdropLuminance;
 delete navigation.dataset.estimatedContrast;
 navigation.style.removeProperty('--navigation-face');
 const dark=preferredDark();
 setMaterialFilter(dark,dark?.20:.32,dark?.18:.16);
}
function syncMaterial(){
 if(destroyed||document.hidden||navigation.dataset.glassSuspended==='true')return;
 const rect=navigation.getBoundingClientRect();
 if(!rect.width||!rect.height||matchMedia('(prefers-reduced-transparency:reduce),(prefers-contrast:more),(forced-colors:active)').matches){clearMaterial();return;}
 const themeDark=preferredDark();
 const rootColor=over(rgb(getComputedStyle(document.documentElement).backgroundColor),themeDark?[29,29,31]:[245,245,247]);
 videoSamplingPass++;
 const samples=[];
 for(let row=0;row<3;row++)for(let col=0;col<9;col++){
  const x=12+(rect.width-24)*(col+.5)/9,y=rect.height*(row+1)/4,r=rect.height/2;
  const depth=r-Math.hypot(Math.max(Math.abs(x-rect.width/2)-(rect.width/2-r),0),Math.abs(y-r));
  const t=Math.max(0,Math.min(1,depth/Math.min(24,r-1))),coverage=t*t*t*(t*(t*6-15)+10);
  const color=backdropAt(rect.left+x,rect.top+y,rootColor);
  if(color)samples.push({color,coverage});
 }
 if(!samples.length){clearMaterial();return;}
 const mean=samples.reduce((sum,c)=>sum+luminance(c.color),0)/samples.length;
 // Keep the previous material between thresholds, with the site theme as fallback.
 let dark=materialMode?materialMode==='dark':themeDark;
 if(mean<.18)dark=true;else if(mean>.30)dark=false;
 materialMode=dark?'dark':'light';
 const tint=dark?[26,28,32]:[250,250,250],ink=dark?[245,245,247]:[29,29,31];
 const coreAlpha=dark?.20:.32;
 let veil=dark?.18:.16,worst=1;
 // A conservative estimate for mixed imagery; increase just enough for 4.5:1.
 for(let step=0;step<=28;step++){
  veil=Math.min(.72,(dark?.18:.16)+step*.02);
  const inkL=luminance(ink);
  worst=Math.min(...samples.map(sample=>{const alpha=1-(1-coreAlpha*sample.coverage)*(1-veil),L=luminance(over(tint,sample.color,alpha));return (Math.max(L,inkL)+.05)/(Math.min(L,inkL)+.05);}));
  if(worst>=4.5||veil>=.72)break;
 }
 navigation.dataset.material=materialMode;
 navigation.dataset.backdropLuminance=mean.toFixed(3);
 navigation.dataset.estimatedContrast=worst.toFixed(2);
 navigation.style.setProperty('--navigation-face','rgb('+tint.join(' ')+' / '+(1-(1-coreAlpha)*(1-veil)).toFixed(2)+')');
 setMaterialFilter(dark,coreAlpha,veil);
}
function cancelMaterial(){clearTimeout(adaptiveTimer);cancelAnimationFrame(adaptiveFrame);adaptiveTimer=adaptiveFrame=0;}
function requestMaterial(){if(destroyed||navigation.dataset.glassSuspended==='true'||adaptiveTimer||adaptiveFrame)return;adaptiveTimer=setTimeout(()=>{adaptiveTimer=0;adaptiveFrame=requestAnimationFrame(()=>{adaptiveFrame=0;syncMaterial();});},80);}
function syncThemeMaterial(){
 cancelMaterial();
 if(document.hidden||navigation.dataset.glassSuspended==='true'){clearMaterial();return;}
 materialMode='';
 syncMaterial();
}
listen(window,'themechange',syncThemeMaterial);
listen(window,'scroll',requestMaterial,{passive:true});listen(window,'resize',requestMaterial,{passive:true});
listen(document,'load',requestMaterial,true);
listen(document,'timeupdate',event=>{
 const video=event.target;if(video?.tagName!=='VIDEO'||document.hidden||getComputedStyle(video).opacity==='0')return;
 const r=video.getBoundingClientRect(),nav=navigation.getBoundingClientRect();
 if(r.width&&r.height&&nav.width&&nav.height&&r.left<nav.right&&r.right>nav.left&&r.top<nav.bottom&&r.bottom>nav.top)requestMaterial();
},true);
listen(document,'visibilitychange',()=>{if(document.hidden)cancelMaterial();else syncMaterial();});
observe(new ResizeObserver(requestMaterial),navigation);
listen(darkMaterial,'change',()=>{if(!document.documentElement.dataset.theme)syncThemeMaterial();});
for(const query of ['(prefers-reduced-transparency:reduce)','(prefers-contrast:more)','(forced-colors:active)'])listen(matchMedia(query),'change',syncMaterial);
syncMaterial();
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)'),reducedTransparency=matchMedia('(prefers-reduced-transparency: reduce)'),moreContrast=matchMedia('(prefers-contrast: more)');
const lens={x:0,w:0,vx:0,vw:0,tx:0,tw:0,lx:.5,ly:.1,tlx:.5,tly:.1,energy:.67,targetEnergy:.67,press:0,targetPress:0,frame:0,time:0,ready:false};
let navigationSize='',keyboardSelection=false;
function opticsDisabled(){return reducedTransparency.matches||moreContrast.matches||forcedColors.matches;}
function renderLens(){
selection.style.width=lens.w+'px';selection.style.transform='translate3d('+lens.x+'px,0,0) scaleY('+(1-lens.press*.045)+')';
navigation.style.setProperty('--light-x',(lens.lx*100).toFixed(2)+'%');navigation.style.setProperty('--light-y',(lens.ly*100).toFixed(2)+'%');
navigation.style.setProperty('--light-angle',(315+(lens.lx-.5)*18+(lens.ly-.1)*10).toFixed(2)+'deg');navigation.style.setProperty('--light-energy',lens.energy.toFixed(3));
const strength=opticsDisabled()?0:32+lens.press*2;
displacement.setAttribute('scale',strength.toFixed(2));
}
function stopLens(){cancelAnimationFrame(lens.frame);lens.frame=0;lens.time=0;}
function settleImmediately(){stopLens();lens.x=lens.tx;lens.w=lens.tw;lens.vx=lens.vw=0;lens.lx=lens.tlx;lens.ly=lens.tly;lens.energy=lens.targetEnergy;lens.press=lens.targetPress;renderLens();}
function lensFrame(time){
if(destroyed||document.hidden||navigation.dataset.glassSuspended==='true'||!navigation.offsetWidth){stopLens();return;}
const elapsed=lens.time?Math.min((time-lens.time)/1000,.032):1/60;lens.time=time;
const steps=Math.ceil(elapsed/.004),dt=elapsed/steps,omega=2*Math.PI/.34;
for(let i=0;i<steps;i++){lens.vx+=(-omega*omega*(lens.x-lens.tx)-2*omega*lens.vx)*dt;lens.vw+=(-omega*omega*(lens.w-lens.tw)-2*omega*lens.vw)*dt;lens.x+=lens.vx*dt;lens.w+=lens.vw*dt;}
const blend=1-Math.exp(-elapsed*19);
for(const [current,target] of [['lx','tlx'],['ly','tly'],['energy','targetEnergy'],['press','targetPress']])lens[current]+=(lens[target]-lens[current])*blend;
renderLens();
const moving=Math.abs(lens.x-lens.tx)+Math.abs(lens.w-lens.tw)>.08||Math.abs(lens.vx)+Math.abs(lens.vw)>.7||Math.abs(lens.lx-lens.tlx)+Math.abs(lens.ly-lens.tly)+Math.abs(lens.energy-lens.targetEnergy)+Math.abs(lens.press-lens.targetPress)>.003;
if(moving)lens.frame=requestAnimationFrame(lensFrame);else settleImmediately();
}
function requestLens(instant=false){if(instant||reducedMotion.matches||opticsDisabled()){settleImmediately();return;}if(!lens.frame)lens.frame=requestAnimationFrame(lensFrame);}
function positionSelection(instant=false){
if(destroyed||!navigation.offsetWidth)return;
const active=navigation.querySelector('a[aria-current]:not([aria-current="false"])');
selection.hidden=!active;
if(!active){stopLens();return;}
lens.tx=active.offsetLeft;lens.tw=active.offsetWidth;
if(!lens.ready){lens.ready=true;instant=true;}requestLens(instant);
}
function resizeLens(){
if(destroyed)return;
const width=Math.round(navigation.offsetWidth),height=Math.round(navigation.offsetHeight),key=width+'x'+height;
if(!width||!height){stopLens();return;}if(key===navigationSize){positionSelection(true);return;}navigationSize=key;
const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const context=canvas.getContext('2d');if(!context)return;
const image=context.createImageData(width,height),data=image.data,radius=height/2,band=Math.min(24,height/2-1);
for(let y=0;y<height;y++)for(let x=0;x<width;x++){
const dx=x+.5-width/2,dy=y+.5-height/2,qx=Math.abs(dx)-(width/2-radius),ax=Math.max(qx,0),ay=Math.abs(dy),length=Math.hypot(ax,ay),depth=radius-length;
let nx=0,ny=0;if(length){nx=ax/length*Math.sign(dx);ny=ay/length*Math.sign(dy);}
const t=Math.max(0,Math.min(1,depth/band));
const core=t*t*t*(t*(t*6-15)+10);
// Smooth bevel: peak bending within the edge, neutral at both boundaries.
const bevel=Math.max(0,Math.min(1,depth/16));
const bend=depth>=0&&depth<16?Math.sin(Math.PI*bevel):0;
const i=(y*width+x)*4;
data[i]=Math.round(127.5+nx*bend*120);data[i+1]=Math.round(127.5+ny*bend*120);data[i+2]=Math.round(core*255);data[i+3]=255;
}
context.putImageData(image,0,0);navFilter.setAttribute('width',width);navFilter.setAttribute('height',height);navMap.setAttribute('width',width);navMap.setAttribute('height',height);navMap.setAttribute('href',canvas.toDataURL());
if(/Chrome|Chromium|Edg\//.test(navigator.userAgent)&&CSS.supports('backdrop-filter',`url(#${filterId})`)){
if(!opticalStyle){opticalStyle=document.createElement('style');opticalStyle.id=`${filterId}-style`;document.head.append(opticalStyle);}
opticalStyle.textContent=`@media(prefers-reduced-transparency:no-preference) and (prefers-contrast:no-preference) and (forced-colors:none){[data-glass-surface="${filterId}"].glass-ready::before{background:transparent;-webkit-backdrop-filter:url(#${filterId});backdrop-filter:url(#${filterId})}}`;
}
positionSelection(true);
}
observe(new ResizeObserver(resizeLens),navigation);
observe(new MutationObserver(()=>{positionSelection(keyboardSelection);keyboardSelection=false;}),navigation,{subtree:true,attributes:true,attributeFilter:['aria-current']});
listen(navigation,'click',event=>{keyboardSelection=event.detail===0;},true);
listen(navigation,'pointermove',event=>{
if(reducedMotion.matches||opticsDisabled())return;
const rect=navigation.getBoundingClientRect();lens.tlx=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));lens.tly=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));lens.targetEnergy=.72;requestLens();
});
listen(navigation,'pointerleave',()=>{lens.tlx=.5;lens.tly=.1;lens.targetEnergy=.67;lens.targetPress=0;requestLens();});
listen(navigation,'pointerdown',event=>{if(!event.isPrimary||event.button!==0)return;lens.targetPress=1;lens.targetEnergy=.9;requestLens();});
function releaseLens(){if(!lens.targetPress)return;lens.targetPress=0;lens.targetEnergy=navigation.matches(':hover') ? .72 : .67;requestLens();}
listen(window,'pointerup',releaseLens);listen(window,'pointercancel',releaseLens);listen(window,'blur',()=>{lens.targetPress=0;lens.targetEnergy=.67;requestLens(true);});
for(const preference of [reducedMotion,reducedTransparency,moreContrast,forcedColors])listen(preference,'change',()=>positionSelection(true));
listen(document,'visibilitychange',()=>{if(document.hidden)stopLens();else positionSelection(true);});

// The app dispatches routechange after replacing content and updating aria-current.
function routeRefresh(){if(destroyed)return;positionSelection();requestMaterial();cancelAnimationFrame(routeFrame);routeFrame=requestAnimationFrame(()=>{routeFrame=0;if(!destroyed){positionSelection();syncMaterial();}});}
listen(window,'routechange',routeRefresh);
listen(window,'hashchange',routeRefresh);
if(document.fonts)document.fonts.ready.then(()=>{if(!destroyed){resizeLens();requestMaterial();}});
resizeLens();requestMaterial();
return {
 refresh(){if(!destroyed){resizeLens();positionSelection(true);cancelMaterial();syncMaterial();}},
 destroy(){if(destroyed)return;destroyed=true;for(const dispose of disposers)dispose();for(const observer of observers)observer.disconnect();cancelMaterial();cancelAnimationFrame(routeFrame);stopLens();clearMaterial();opticalStyle?.remove();ownedSvg?.remove();navigation.classList.remove('glass-ready');delete navigation.dataset.glassSurface;}
};
}
// The primary navigation retains its original geometry and optics.
if(typeof document!=='undefined')mountLiquidGlass(document.querySelector('.nav'));
