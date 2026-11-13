// Keep awards from the same competition apart without losing any records.
export function awardFamily(honor){
  const id=honor.id||'';
  for(const family of ['epda','muse','iai','ncda','cccd','niec','career-planning'])if(id.startsWith(`${family}-`))return family;
  if(honor.category==='scholarship')return 'scholarship';
  if(honor.category==='personal')return 'personal';
  return id;
}
function hash(value,seed){let n=seed>>>0;for(const c of value)n=Math.imul(n^c.charCodeAt(0),16777619)>>>0;return n;}
export function mixHonorRecords(items,seed=2026){
  const rotate=deck=>{if(!deck.length)return deck;const start=hash('first-award',seed)%deck.length;return [...deck.slice(start),...deck.slice(0,start)];};
  const groups=new Map();
  for(const item of items){const key=awardFamily(item);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item);}
  for(const group of groups.values())group.sort((a,b)=>hash(a.id,seed)-hash(b.id,seed)||a.id.localeCompare(b.id));
  const deck=[];let last=null;
  while(deck.length<items.length){
    const available=[...groups].filter(([,list])=>list.length);
    const different=available.filter(([key])=>key!==last);
    const choices=different.length?different:available;
    choices.sort((a,b)=>b[1].length-a[1].length||hash(a[0],seed+deck.length)-hash(b[0],seed+deck.length));
    const [key,list]=choices[0];deck.push(list.shift());last=key;
  }
  if(deck.length>2&&awardFamily(deck[0])===awardFamily(deck.at(-1))){
    for(let i=1;i<deck.length-1;i++){
      const candidate=deck.slice();[candidate[i],candidate[candidate.length-1]]=[candidate.at(-1),candidate[i]];
      if(candidate.every((h,j)=>awardFamily(h)!==awardFamily(candidate[(j+1)%candidate.length])))return rotate(candidate);
    }
  }
  return rotate(deck);
}

// Editorial opening, rather than a ranking across unrelated competitions.
// Keep a strong certificate in the centre and a balanced selection on both
// sides of the circular wall. The complete directory keeps its date order.
const openings={
  all:{
    center:'epda-qilin-2026',
    next:['iai-mantacore-2026','dgut-first-scholarship-2025','muse-starecho-2026'],
    previous:['muse-actus-2026','epda-rehab-explorer-2026','ncda-more-national-2026']
  },
  design:{
    center:'epda-qilin-2026',
    next:['iai-mantacore-2026','muse-starecho-2026','epda-rehab-explorer-2026'],
    previous:['muse-actus-2026','epda-limod-2026','ncda-more-national-2026']
  },
  innovation:{center:'challenge-cup-dongjiang-2026',next:[],previous:[]},
  recognition:{center:'dgut-first-scholarship-2025',next:[],previous:[]}
};
function familyCollisions(deck){
  if(deck.length<2)return 0;
  return deck.reduce((total,item,index)=>total+Number(awardFamily(item)===awardFamily(deck[(index+1)%deck.length])),0);
}
export function exhibitionHonorRecords(items,seed=2026,{category='all'}={}){
  if(!items.length)return [];
  const plan=openings[category]||openings.all,byId=new Map(items.map(item=>[item.id,item]));
  const center=byId.get(plan.center)||items.find(item=>item.id==='dgut-first-scholarship-2025')||mixHonorRecords(items,seed)[0];
  const reserved=new Set([center.id]);
  const take=ids=>ids.flatMap(id=>{const item=byId.get(id);if(!item||reserved.has(id))return [];reserved.add(id);return [item];});
  const next=take(plan.next),previous=take(plan.previous).reverse();
  const remainder=mixHonorRecords(items.filter(item=>!reserved.has(item.id)),seed);
  let best=[center,...next,...remainder,...previous],score=familyCollisions(best);
  // Rotate only the unpinned remainder to avoid repeating a competition at
  // either join. Never rotate the curated opening away from the centre.
  for(let offset=1;score&&offset<remainder.length;offset++){
    const candidate=[center,...next,...remainder.slice(offset),...remainder.slice(0,offset),...previous];
    const collisions=familyCollisions(candidate);
    if(collisions<score){best=candidate;score=collisions;}
  }
  return best;
}
