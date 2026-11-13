import {projectsFor} from './projects-data.js';
import {experiencesFor} from './experiences-data.js';
import {honorsHK} from './honors-data.js';
import {additionalHonorsFor} from './content-relations.js';

export const profile = {
  name: '葉昊聰', english: 'Haocong YE', email: 'yho2562856193@gmail.com',
  intro: '從工業設計出發，我在產品、互動與服務之間工作，關心人們的日常，以及塑造這些體驗的系統。',
  bio: '我在東莞理工學院修讀工業設計。由咖啡店的點單流程、獨居長者的日常陪伴，到輕便的城市露營體驗，我從具體場景中觀察與提問，再將所得轉化成可以親身體驗的設計。'
};
export const projects=projectsFor('zh-HK');
export const experiences=experiencesFor('zh-HK');
export const honors=[...honorsHK,...additionalHonorsFor('zh-HK')].sort((a,b)=>b.date.localeCompare(a.date));
