import {aboutFor} from './about-data.js';

// The canvas card and its accessible HTML fallback read the same verified
// profile. Academic numbers retain their source precision and no GPA scale.
export function badgeProfileFor(language='zh',profile={}){
  const en=language==='en',hk=language==='zh-HK',data=aboutFor(language);
  const zhIdentity=(en?aboutFor('zh'):data).overview.facts.find(item=>item.id==='identity')?.value||'';
  const englishIdentity=aboutFor('en').overview.facts.find(item=>item.id==='identity')?.value||'';
  const chineseName=zhIdentity.split(' · ')[0],englishName=profile.english||englishIdentity;
  const fact=id=>data.overview.facts.find(item=>item.id===id)?.value||'';
  const english=data.languages.find(item=>item.id==='english');
  return {
    name:en?englishName:chineseName,
    secondaryName:en?chineseName:englishName,
    school:data.education.school,
    major:data.education.major,
    period:data.education.period,
    gpa:String(data.education.gpa),
    weightedAverage:String(data.education.weightedAverage),
    ielts:english?.detail.match(/\d+(?:\.\d+)?/)?.[0]||'',
    focus:fact('direction'),
    location:fact('location'),
    email:profile.email||data.contact.email,
    academicLine:data.education.recognition?.badgeLine||'',
    designLabel:hk?'設計':'DESIGN',
    profileLabel:hk?'個人資料':'PROFILE',
    ieltsLabel:en||hk?'IELTS':'雅思 IELTS',
    weightedAverageLabel:en?'Weighted average score':hk?'加權平均分':'加权平均分',
    focusLabel:en?'DESIGN FOCUS':hk?'設計方向':'设计方向'
  };
}
