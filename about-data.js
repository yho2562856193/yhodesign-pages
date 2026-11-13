// Curated public profile. Source documents stay outside the served website.
// Course scores follow the 2026-10-08 transcripts. The scholarship aggregate was
// confirmed by the user on 2026-11-06; it does not create extra certificate records.
const bi=(zh,en,hk=zh)=>({zh,en,'zh-HK':hk});
const course=(id,title,english,score,hk)=>({id,title:bi(title,english,hk),score});
const record={
  updated:'2026-11-06',
  sections:[
    {id:'overview',label:bi('简介','Overview','簡介')},
    {id:'education',label:bi('教育','Education')},
    {id:'skills',label:bi('能力','Capabilities')},
    {id:'practice',label:bi('实践','Practice','實踐')},
    {id:'focus',label:bi('关注','Focus','關注')},
    {id:'life',label:bi('生活','Beyond design')},
    {id:'contact',label:bi('联系','Contact','聯絡')}
  ],
  overview:{
    lead:bi('产品、交互与服务设计。','Product, interaction and service design.','產品、互動與服務設計。'),
    paragraphs:[
      bi('我在东莞理工学院学习工业设计。从产品造型和数字建模出发，逐步将关注转向交互与服务系统。','I study Industrial Design at Dongguan University of Technology, with a focus that has grown from product form and digital modelling to interaction and service systems.','我現於東莞理工學院修讀工業設計。由產品造型和數碼建模入手，逐步把關注延伸到互動設計與服務系統。'),
      bi('咖啡店运营、非遗数字化和乡村服务研究，让我在真实情境中观察需求、协作制作，并通过反馈修正设计。','Café operations, digital heritage and rural service research inform how I observe needs, collaborate and refine designs through feedback.','參與咖啡店營運、非遺數碼化及鄉村服務研究，讓我在實際情境中觀察需求、協作製作，並按回饋改進設計。')
    ],
    facts:[
      {id:'identity',label:bi('姓名','Name'),value:bi('叶昊聪 · Haocong YE','Haocong YE','葉昊聰 · Haocong YE')},
      {id:'study',label:bi('正在学习','Studying','現正修讀'),value:bi('工业设计 · 本科在读','Industrial Design · Undergraduate','工業設計 · 本科在讀')},
      {id:'location',label:bi('目前在','Based in','所在地'),value:bi('中国 · 东莞','Dongguan, China','中國 · 東莞')},
      {id:'direction',label:bi('设计方向','Design focus','設計方向'),value:bi('产品 · 交互 · 服务','Product · Interaction · Service','產品 · 互動 · 服務')}
    ]
  },
  education:{
    school:bi('东莞理工学院','Dongguan University of Technology','東莞理工學院'),
    major:bi('工业设计 · 本科在读','Industrial Design · Undergraduate','工業設計 · 本科在讀'),
    period:bi('2023.09 — 2027.06（预计毕业）','Sep 2023 — Jun 2027 (expected)','2023.09 — 2027.06（預計畢業）'),
    gpa:'3.45',
    weightedAverage:'84.45',
    recognition:{
      source:'user-confirmed-2026-11-06',
      scholarships:{first:2,third:1},
      badgeLine:bi('一等奖学金 ×2','First-Class Scholarship ×2','一等獎學金 ×2'),
      summary:bi('两获一等奖学金，学业表现与实践能力持续获得认可。','Twice awarded a First-Class Scholarship, with recognition for academic work and campus contribution.','兩度獲頒一等獎學金，學業表現及實踐能力持續獲肯定。'),
      items:[
        {id:'first-scholarship',label:bi('一等奖学金 ×2','First-Class Scholarship ×2','一等獎學金 ×2')},
        {id:'third-scholarship',label:bi('三等奖学金','Third-Class Scholarship','三等獎學金')},
        {id:'outstanding-undergraduate',label:bi('优秀大学生','Outstanding Undergraduate','優秀大學生')},
        {id:'outstanding-student-cadre',label:bi('优秀学生干部','Outstanding Student Cadre','優秀學生幹部')},
        {id:'student-leader',label:bi('优秀学生骨干','Outstanding Student Leader','優秀學生骨幹')}
      ]
    },
    note:bi('成绩覆盖2023—2024至2025—2026学年；成绩单打印于2026.10.08。GPA按成绩单原值展示。','Results cover the 2023–2024 through 2025–2026 academic years. Transcripts printed on 8 October 2026. GPA is shown as recorded.','成績涵蓋 2023—2024 至 2025—2026 學年。成績單於 2026 年 10 月 8 日列印，GPA 按成績單所載數值列出。'),
    courseGroups:[
      {id:'product-manufacturing',title:bi('产品与制造','Products & manufacturing','產品與製造'),items:[
        course('design-history','工业设计史','History of Industrial Design',96,'工業設計史'),
        course('smart-product-methods','智能产品设计程序与方法','Intelligent Product Design: Procedures and Methods',94,'智能產品設計程序與方法'),
        course('materials-manufacturing','设计材料与制造技术','Design Materials and Manufacturing Techniques',92,'設計材料與製造技術'),
        course('cmf','CMF设计技术与管理','CMF Design Technology and Management',88,'CMF 設計技術與管理')
      ]},
      {id:'interaction-technology',title:bi('数字交互与技术','Digital interaction & technology','數碼互動與科技'),items:[
        course('python','Python语言程序设计','Python Language Programming',98,'Python 語言程式設計'),
        course('artificial-intelligence','人工智能','Artificial Intelligence',94),
        course('interactive-media','交互数字媒体技术与设计','Interactive Digital Media Technology and Design',93,'互動數碼媒體技術與設計')
      ]},
      {id:'service-expression',title:bi('服务与表达','Service & expression','服務與表達'),items:[
        course('service-innovation','服务设计与创新','Service Design and Innovation',90,'服務設計與創新'),
        course('visual-communication','视觉传达设计','Visual Communication Design',93,'視覺傳達設計'),
        course('heritage-craft','传统手工艺与现代传承','Traditional Handicraft and Modern Inheritance',90,'傳統手工藝與現代傳承')
      ]}
    ]
  },
  capabilities:[
    {id:'product-making',title:bi('产品与制作','Products & making','產品與製作'),
      text:bi('产品造型、曲面与机械建模、材质渲染，以及3D打印、后处理和装配实践。','Form development, surface and mechanical modelling, rendering, 3D printing, post-processing and assembly practice.','產品造型、曲面與機械建模、材質渲染，以及 3D 打印、後處理和裝嵌實踐。'),
      tools:['Rhino','KeyShot','SolidWorks','Creo'],projectIds:['lumo','camp']},
    {id:'interaction-experience',title:bi('交互与体验','Interaction & experience','互動與體驗'),
      text:bi('梳理信息架构与界面流程，制作交互原型，围绕操作任务设计反馈。','Information architecture, interface flows, interaction prototypes and task-focused feedback.','梳理資訊架構和介面流程，製作互動原型，並按操作任務設計回饋。'),
      tools:['Figma',bi('信息架构','Information architecture','資訊架構'),bi('界面流程','Interface flows','介面流程'),bi('交互原型','Interaction prototypes','互動原型')],projectIds:['lumo','heritage-platform']},
    {id:'visual-media',title:bi('视觉与媒体','Visual communication & media','視覺傳意與媒體'),
      text:bi('品牌识别、版式、摄影与视频表达，保持物料、界面和空间中的视觉一致性。','Brand identity, layout, photography and video, with visual consistency across materials, interfaces and spaces.','透過品牌識別、版面設計、攝影及影片，維持物料、介面和空間的視覺一致性。'),
      tools:['Photoshop','Illustrator','Lightroom','Procreate','Canva',bi('剪映','Jianying'),bi('秀米','Xiumi')],projectIds:['more']},
    {id:'research-service',title:bi('研究与服务','Research & service design','研究與服務'),
      text:bi('通过访谈与观察界定问题，用用户旅程、服务蓝图和商业模式组织方案。','Interviews, observation, user journeys, service blueprints and business models for framing problems and developing proposals.','透過訪談和觀察界定問題，運用用戶旅程、服務藍圖及商業模式整理方案。'),
      tools:[bi('用户访谈','User interviews','用戶訪談'),bi('场地观察','Field observation','實地觀察'),bi('用户旅程','User journeys','用戶旅程'),bi('服务蓝图','Service blueprints','服務藍圖'),bi('商业模式画布','Business Model Canvas','商業模式畫布'),bi('项目路演','Pitch presentations','項目簡報')],projectIds:['more','camp','dongjiang-rural']},
    {id:'technical-exploration',title:bi('技术探索','Technical exploration','技術探索'),
      text:bi('用Python和计算机视觉制作感知与反馈原型，继续学习Processing的交互表达。','Coursework and prototypes with Python and computer vision; continued exploration of interaction with Processing.','運用 Python 和電腦視覺製作感知與回饋原型，並繼續以 Processing 探索互動表達。'),
      tools:['Python','Processing',bi('计算机视觉原型','Computer-vision prototypes','電腦視覺原型')],projectIds:['lumo']}
  ],
  practice:[
    {id:'rural-talent',date:bi('2026.05 — 至今','May 2026 — Present'),startDate:'2026-05',
      title:bi('东江源创 / 引智入乡','Dongjiang Co-Creation / Rural Talent','東江源創 / 引智入鄉'),role:bi('项目负责人','Project lead','項目負責人'),
      text:bi('组织河源东源数字游民项目的调研、服务设计与方案表达，连接旅居、社群、空间和地方产业任务；后续继续研究柔性数字人才服务。','Lead research, service design and proposal development for digital-nomad services in Dongyuan, Heyuan, connecting stays, community, space and local industry tasks. Continue research into flexible digital-talent services.','統籌河源東源數碼遊民項目的調研、服務設計和方案表達，連繫旅居、社群、空間與地方產業任務，並繼續研究彈性數碼人才服務。'),
      learning:bi('',''),
      projectIds:['dongjiang-rural'],image:{src:'journey-v1/rural-team.webp',alt:bi('东江源创团队的真实项目合影','The Dongjiang Co-Creation project team','東江源創項目團隊合照'),width:2200,height:1467}},
    {id:'alibaba',date:bi('2026.04.17 — 2026.05.17','17 Apr — 17 May 2026'),startDate:'2026-04-17',endDate:'2026-05-17',
      title:bi('阿里国际数字科技','Alibaba International Digital Technology','阿里國際數字科技'),role:bi('AIGC实训实习生 · 展示与物料设计','AIGC training intern · Display and material design','AIGC 實訓實習生 · 展示與物料設計'),
      text:bi('参与AITIC新质人才孵化计划，交付品牌物料、资产标识方案、展示区空间预览与位置示意。','Joined the AITIC talent-incubation training programme, producing brand materials, asset-label concepts, spatial previews and placement diagrams for a display area.','參與 AITIC 新質人才孵化計劃，完成品牌物料、資產標識方案、展示區空間預覽及位置示意圖。'),
      learning:bi('',''),
      projectIds:[],image:{src:'journey-v1/alibaba-office.webp',alt:bi('阿里AIGC实训相关的真实办公场景','The workplace associated with the Alibaba AIGC training','阿里 AIGC 實訓的辦公環境'),width:1920,height:1440}},
    {id:'guanxiang-community',date:bi('2025.08','Aug 2025'),startDate:'2025-08',endDate:'2025-08',
      title:bi('莞香文化社区','Guanxiang Cultural Community','莞香文化社區'),role:bi('社区文化事务实习生','Community cultural affairs intern','社區文化事務實習生'),
      text:bi('参与莞香文化走访与资料整理，协助线下宣传、活动布置和社区项目协调，并将观察带回后续非遗数字化设计。','Joined Guanxiang field visits and documentation, supported communication, event preparation and community coordination, and brought these observations into later digital-heritage design.','參與莞香文化實地走訪及資料整理，協助現場宣傳、活動佈置和社區項目協調，並把觀察所得應用於後續的非遺數碼化設計。'),
      learning:bi('',''),
      projectIds:['digital-heritage']},
    {id:'digital-heritage',date:bi('2025.05 — 至今','May 2025 — Present'),startDate:'2025-05',
      title:bi('莞脉守护者计划 · 非遗数字化研究','Guanmai Guardians · Digital Heritage Research','莞脈守護者計劃 · 非遺數碼化研究'),role:bi('项目负责人 · 界面与交互设计','Project lead · Interface and interaction design','項目負責人 · 介面與互動設計'),
      text:bi('协调跨学科团队，连接非遗研究、界面流程与开发任务，形成已上线的H5平台、莞香游戏和舞草龙游戏。','Coordinate an interdisciplinary team across heritage research, interface flows and development, producing a live H5 platform and the Guanxiang and Grass Dragon games.','協調跨學科團隊，串連非遺研究、介面流程和開發工作，推出已上線的 H5 平台、莞香遊戲及舞草龍遊戲。'),
      learning:bi('',''),
      projectIds:['digital-heritage','heritage-platform'],image:{src:'journey-v1/heritage-meeting-1.webp',alt:bi('非遗数字化项目的真实团队讨论','A team discussion for the digital-heritage project','非遺數碼化項目的團隊討論'),width:2200,height:1650}},
    {id:'more-coffee',date:bi('2024.09 — 2026.09','Sep 2024 — Sep 2026'),startDate:'2024-09',endDate:'2026-09',
      title:bi('More Coffee · 不止咖啡','More Coffee','More Coffee · 不止咖啡'),role:bi('核心合伙人 · 品牌设计与运营','Core partner · Brand design and operations','核心合夥人 · 品牌設計與營運'),
      text:bi('参与校园咖啡品牌的运营、品牌物料、内容传播、空间触点和活动组织，将点单、制作与日常交流中的反馈带回设计。','Contributed to café operations, identity and applied materials, communication, spatial touchpoints and activities, using feedback from ordering, making drinks and everyday conversations to inform design.','參與校園咖啡品牌的營運、品牌物料製作、內容傳播、空間接觸點設計和活動統籌，把落單、製作和日常交流所得的回饋帶回設計。'),
      learning:bi('',''),
      projectIds:['more'],image:{src:'more-community.webp',alt:bi('More Coffee的真实空间','The real More Coffee space','More Coffee 的實際空間'),width:1800,height:1200}}
  ],
  campus:[
    {id:'association',date:bi('2025.09 — 至今','Sep 2025 — Present'),startDate:'2025-09',
      title:bi('设计创新协会','Design Innovation Association','設計創新協會'),role:bi('副会长','Vice president','副會長'),
      text:bi('统筹协会日常事务、预算与资源，组织设计沙龙、竞赛培训及实践交流；2023.09—2025.09曾任部门负责人。','Coordinate activities, budgets and resources for design salons, competition training and practice exchanges. Previously a department lead from September 2023 to September 2025.','統籌協會日常事務、預算和資源，籌辦設計交流會、比賽培訓及實踐交流。2023.09 至 2025.09 曾任部門負責人。'),
      learning:bi('',''),projectIds:[]},
    {id:'assistant-adviser',date:bi('2025.09 — 2026.08','Sep 2025 — Aug 2026'),startDate:'2025-09',endDate:'2026-08',
      title:bi('新生支持','First-year student support','新生支援'),role:bi('2025级工业设计班助理班主任','Assistant class adviser · 2025 Industrial Design cohort','2025 級工業設計班助理班主任'),
      text:bi('协助新生适应大学生活，参与日常事务、班委会组建、学生骨干培养与班级协调。','Supported new students settling into university, everyday matters, class-committee formation, student-leader development and class coordination.','協助新生適應大學生活，參與日常事務、籌組班委會、培育學生骨幹及班級協調。'),
      learning:bi('',''),projectIds:[]},
    {id:'entrepreneurship-class',date:bi('2025.04 — 至今','Apr 2025 — Present'),startDate:'2025-04',
      title:bi('创业精英班','Entrepreneurship programme','創業精英班'),role:bi('成员','Member','成員'),
      text:bi('参与项目孵化、商业计划书撰写、路演学习与企业走访，练习把成本和执行条件纳入方案。','Take part in venture incubation, business-plan writing, pitch training and company visits, considering cost and delivery conditions within proposals.','參與項目孵化、撰寫商業計劃書、簡報培訓和企業探訪，練習在方案中考慮成本及執行條件。'),
      learning:bi('',''),projectIds:[]},
    {id:'class-management',date:bi('2024.09 — 至今','Sep 2024 — Present'),startDate:'2024-09',
      title:bi('班级管理与学生工作','Class coordination and student support','班級協調與學生支援'),role:bi('班长','Class representative','班長'),
      text:bi('统筹班级日常事务、财务和活动，促进师生沟通；协助学生资助材料整理、通知与手续衔接。','Coordinate class affairs, finances and activities, connect students and staff, and assist with student-aid paperwork, notices and administrative processes.','統籌班級日常事務、財務和活動，促進師生溝通，並協助整理學生資助文件、發放通知及跟進手續。'),
      learning:bi('',''),projectIds:[]},
    {id:'robotics-lab',date:bi('2023.12 — 2025.07','Dec 2023 — Jul 2025'),startDate:'2023-12',endDate:'2025-07',
      title:bi('机器人与智能装备实验室','Robotics and Intelligent Equipment Laboratory','機械人與智能裝備實驗室'),role:bi('宣传委员','Communications coordinator','宣傳委員'),
      text:bi('参与技术成果传播和对外联络，协助组织首届海格电气杯人工智能小车竞赛。','Supported technical communication and external liaison, and helped organise the first Haige Electric Cup AI-car competition.','參與技術成果宣傳和對外聯絡，協助舉辦首屆海格電氣杯人工智能小車競賽。'),
      learning:bi('',''),projectIds:[]},
    {id:'printing-lab',date:bi('2023.12 — 2025.07','Dec 2023 — Jul 2025'),startDate:'2023-12',endDate:'2025-07',
      title:bi('3D打印创新实验室','3D Printing Innovation Laboratory','3D 打印創新實驗室'),role:bi('成员','Member','成員'),
      text:bi('使用SolidWorks与Creo进行零件建模，学习图纸、打印和后处理，在装配调试中检验壁厚、连接、公差与装配顺序。','Used SolidWorks and Creo for part modelling, and learned drawing, printing and post-processing. Assembly practice tested wall thickness, connections, tolerances and assembly order.','使用 SolidWorks 和 Creo 建立零件模型，學習繪圖、打印及後處理，並在裝嵌和調校時檢驗壁厚、連接、公差與裝嵌次序。'),
      learning:bi('',''),projectIds:[]}
  ],
  focus:[
    {id:'intelligent-products',title:bi('智能产品中的交互','Interaction in intelligent products','智能產品的互動設計'),
      text:bi('从Lumo等方案与原型出发，继续探索形态、声音、动作和界面如何共同传达产品状态。','Through proposals and prototypes such as Lumo, explore how form, sound, movement and interfaces communicate product states.','從 Lumo 等方案及原型出發，繼續探索形態、聲音、動作和介面如何共同傳達產品狀態。')},
    {id:'adaptive-ai',title:bi('AI支持的自适应体验','AI-supported adaptive experiences','AI 支援的自適應體驗'),
      text:bi('探索AI主动帮助、稳定反馈与误判修正之间的平衡，让系统适应需求，也让用户保有控制。','Explore the balance between proactive AI assistance, predictable feedback and correcting mistakes, while keeping people in control.','探索如何平衡 AI 主動協助、穩定回饋及誤判修正，讓系統配合用戶需要，同時保留用戶的控制權。')},
    {id:'cross-device',title:bi('跨设备的连续体验','Continuity across devices','跨裝置的連貫體驗'),
      text:bi('研究手机、电脑、可穿戴设备与实体产品之间的任务延续，以及感知、显示和控制的分工。','Study task continuity across phones, computers, wearables and physical products, and how they share sensing, display and control.','研究任務如何在手機、電腦、穿戴式裝置與實體產品之間延續，以及各裝置如何分擔感知、顯示和控制。')}
  ],
  methods:[
    {id:'situated-observation',title:bi('先走进具体情境','Begin in context','先走進實際情境'),
      text:bi('观察咖啡店和社区中的真实使用与参与，再界定问题。','Observe how people use and participate in cafés and communities before framing the problem.','先觀察人們如何使用咖啡店和社區空間、參與其中，再界定問題。')},
    {id:'connected-systems',title:bi('把触点放回系统','Connect the touchpoints','把接觸點放回服務系統'),
      text:bi('用用户旅程和服务蓝图，把前台体验与后台协作连接起来。','Connect the user experience with delivery and coordination through journeys and service blueprints.','用用戶旅程和服務藍圖，串連前台體驗與後台協作。')},
    {id:'learn-through-making',title:bi('用制作继续提问','Learn through making','透過製作繼續探索'),
      text:bi('通过图纸、模型和可运行原型检验想法，让反馈修正判断。','Test ideas through drawings, models and runnable prototypes, using feedback to refine decisions.','透過圖紙、模型和可運行的原型檢驗構思，再按回饋調整判斷。')}
  ],
  languages:[
    {id:'mandarin',title:bi('普通话','Mandarin','普通話'),detail:bi('普通话水平测试二级甲等','Putonghua Proficiency Test · Level 2-A','普通話水平測試二級甲等')},
    {id:'cantonese',title:bi('粤语','Cantonese','粵語'),detail:bi('流利交流','Fluent','流利')},
    {id:'english',title:bi('英语','English','英語'),detail:bi('雅思 IELTS 6.0','IELTS 6.0','IELTS 6.0')}
  ],
  life:{
    intro:bi('看展、摄影、音乐剧和运动，也是我观察生活的方式。','Exhibitions, photography, musicals and sport are other ways I observe everyday life.','看展覽、攝影、音樂劇和運動，也是我觀察日常生活的方式。'),
    hobbies:[
      {id:'exhibitions',title:bi('艺术展览','Art exhibitions','藝術展覽'),text:bi('留意材料、议题与表达方式。','Notice materials, ideas and forms of expression.','留意材料、議題和表達方式。')},
      {id:'musicals',title:bi('音乐剧','Musicals','音樂劇'),text:bi('喜欢叙事、音乐与舞台构成的现场。','Enjoy the live interplay of story, music and stage.','喜歡故事、音樂和舞台交織而成的現場體驗。')},
      {id:'photography',title:bi('摄影','Photography','攝影'),text:bi('记录日常的场景、光线与构图。','Record everyday scenes, light and composition.','記錄日常場景、光線和構圖。')},
      {id:'singing',title:bi('唱歌','Singing','唱歌'),text:bi('喜欢唱歌，也参与过歌手协会宣传与演出后台协作。','Enjoy singing, with experience in student music communications and backstage support.','喜歡唱歌，也曾參與歌手協會的宣傳和演出後台工作。')},
      {id:'badminton',title:bi('羽毛球','Badminton','羽毛球'),text:bi('通过运动放松，切换学习与设计的节奏。','Unwind through sport alongside study and design.','用運動放鬆，調節學習和設計的節奏。')}
    ],
    learning:bi('初中读到乔布斯传记后，我开始留意技术如何进入日常。看毕业展、企业走访和2025年华为开发者大会延续了这份兴趣；迎新、赛事协助、阅读沙龙和社区志愿服务，让我在具体事务中练习沟通。','A biography of Steve Jobs first drew my attention to technology in everyday life in secondary school. Graduation exhibitions, company visits and the 2025 Huawei Developer Conference continued that interest; student welcome activities, event support, reading salons and community volunteering provided practice in communication.','初中讀到喬布斯傳記後，我開始留意科技如何融入日常。參觀畢業展、探訪企業和出席 2025 年華為開發者大會，延續了這份興趣。迎新、賽事協助、閱讀交流會及社區義工服務，讓我在實際工作中練習溝通。')
  },
  recognitionIds:['ncda-more-national-2026','challenge-cup-dongjiang-2026','epda-qilin-2026','muse-starecho-2026'],
  contact:{
    title:bi('设计、学习与合作。','Design, learning and collaboration.','設計、學習與合作。'),
    text:bi('欢迎写信交流。','Get in touch by email.','歡迎電郵交流。'),
    email:'yho2562856193@gmail.com',
    phone:'18922918288',
    phoneCountryCode:'+86',
    wechat:'18922918288',
    resumeLabel:bi('查看网页简历','View my résumé','查看網頁履歷')
  }
};

