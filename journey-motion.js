const clamp=value=>Math.max(0,Math.min(1,value));
const ease=value=>{const t=clamp(value);return t*t*(3-2*t);};
const between=(value,start,end)=>ease((value-start)/(end-start));
export const JOURNEY_PHASES={location:.34,practice:.64,outcomes:.98};

// Geometry drives the camera. Reversing the scroll reverses the complete story.
export function sceneMotion(top,height,viewport,{reduced=false,compact=false,mode='connect',count=3}={}){
 const progress=clamp(-top/Math.max(1,height-viewport));
 const enter=between(progress,0,.34),depart=between(progress,0,.29);
 const arrival=between(progress,.17,.29),leave=between(progress,.43,.55);
 const deck=between(progress,.47,.59),position=between(progress,.62,.98)*Math.max(0,count-1);
 if(reduced)return {progress:0,portalW:100,portalH:100,portalY:0,portalRound:0,imageScale:1,foreX:0,foreScale:1,foreOpacity:0,locationOpacity:1,locationY:0,photoShade:.42,deckOpacity:0,deckY:0,headingY:0,deckIndex:0,nodeSpread:18,nodeOpacity:1,phase:0};
 const pullback=mode==='pullback',converge=mode==='converge';
 return {progress,portalW:pullback?100:(compact?76:36)+(compact?24:64)*enter,
  portalH:pullback?100:58+42*enter,portalY:pullback?0:7*(1-enter),portalRound:pullback?0:45*(1-enter),
  imageScale:pullback?2.1-enter*1.1:1.28-enter*.28,
  foreX:depart*(compact?115:105),foreScale:1+depart*.55,foreOpacity:1-between(progress,.06,.23),
  locationOpacity:arrival*(1-leave),locationY:(1-arrival)*18-leave*28,
  photoShade:.12+arrival*.55+deck*.25,deckOpacity:deck,deckY:(1-deck)*105,headingY:(1-deck)*35,
  deckIndex:position,nodeSpread:converge?32-enter*(compact?8:20):6+enter*18,nodeOpacity:1-deck,
  phase:progress<.56?0:progress<.89?1:2};
}
export function cardMotion(deckIndex,index,{compact=false,mode='',progress=1}={}){
 const distance=index-deckIndex,magnitude=Math.abs(distance);
 const unfolds=mode==='branch'||mode==='origin',spread=unfolds?between(progress,.46,.62):1;
 return {x:distance*(compact?84:36)*spread,y:Math.min(4,magnitude*magnitude)*(compact?6:9)*spread,rotate:distance*(compact?7:11)*spread,scale:1-Math.min(2,magnitude)*.055,opacity:1,z:Math.round(100-magnitude*10)};
}
export function cardProgress(index,count){const target=Math.max(0,Math.min(count-1,index))/Math.max(1,count-1);return .62+(.5-Math.sin(Math.asin(1-2*target)/3))*.36;}
export function readingMotion(top,viewport,{reduced=false}={}){return reduced?1:ease((viewport*.95-top)/(viewport*.55));}
