// Original competition identifiers, sourced from official assets or verified certificates.
// Files are local; source is attribution metadata, never a runtime image URL.
export const competitionLogos = {
  ncda: {
    src:'work-v2/competitions/ncda.png',
    name:'未来设计师 · 全国高校数字艺术设计大赛',
    nameEn:'NCDA · National College Digital Art & Design Awards',
    source:'honors/a-ncda-more-national-2026-full.webp',
    sourceKind:'certificate',width:265,height:110
  },
  cccd: {
    src:'work-v2/competitions/cccd.png',
    name:'中国大学生文化创意设计大赛',
    nameEn:'Chinese College Student Cultural Art Design Award',
    source:'honors/a-cccd-more-provincial-2026-full.webp',
    sourceKind:'certificate',width:790,height:485
  },
  cdwa: {
    src:'work-v2/competitions/cdwa.png',
    name:'中国高等院校设计作品大赛',
    nameEn:'China University Design Works Competition',
    source:'content-v1/lumo-awards/certificate-full.webp',
    sourceKind:'certificate',width:250,height:150,
    sourceNote:'Official DESIGN publisher identifier printed on the competition certificate.'
  },
  hkcda: {
    src:'work-v2/competitions/hkcda.png',
    name:'香港当代设计奖',
    nameEn:'Hong Kong Contemporary Design Awards',
    source:'honors/b-hkcda-nuanban-2026-full.webp',
    sourceKind:'certificate',width:625,height:295
  },
  'challenge-cup': {
    src:'work-v2/competitions/challenge-cup.png',
    name:'挑战杯',nameEn:'Challenge Cup',
    source:'honors/b-challenge-cup-dongjiang-2026-full.webp',
    sourceKind:'certificate',width:390,height:200
  },
  innovation: {
    src:'work-v2/competitions/innovation.png',
    name:'中国国际大学生创新大赛',
    nameEn:"China International College Students' Innovation Competition",
    source:'https://t2.chei.com.cn/ncss/cy/web/img/tit1.png?t=20240105',
    sourceKind:'official',width:92,height:69
  },
  muse: {
    src:'work-v2/competitions/muse.png',
    name:'MUSE Design Awards',nameEn:'MUSE Design Awards',
    source:'honors/a-muse-starecho-standard-full.webp',
    sourceKind:'certificate',width:260,height:375
  },
  epda: {
    src:'work-v2/competitions/epda.png',
    name:'European Product Design Award',nameEn:'European Product Design Award',
    source:'https://www.productdesignaward.eu/wp-content/uploads/2024/09/epda-european-product-design-awards-logo.png',
    sourceKind:'official',width:1416,height:1225
  },
  iai: {
    src:'work-v2/competitions/iai.png',
    name:'IAI设计奖',nameEn:'IAI Design Award',
    source:'https://iai-apdf.com/static/image/logo/b1b8461b-2b28-4269-8450-6dc64862f9fc.png',
    sourceKind:'official',width:140,height:78
  }
};

// Only the 20 verified project/award correspondences are mapped here.
// Regional and national awards remain separate records even when they share a logo.
export const awardCompetitionIds = {
  'ncda-more-national-2026':'ncda',
  'ncda-more-guangdong-2026':'ncda',
  'cccd-more-provincial-2026':'cccd',
  'hkcda-nuanban-2026':'hkcda',
  'cccd-nuanban-provincial-third-2026':'cccd',
  'cccd-nuanban-provincial-merit-2026':'cccd',
  'cdwa-nuanban-merit-2026':'cdwa',
  'cccd-camploop-national-2026':'cccd',
  'cccd-camploop-provincial-2026':'cccd',
  'challenge-cup-dongjiang-2026':'challenge-cup',
  'innovation-autism-school-2026':'innovation',
  'muse-starecho-2026':'muse',
  'epda-qilin-2026':'epda',
  'iai-qilin-2026':'iai',
  'muse-qilin-2026':'muse',
  'epda-rehab-explorer-2026':'epda',
  'iai-step-sequence-2026':'iai',
  'muse-actus-2026':'muse',
  'iai-mantacore-2026':'iai',
  'cccd-guanxiang-provincial-2026':'cccd'
};

export const competitionIdForAward = awardId => awardCompetitionIds[awardId] || null;
export const competitionLogoForAward = awardId => competitionLogos[competitionIdForAward(awardId)] || null;