function localized(value,language){
  if(Array.isArray(value))return value.map(item=>localized(item,language));
  if(value&&typeof value==='object'){
    if('zh'in value&&'en'in value&&'zh-HK'in value)return value[language];
    return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,localized(item,language)]));
  }
  return value;
}
const profileLocales=['zh','en','zh-HK'];
export function aboutFor(language='zh'){
  return localized(record,profileLocales.includes(language)?language:'zh');
}

function searchSections(data){
  return {
    overview:data.overview,
    education:data.education,
    skills:data.capabilities,
    practice:[...data.practice,...data.campus],
    focus:[...data.focus,...data.methods],
    life:data.life,
    contact:[data.contact.title,data.contact.text,data.contact.email,data.contact.resumeLabel,...data.languages]
  };
}
function searchText(value){
  if(Array.isArray(value))return value.map(searchText).join(' ');
  if(value&&typeof value==='object')return Object.values(value).map(searchText).join(' ');
  return String(value??'');
}
export function aboutSearchEntriesFor(language='zh'){
  const data=aboutFor(language),sources=profileLocales.map(locale=>searchSections(aboutFor(locale)));
  const prefix=language==='en'?'About':language==='zh-HK'?'關於我':'关于我';
  const subtitle=language==='en'?'Haocong YE · Personal profile':language==='zh-HK'?'葉昊聰 · 個人資料':'叶昊聪 · 个人档案';
  return data.sections.map(section=>({
    id:section.id,
    title:`${prefix} · ${section.label}`,
    subtitle,
    keywords:searchText(sources.map(source=>source[section.id]))
  }));
}
