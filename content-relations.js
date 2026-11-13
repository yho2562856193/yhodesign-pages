// Only verified, direct correspondences belong here. Certificate titles stay intact.
const project=(id,section)=>({kind:'project',id,...section?{section}:{}});
const experience=id=>({kind:'experience',id});
const pairs=[
 ['ncda-more-national-2026',[project('more'),experience('more-coffee')]],
 ['ncda-more-guangdong-2026',[project('more'),experience('more-coffee')]],
 ['cccd-more-provincial-2026',[project('more'),experience('more-coffee')]],
 ['hkcda-nuanban-2026',[project('lumo')]],
 ['cccd-nuanban-provincial-third-2026',[project('lumo')]],
 ['cccd-nuanban-provincial-merit-2026',[project('lumo')]],
 ['cdwa-nuanban-merit-2026',[project('lumo')]],
 ['cccd-camploop-national-2026',[project('camp','workbench')]],
 ['cccd-camploop-provincial-2026',[project('camp','workbench')]],
 ['challenge-cup-dongjiang-2026',[project('dongjiang-rural'),experience('rural-talent')]],
 ['innovation-autism-school-2026',[project('star-echo')]],
 ['muse-starecho-2026',[project('star-echo')]],
 ['epda-qilin-2026',[project('qilin-motion')]],
 ['iai-qilin-2026',[project('qilin-motion')]],
 ['muse-qilin-2026',[project('qilin-motion')]],
 ['epda-rehab-explorer-2026',[project('rehab-explorer')]],
 ['iai-step-sequence-2026',[project('rehab-explorer')]],
 ['muse-actus-2026',[project('actus')]],
 ['iai-mantacore-2026',[project('mantacore')]],
 ['cccd-guanxiang-provincial-2026',[project('guanxiang-game'),experience('digital-heritage')]]
];
export const relationRecords=pairs.map(([awardId,targets])=>({awardId,targets}));
export const targetsForAward=awardId=>relationRecords.find(r=>r.awardId===awardId)?.targets||[];
export function honorsForTarget(honors,kind,id){return honors.filter(h=>targetsForAward(h.id).some(t=>t.kind===kind&&t.id===id));}

const copyFor=language=>(zh,en,hk)=>language==='en'?en:language==='zh-HK'?hk:zh;

export function additionalHonorsFor(language){
 const copy=copyFor(language);
 return [{
  id:'cdwa-nuanban-merit-2026',
  name:copy('第十三届中国高等院校设计作品大赛','13th China University Design Works Competition','第十三屆中國高等院校設計作品大賽'),
  level:copy('优秀奖','Excellence Award','優秀獎'),
  work:copy('暖伴·AI情感主动陪伴式养老服务机器人系统','Nuanban · AI Emotional Companion Elderly-Care Robot System','暖伴·AI情感主動陪伴式養老服務機器人系統'),
  year:'2026',date:'2026-09',category:'competition',group:copy('全国','National','全國'),
  certificate:'content-v1/lumo-awards/certificate.webp',full:'content-v1/lumo-awards/certificate-full.webp',materialKind:'certificate'
 }];
}

export function lumoInclusionFor(language){
 const copy=copyFor(language);
 return {
  title:copy('作品入编《2026中国高等院校设计作品精选》','Included in the 2026 university design selection','作品入編《2026中國高等院校設計作品精選》'),
  text:copy(
   '“暖伴”收录于《2026中国高等院校设计作品精选》产品篇，书内第032页（PDF第42页）。这是设计作品收录记录，与大赛优秀奖分开呈现。',
   'Nuanban appears on printed page 032 (PDF page 42) of the 2026 China University Design Works Selection. This is a design-work inclusion, recorded separately from the Excellence Award.',
   '「暖伴」收錄於《2026中國高等院校設計作品精選》產品篇，見書內第 032 頁（PDF 第 42 頁）。這項作品收錄紀錄與大賽優秀獎分開列出。'
  ),
  media:[{
   src:'content-v1/lumo-awards/inclusion-full.webp',type:'image',
   caption:copy('原始收录页面 · 设计作品精选','Original inclusion page · Design-work selection','原始收錄頁面 · 設計作品精選')
  }]
 };
}
