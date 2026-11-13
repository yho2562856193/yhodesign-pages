// Display taxonomy shared by the certificate wall and its complete directory.
// Keep the verified legacy category on each record: other pages still use it.
export const honorCategories=Object.freeze([
  {id:'all',zh:'全部',en:'All','zh-HK':'全部'},
  {id:'design',zh:'设计类竞赛',en:'Design competitions','zh-HK':'設計類比賽'},
  {id:'innovation',zh:'双创类竞赛',en:'Innovation & entrepreneurship','zh-HK':'創新創業比賽'},
  {id:'recognition',zh:'奖学金与个人荣誉',en:'Scholarships & personal honours','zh-HK':'獎學金及個人榮譽'}
].map(Object.freeze));

// Match stable record identities, never translated names or a broad “innovation”
// keyword: social-innovation design awards remain in the design category.
// Per the confirmed scope, NIEC innovation-experience awards also stay in design;
// only Career Planning, Challenge Cup and China International College Students'
// Innovation Competition records belong to the innovation display category.
const innovationAwardIds=new Set([
  'challenge-cup-dongjiang-2026',
  'innovation-autism-school-2026',
  'career-planning-university-2024',
  'career-planning-college-2024',
  'career-planning-college-2023'
]);

export function honorCategory(honor){
  if(honor?.category==='scholarship'||honor?.category==='personal')return 'recognition';
  return innovationAwardIds.has(honor?.id)?'innovation':'design';
}

export function filterHonors(items=[],category='all'){
  if(!honorCategories.some(item=>item.id===category)||category==='all')return [...items];
  return items.filter(item=>honorCategory(item)===category);
}

// Date strings retain their original precision. A year-only record is never
// assigned a guessed month/day; equal dates keep the incoming source order.
export function sortHonorsByDate(items=[]){
  const dateOf=item=>/^\d{4}(?:-\d{2})?(?:-\d{2})?$/.test(item?.date||'')?item.date:'';
  return items.map((item,index)=>({item,index,date:dateOf(item)}))
    .sort((a,b)=>b.date.localeCompare(a.date)||a.index-b.index)
    .map(entry=>entry.item);
}
