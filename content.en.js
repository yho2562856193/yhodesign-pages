import {projectsFor} from './projects-data.js';
import {experiencesFor} from './experiences-data.js';
import {honors as originalHonors,honorsEn} from './honors-data.js';
import {additionalHonorsFor} from './content-relations.js';
export const profile = {
  name: 'Haocong YE', english: 'Haocong YE', email: 'yho2562856193@gmail.com',
  intro: 'Starting with industrial design, I connect products, interactions and services. I care about people in everyday life—and the systems that shape their experiences.',
  bio: 'I am an industrial design student at Dongguan University of Technology. From ordering a cup of coffee to supporting an older person living alone or planning a light urban camping trip, I enjoy getting close to everyday life: observing, asking questions and turning what I learn into tangible design.'
};
export const projects=projectsFor('en');
export const experiences=experiencesFor('en');
export const honors=[...honorsEn,...additionalHonorsFor('en')].sort((a,b)=>b.date.localeCompare(a.date));
