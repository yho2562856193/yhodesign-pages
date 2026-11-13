const mod=(v,n)=>((v%n)+n)%n;
const signed=(v,n)=>mod(v+n/2,n)-n/2;

// Place real paper edges at one shared screen-space gap after perspective.
export function coverFlowLayout(paperWidths,center,{width,perspective=1150,limit=7}){
  const count=paperWidths.length,radius=Math.floor(Math.min(limit,count)/2);
  if(!count)return {cards:new Map(),gap:0};
  center=mod(center,count);
  function calculate(gap){
    const cards=new Map();
    cards.set(center,{x:0,z:0,angle:0,scale:1,lift:-7,left:-paperWidths[center]/2,right:paperWidths[center]/2,distance:0});
    for(const sign of [-1,1]){
      let edge=sign*paperWidths[center]/2;
      const side=paperWidths.map((w,index)=>({w,index,d:signed(index-center,count)})).filter(v=>Math.sign(v.d)===sign&&Math.abs(v.d)<=radius+1).sort((a,b)=>Math.abs(a.d)-Math.abs(b.d));
      for(const {w,index,d} of side){
        const far=Math.abs(d)-1,z=-120-40*far,scale=Math.max(.66,.81-.035*far),angle=-62*sign;
        const radians=angle*Math.PI/180,q=w*scale/2,s=Math.sin(radians),c=Math.cos(radians),p=perspective;
        const desired=edge+sign*gap;
        const x=sign===1?desired*(p-z-q*s)/p+q*c:desired*(p-z+q*s)/p-q*c;
        const left=p*(x-q*c)/(p-z-q*s),right=p*(x+q*c)/(p-z+q*s);
        cards.set(index,{x,z,angle,scale,lift:0,left,right,distance:d});edge=sign===1?right:left;
      }
    }
    return cards;
  }
  const zero=calculate(0),one=calculate(1),margin=Math.max(12,width*.025),half=width/2-margin;
  let lower=-Infinity,upper=Infinity;
  function constrain(origin,slope,bound,isLower){
    if(Math.abs(slope)<1e-7)return;
    const value=(bound-origin)/slope;
    if((slope>0)===isLower)lower=Math.max(lower,value);else upper=Math.min(upper,value);
  }
  for(const [index,a] of zero){
    if(Math.abs(a.distance)>radius)continue;
    const b=one.get(index);constrain(a.left,b.left-a.left,-half,true);constrain(a.right,b.right-a.right,half,false);
  }
  const preferred=Math.max(12,Math.min(30,width*.018));
  const gap=lower<=upper?Math.max(lower,Math.min(preferred,upper)):Math.min(preferred,upper);
  return {cards:calculate(gap),gap};
}
