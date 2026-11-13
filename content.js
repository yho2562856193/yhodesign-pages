import {projectsFor} from './projects-data.js';
import {experiencesFor} from './experiences-data.js';
import {honors as originalHonors,honorsEn} from './honors-data.js';
import {additionalHonorsFor} from './content-relations.js';
export const profile = {
  name: '叶昊聪', english: 'Haocong YE', email: 'yho2562856193@gmail.com',
  intro: '以工业设计为起点，连接产品、交互与服务。关注真实生活中的人，也关注体验背后的系统。',
  bio: '我目前就读于东莞理工学院工业设计专业。从一杯咖啡的点单流程，到独居老人的日常陪伴，再到一次轻量的城市露营，我喜欢走进具体的生活，观察、提问，并把发现转化成可以感知的设计。'
};
export const projects=projectsFor('zh');
export const experiences=experiencesFor('zh');
export const honors=[...originalHonors,...additionalHonorsFor('zh')].sort((a,b)=>b.date.localeCompare(a.date));
