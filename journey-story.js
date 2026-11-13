import {journeyScenesHK} from './journey-hk-data.js';

// Content-driven scene beats. Images retain their actual material status.
// This module is independent of the DOM and returns already localised content.
function createJourneyStory(experience,projects,language){
  const en=language==='en';
  const copy=(zh,english,hongKong=zh)=>language==='zh-HK'?hongKong:en?english:zh;
  const firstSentence=text=>String(text||'').match(en?/^.*?[.!?](?:\s|$)/:/^.*?[。！？]/)?.[0].trim()||String(text||'');
  const knownProjects=new Map((projects||[]).map(project=>[project.id,project]));
  const projectHref=(id,section)=>knownProjects.has(id)?`#/project/${id}${section?`/${section}`:''}`:undefined;
  const actions=(experience.story||[]).slice(0,2).map((story,index)=>({
    id:`action-${index+1}`,
    type:copy('经历中的行动','ACTION IN CONTEXT','實踐行動'),
    title:story.title,
    text:firstSentence(story.text)
  }));
  const outcomes={
    id:'outcomes',
    type:copy('阶段记录','THE CHAPTER SO FAR','階段紀錄'),
    title:copy('这一段，留下的东西。','What remains from this chapter.','這段經歷的成果。'),
    items:[...(experience.results||[])]
  };
  const base={
    mode:'origin',
    portalLabel:experience.company,
    concepts:[copy('起点','CONTEXT','起點'),copy('行动','ACTION','行動'),copy('收获','REFLECTION','反思')],
    processTitle:copy('在经历中，继续理解设计。','Keep learning through experience.','從實踐中理解設計。'),
    cards:[...actions,outcomes]
  };
  const action=(index,fields)=>({...actions[index],id:`action-${index+1}`,...fields});

  switch(experience.id){
    case 'rural-talent':
      return {...base,
        mode:'connect',
        portalLabel:copy('连接人才与地方','Connect people and place'),
        concepts:[copy('数字人才','DIGITAL TALENT'),copy('在地需求','LOCAL NEEDS'),copy('栖 · 创 · 融','STAY · CREATE · CONNECT')],
        processTitle:copy('从一个方案，继续提出问题。','Let one proposal open further questions.'),
        cards:[
          action(0,{
            type:copy('比赛设计方案','DESIGN PROPOSAL'),
            title:copy('把两端放进同一方案。','Bring both sides into one proposal.'),
            text:copy('把旅居需求与地方空间、社群活动及产业任务放在一起，形成东江源创服务方案。','A service proposal connects stays with local space, community activity and industry tasks in Dongyuan.'),
            image:'content-v1/dongjiang-rural/02.webp',
            imageCaption:copy('比赛方案中的基地空间设计 · 方案表达','Base-space design in the competition proposal · Design visualisation'),
            href:projectHref('dongjiang-rural','community')
          }),
          action(1,{
            type:copy('后续研究计划','RESEARCH PLAN'),
            title:copy('让方案成为研究的起点。','Make the proposal a starting point.'),
            text:copy('“引智入乡”继续研究人才需求、服务标准与价值转化；SOP、验证和发表属于后续计划。','Rural Talent examines needs, service standards and value creation. SOPs, validation and publication remain research plans.'),
            image:'content-v1/dongjiang-rural/03.webp',
            imageCaption:copy('前期比赛方案中的任务机制示意 · 后续研究基础','Task mechanism in the earlier competition proposal · A basis for continuing research'),
            href:projectHref('dongjiang-rural','research')
          }),
          {...outcomes,type:copy('阶段成果与后续方向','OUTCOMES & CONTINUING DIRECTION')}
        ]
      };

    case 'alibaba':
      return {...base,
        mode:'pullback',
        portalLabel:copy('让清单进入空间','Bring the brief into space'),
        concepts:[copy('物料清单','MATERIALS'),copy('位置示意','PLACEMENT'),copy('空间表达','SPATIAL PLANNING')],
        processTitle:copy('把视觉交付，接到执行。','Connect visual delivery with execution.'),
        cards:[
          action(0,{
            type:copy('资产标识示意','ASSET-LABEL CONCEPTS'),
            title:copy('让规范落到具体触点。','Translate brand rules into touchpoints.'),
            text:copy('从电脑与充电线的标识贴纸示意开始，把分类、材质、VI应用与用途整理为可沟通的内容。','Asset-label concepts for computers and charging cables connect categories, materials, VI applications and purpose.')
          }),
          action(1,{
            type:copy('展示规划与视觉交付','DISPLAY PLANNING & VISUAL DELIVERY'),
            title:copy('让清单进入完整空间。','Bring the schedule into a spatial context.'),
            text:copy('以物料清单、空间预览和位置示意，表达内容、互动装置与参观边界之间的关系。','Material schedules, spatial previews and placement diagrams communicate the relationship between content, displays and visitor boundaries.')
          }),
          {...outcomes,type:copy('规划材料交付','PLANNING DELIVERABLES'),title:copy('清楚的交付，支持下一步。','Clear delivery supports the next step.')}
        ]
      };

    case 'association':
      return {...base,
        mode:'converge',
        portalLabel:copy('让协作发生','Make collaboration possible'),
        concepts:[copy('人','PEOPLE'),copy('想法','IDEAS'),copy('协作','COLLABORATION')],
        processTitle:copy('把各自的想法，组织成共同的行动。','Bring individual ideas into shared action.'),
        cards:[
          action(0,{
            type:copy('协会组织与交流','ASSOCIATION ORGANISATION'),
            title:copy('从部门工作，到整体协作。','From departmental work to collaboration.'),
            text:copy('从部门负责人继续参与协会组织与设计交流，关注活动推进，以及不同年级同学如何参与。','From departmental leadership to wider association work, the focus includes activity delivery and participation across year groups.')
          }),
          action(1,{
            type:copy('艺术体验活动参与','ART-ACTIVITY PARTICIPATION'),
            title:copy('把一次活动组织起来。','Help an activity come together.'),
            text:copy('参与水拓画艺术体验，让内容表达、人员配合与现场执行在具体活动中衔接。','Participation in a water-marbling experience connects communication, teamwork and on-site delivery.')
          }),
          outcomes
        ]
      };

    case 'guanxiang-community':
      return {...base,
        mode:'expand',
        portalLabel:copy('走近地方与日常','Get closer to local life'),
        concepts:[copy('地方','PLACE'),copy('交流','EXCHANGE'),copy('理解','UNDERSTANDING')],
        processTitle:copy('把生活中的观察，带回设计。','Bring observations from life back into design.'),
        cards:[
          action(0,{
            type:copy('社区文化事务实践','COMMUNITY CULTURAL PRACTICE'),
            title:copy('从日常事务，理解地方。','Understand a place through everyday work.'),
            text:copy('在社区文化事务中，观察文化如何介绍、活动如何参与，以及不同角色之间怎样沟通。','Community cultural affairs offer a context for observing how culture is introduced, how people participate and how roles communicate.')
          }),
          action(1,{
            type:copy('观察与研究的联系','OBSERVATION & RESEARCH'),
            title:copy('把观察，带回数字体验。','Bring observation into digital experience.'),
            text:copy('让地方文化与公共服务观察，与非遗数字化研究相互参照，连接屏幕里的内容和真实生活。','Local culture and public-service observations provide a point of reference for digital heritage research and its connection with everyday life.'),
            href:projectHref('digital-heritage')
          }),
          outcomes
        ]
      };

    case 'digital-heritage':
      return {...base,
        mode:'branch',
        portalLabel:copy('把文化，变成可以参与的体验','Make cultural meaning participatory'),
        concepts:[copy('文化资料','CULTURAL SOURCES'),copy('跨学科协作','COLLABORATION'),copy('数字体验','DIGITAL EXPERIENCE')],
        processTitle:copy('一个课题，三种参与方式。','One research context. Three ways to take part.'),
        cards:[
          {
            id:'heritage-platform',type:copy('已交付界面','DELIVERED INTERFACE'),
            title:copy('平台 · 从认识开始。','The platform · Begin with discovery.'),
            text:copy('以文化内容、检索和体验入口组织信息，让阅读成为进一步参与的起点。','Heritage content, discovery and experience entry points connect reading with further participation.'),
            image:'content-v1/heritage-platform/01.webp',
            imageCaption:copy('非遗 H5 平台 · 已交付首页界面','Digital Heritage H5 Platform · Delivered home interface'),
            href:projectHref('heritage-platform')
          },
          {
            id:'guanxiang-game',type:copy('游戏交互成果','GAME INTERACTION OUTCOME'),
            title:copy('莞香 · 在操作中理解。','Guanxiang · Understand through action.'),
            text:copy('把种植、结香、采香与理香知识，转化为选择、时机与精细操作。','Cultivation, resin formation, harvesting and refining become choices, timing and careful actions.'),
            image:'content-v1/guanxiang-game/final-01.webp',
            imageCaption:copy('莞香游戏 · 已交付游戏界面','Guanxiang game · Delivered game interface'),
            href:projectHref('guanxiang-game')
          },
          {
            id:'dragon-game',type:copy('游戏叙事与制作素材','GAME NARRATIVE & ARTWORK'),
            title:copy('舞草龙 · 在情境中回应。','Grass Dragon · Respond within a story.'),
            text:copy('以人物、场景、对白与问答，连接舞草龙的文化背景和参与体验。','Characters, scenes, dialogue and questions connect the Grass Dragon tradition with participation.'),
            image:'content-v1/dragon-game/01.webp',
            imageCaption:copy('舞草龙游戏 · 原始场景与界面图稿','Grass Dragon game · Original scene and interface artwork'),
            href:projectHref('dragon-game')
          }
        ]
      };

    case 'more-coffee':
      return {...base,
        mode:'into-life',
        portalLabel:copy('从品牌，走进日常','From identity into everyday life'),
        concepts:[copy('品牌','IDENTITY'),copy('空间','SPACE'),copy('服务','SERVICE')],
        processTitle:copy('在真实使用中，继续设计。','Keep designing through real use.'),
        cards:[
          {
            id:'identity',type:copy('品牌设计与应用','BRAND DESIGN & APPLICATION'),
            title:copy('从识别，到每一次接触。','From identity to each encounter.'),
            text:copy('把品牌表达放进杯具与应用物料，让使用者在具体触点中认识 More Coffee。','Identity and applied materials bring the More Coffee brand into concrete touchpoints.'),
            image:'more-04.webp',
            imageCaption:copy('More Coffee · 品牌识别与应用原版图稿','More Coffee · Original identity and application board'),
            href:projectHref('more','chapter-2')
          },
          {
            id:'space',type:copy('空间设计与运营实践','SPATIAL DESIGN & OPERATING PRACTICE'),
            title:copy('把体验，放进真实空间。','Bring experience into a real space.'),
            text:copy('把空间分区、点单、停留与咖啡师的工作放在一起考虑，并在运营反馈中持续调整。','Spatial organisation, ordering, staying and barista work inform an experience that continues to change through operating feedback.'),
            image:'more-06.webp',
            imageCaption:copy('More Coffee · 空间设计原版图稿，包含方案表达','More Coffee · Original spatial-design board, including design visualisations'),
            href:projectHref('more','chapter-3')
          },
          {
            id:'service',type:copy('数字服务探索原型','EXPLORATORY DIGITAL-SERVICE PROTOTYPE'),
            title:copy('把服务的信息，接起来。','Connect information across the service.'),
            text:copy('从真实运营中的信息关系出发，探索数字服务触点；界面与流程保留原型阶段的性质。','Digital touchpoints explore information relationships in café operations. The interface and workflow remain exploratory prototypes.'),
            image:'more-07.webp',
            imageCaption:copy('More Coffee · 数字服务探索原型图稿','More Coffee · Exploratory digital-service prototype board'),
            href:projectHref('more','chapter-4')
          }
        ]
      };

    case 'education':
      return {...base,
        mode:'origin',
        portalLabel:copy('回到设计的起点','Back to the starting point'),
        concepts:[copy('产品','PRODUCT'),copy('交互','INTERACTION'),copy('服务','SERVICE')],
        processTitle:copy('从工业设计出发，向外探索。','Start with industrial design. Look further.'),
        cards:[
          action(0,{
            type:copy('学习方向','DESIGN STUDY'),
            title:copy('以产品为起点。','Begin with the product.'),
            text:copy('从产品造型出发，把学习放进具体的设计问题，在课程、团队与实践中继续观察。','Product form provides a starting point for learning through concrete design questions, courses, team projects and practice.')
          }),
          action(1,{
            type:copy('方向探索','EXPLORING DIRECTIONS'),
            title:copy('向交互与服务展开。','Explore interaction and service.'),
            text:copy('逐步连接数字交互、用户研究与服务系统，在不同设计情境中协作、学习和修正。','Digital interaction, user research and service systems offer further contexts for collaboration, learning and revision.')
          }),
          {...outcomes,type:copy('学习状态','CURRENT STUDY'),title:copy('保持好奇，继续向外。','Stay curious. Keep looking further.')}
        ]
      };
    default:return base;
  }
}

export function journeyStory(experience,projects,language='zh'){
  const story=createJourneyStory(experience,projects,language);
  const localized=language==='zh-HK'?journeyScenesHK[experience.id]:null;
  if(!localized) return story;

  const {cards,portalLabel,concepts,processTitle}=localized;
  return {
    ...story,
    portalLabel,
    concepts:[...concepts],
    processTitle,
    cards:story.cards.map(card=>({...card,...cards[card.id]}))
  };
}
