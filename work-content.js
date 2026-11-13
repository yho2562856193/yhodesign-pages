import {originalGalleries} from './originals-data.js';
import {dongjiangContent} from './dongjiang-data.js';
import {heritageGalleries} from './heritage-gallery-data.js';
import {platformMedia} from './heritage-platform-media.js';
import {projectCategoriesHK,projectCopyHK,projectLinkLabelsHK,projectSourceLabelsHK} from './projects-hk-data.js';

const sources=[
 {id:'platform-launch',date:'2026-09-19',href:'https://mp.weixin.qq.com/s/D_l24SAC56MOSDWxvK281Q',zh:'校园数字非遗H5平台上线，欢迎体验',en:'The campus digital-heritage H5 platform goes live'},
 {id:'dragon-launch',date:'2026-09-23',href:'https://mp.weixin.qq.com/s/8sEA7GFaAFs10wokWP2huA',zh:'中秋“舞草龙之旅”有奖游戏启动，边玩边学等你来！',en:'Grass Dragon Journey: a Mid-Autumn game experience'},
 {id:'guanxiang-launch',date:'2026-10-12',href:'https://mp.weixin.qq.com/s/nFVelF65l3cWxE9aKRmQvg',zh:'来玩！莞工学子打造莞香非遗小游戏',en:'A Guanxiang heritage game made by DGUT students'},
 {id:'campus-activity',date:'2026-10-15',href:'https://mp.weixin.qq.com/s/Wm9TqwVHzpGCcU9MhBeacg',zh:'线下体验 | 畅玩「数字非遗在校园」，达标就领礼品！',en:'Campus experience: achievements, points and in-person activities'}
];
const site='https://gift-studio.cn/digital-heritage/';
// Supplied title artwork is independent of the unchanged project-page galleries.
const platformCover={src:'heritage-covers/platform-title.webp',width:3840,height:2160};
export const heritageCovers={
 'digital-heritage':platformCover,
 'heritage-platform':platformCover,
 'guanxiang-game':{src:'heritage-covers/guanxiang-title.webp',width:2276,height:1280},
 'dragon-game':{src:'heritage-covers/dragon-title.webp',width:1080,height:607}
};
const allMedia=[...Object.values(originalGalleries).flatMap(g=>[...g.items,...g.videos||[]]),...dongjiangContent.groups.flatMap(g=>g.items),...Object.values(heritageGalleries).flatMap(g=>g.items),...platformMedia];
export const workMediaSizes=Object.fromEntries([...Object.values(heritageCovers).map(m=>[m.src,[m.width,m.height]]),...allMedia.flatMap(m=>[
 ...(m.src&&m.width&&m.height?[[m.src,[m.width,m.height]]]:[]),
 ...(m.full&&m.fullWidth&&m.fullHeight?[[m.full,[m.fullWidth,m.fullHeight]]]:[])
])]);
const labels={
 zh:{originals:'原稿',platform:'已上线平台',guanxiang:'莞香文化互动游戏',dragon:'舞草龙之旅'},
 'zh-HK':{originals:'原稿',platform:'已上線平台',guanxiang:'莞香文化互動遊戲',dragon:'舞草龍之旅'},
 en:{originals:'Original artwork',platform:'The live platform',guanxiang:'Guanxiang interactive game',dragon:'Grass Dragon Journey'}
};
const portfolioDownloadLabelsHK={
 'portfolio-original.pdf':'完整作品集原始 PDF · 338 MB',
 'portfolio-web.pdf':'完整作品集 · 網頁優化版 PDF · 18.8 MB'
};
function heritageCopy(p,locale){
 const en=locale==='en';
 const copy=(zh,eng)=>en?eng:zh;
 if(p.id==='digital-heritage'){
  p.aliases=[...new Set([...(p.aliases||[]),'数字非遗 · 在体验中传承','数字非遗','莞脉守护者计划','数字非遗在校园','Guanmai Guardians'])];
  p.title=copy('莞脉守护者计划——数字非遗在校园','Guanmai Guardians — Digital Heritage on Campus');
  p.subtitle=copy('让本土非遗，成为可以参与的校园体验。','Local heritage, brought into campus life.');
  p.lead=p.subtitle;
  p.description=copy('以东莞本土非遗为内容，将非遗资源、数字游戏与个人成长记录连接起来。平台已上线，莞香与舞草龙两款游戏提供不同的参与方式，校园活动将线上探索延伸到线下。','A live H5 platform connects Dongguan heritage resources, digital games and personal learning records. Guanxiang and Grass Dragon offer distinct ways to participate, while campus activities connect online exploration with in-person experiences.');
  p.type=copy('平台与游戏已上线','Live platform and games');
  p.mediaGroups=[{id:'platform',title:labels[locale].platform,items:platformMedia},{id:'guanxiang',title:labels[locale].guanxiang,items:heritageGalleries['guanxiang-game'].items},{id:'dragon',title:labels[locale].dragon,items:heritageGalleries['dragon-game'].items}];
  p.projectNotes=[
   {title:copy('平台与学习','Platform and learning'),text:copy('非遗资源检索、数字体验、课程学习与成长中心已经上线，积分记录参与过程。积分兑换知行学分仍是后续计划。','Heritage search, digital experiences, course learning and a growth centre are live. Points record participation; exchanging points for university learning credits remains a future plan.')},
   {title:copy('两种互动路径','Two ways to take part'),text:copy('莞香游戏围绕树木生长、开香门、采香、理香展开；舞草龙以漫画剧情、制作互动和知识挑战连接文化与体验。','The Guanxiang game follows tree growth, opening the trunk, harvesting and refining. Grass Dragon combines comic storytelling, making activities and knowledge challenges.')},
   {title:copy('校园推广与体验','Campus engagement'),text:copy('2026年10月发布的活动说明，将成长中心成就、积分兑换与线下VR体验相联系。这些内容作为项目推广记录保留。','An October 2026 activity announcement connected growth-centre achievements and points with gift exchange and an in-person VR experience. It is presented here as a project-engagement record.')}
  ];
  p.links=[{href:site+'#/',label:copy('打开线上平台','Open the live platform')}];
  p.sources=sources.map(s=>({...s,label:en?s.en:s.zh}));
 }else if(p.id==='heritage-platform'){
  p.title=copy('数字非遗在校园 · H5平台','Digital Heritage on Campus · H5 Platform');
  p.lead=copy('将非遗资源、互动体验与学习成长连接起来。','Connect heritage resources, interactive experiences and learning.');
  p.description=copy('平台围绕非遗资源、数字体验、校园动态及个人成长中心搭建，已经正式上线。收藏、学习与体验记录形成个人足迹，积分规则支持持续参与；学分互换仍属后续计划。','The live platform brings together heritage resources, digital experiences, campus updates and a personal growth centre. Saved resources and learning and game records form a personal trail. Points support participation; credit exchange remains a future plan.');
  p.type=copy('已上线 · H5平台','Live · H5 platform');
  p.mediaGroups=[{id:'originals',title:'',items:platformMedia}];
  p.originalAnchors={platform:platformMedia[0].id,information:'platform-12',participation:'platform-21'};
  p.sources=[{...sources[0],label:en?sources[0].en:sources[0].zh}];
  p.links=[{href:site+'#/',label:copy('打开线上平台','Open the live platform')}];
 }else if(p.id==='guanxiang-game'){
  p.lead=copy('在四个互动阶段中，了解莞香制作技艺。','Discover Guanxiang craft through four interactive stages.');
  p.description=copy('按提示点击屏幕，依次体验树木生长、开香门、采香、理香，最终成香。以数字交互呈现制作流程，让文化知识进入具体操作。','Follow on-screen prompts through tree growth, opening the trunk, harvesting and refining. Digital interactions introduce the craft process through concrete actions.');
  p.type=copy('已上线 · 非遗互动游戏','Live · Interactive heritage game');
  p.links=[{href:site+'#/experience/game/game01',label:copy('体验莞香游戏','Play the Guanxiang game')}];
  p.requiresExternalLogin=true;p.sources=[{...sources[2],label:en?sources[2].en:sources[2].zh}];
 }else if(p.id==='dragon-game'){
  p.title=copy('舞草龙之旅','Grass Dragon Journey');
  p.lead=copy('跟随小东与阿关，在故事中体验舞草龙。','Follow Xiaodong and Aguan into the story of the grass dragon.');
  p.description=copy('以漫画剧情、游戏交互与非遗科普为核心，跟随角色体验扎草龙、舞草龙，并通过知识挑战继续探索文化内容。原稿保留剧情、人物与互动界面。','Comic storytelling, interactive activities and heritage learning follow characters through making and dancing a grass dragon. Knowledge challenges extend the experience. Original artwork preserves the story, characters and interfaces.');
  p.type=copy('已上线 · 叙事与知识游戏','Live · Story and knowledge game');
  p.links=[{href:site+'#/experience/game/dragon-dance-story',label:copy('体验舞草龙之旅','Play Grass Dragon Journey')}];
  p.requiresExternalLogin=true;p.sources=[{...sources[1],label:en?sources[1].en:sources[1].zh}];
 }
}
export function decorateProjects(records,language='zh'){
 const en=language==='en';
 const hk=language==='zh-HK';
 const locale=hk?'zh-HK':en?'en':'zh';
 const copy=(zh,english)=>en?english:zh;
 const filmLabel=hk?'項目短片':copy('项目影片','Project film');
 return structuredClone(records).map(p=>{
  const original=originalGalleries[p.id]||heritageGalleries[p.id];
  if(original){p.cover=original.cover;p.originalAnchors=original.legacyAnchors||{};p.mediaGroups=[{id:'originals',title:'',items:[...original.items,...original.videos||[]]}];if(original.downloads)p.downloads=original.downloads;}
  if(p.id==='dongjiang-rural'){
   p.cover=dongjiangContent.cover;p.lead=copy('连接数字游民与地方需要的“栖·创·融”服务方案。','A service proposal connecting digital nomads and local needs.');
   p.description=copy('初赛以完整策划案及服务、空间、品牌和调研图表展开；省决赛以路演演示与动画呈现方案。本页分别保留两个阶段的完整成果。','The preliminary submission combines a proposal with service, space, brand and research materials. The provincial final presents the proposal through a pitch deck and animation. Both stages are preserved here.');
   p.mediaGroups=dongjiangContent.groups.map(g=>({...g,title:g.title[locale]}));p.projectOverview=dongjiangContent.overview[locale];
   p.downloads=dongjiangContent.downloads.map(d=>({...d,label:d.label[locale]}));
   p.originalAnchors={packages:'dongjiang-attachment-03',community:'dongjiang-attachment-08',research:'dongjiang-attachment-40'};
  }
  heritageCopy(p,locale);
  const hkCopy=hk?projectCopyHK[p.id]:null;
  if(hkCopy){
   Object.assign(p,structuredClone(hkCopy));
   p.category=projectCategoriesHK[p.categoryId]||p.category;
   if(!hkCopy.tags) p.tags=[p.category];
   if(p.links) p.links=p.links.map(link=>({...link,label:projectLinkLabelsHK[p.id]||link.label}));
   if(p.sources) p.sources=p.sources.map(source=>({...source,label:projectSourceLabelsHK[source.id]||source.label}));
   if(p.downloads) p.downloads=p.downloads.map(download=>{
    const name=download.file.split('/').at(-1);
    const label=portfolioDownloadLabelsHK[name];
    return label?{...download,label}:download;
   });
  }
  p.gallery=(p.mediaGroups||[]).flatMap(g=>g.items).filter(m=>m.type!=='video').map(m=>({...m,caption:`${p.title} · ${copy('原稿','Original')} ${m.sourcePage??''}`}));
  p.mediaGroups=(p.mediaGroups||[]).map(g=>({...g,items:g.items.map(m=>({...m,caption:`${p.title} · ${g.title?g.title+' · ':''}${m.type==='video'?filmLabel:copy('原稿','Original')+' '+(m.sourcePage??'')}`}))}));
  const first=heritageCovers[p.id]||p.gallery.find(m=>m.src===p.cover);if(first){p.cover=first.src;p.coverWidth=first.width;p.coverHeight=first.height;}
  return p;
 });
}
