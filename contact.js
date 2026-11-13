import {getLanguage} from './i18n.js';
import {aboutFor} from './about-data.js';
import {icons} from './icons.js';

const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const portrait='assets/portrait-card-v3.webp';
const external=icons['external-link']||'<span aria-hidden="true">↗</span>';

export function contactMarkup({profile={},language=getLanguage()}={}){
  const en=language==='en',hk=language==='zh-HK';
  const copy=(zh,english,traditional)=>en?english:hk?traditional:zh;
  const data=aboutFor(language);
  const name=profile.name||copy('叶昊聪','Haocong YE','葉昊聰'),email=profile.email||data.contact.email;
  const education=data.education,location=data.overview.facts.find(item=>item.id==='location')?.value||copy('中国 · 东莞','Dongguan, China','中國 · 東莞');
  const subject=encodeURIComponent(copy('联系叶昊聪｜yhodesign','Contact Haocong YE | yhodesign','聯絡葉昊聰｜yhodesign'));
  const gmailCompose=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}`;
  const {phone='',phoneCountryCode='',wechat=''}=data.contact;
  const biography=data.overview.paragraphs[1]||data.overview.paragraphs[0]||'';
  return `<section class="contact-profile-page shell" aria-labelledby="contact-title">
    <header class="contact-profile-opening"><h1 id="contact-title">${copy('联系我','Contact me','聯絡我')}</h1><p>${escape(data.contact.title)}</p></header>
    <section class="contact-mail-surface" aria-labelledby="contact-email-title">
      <div class="contact-mail-address"><h2 id="contact-email-title">${copy('电子邮箱','Email','電郵')}</h2><a href="mailto:${escape(email)}" class="contact-profile-email">${escape(email)}</a></div>
      <div class="contact-profile-actions"><a class="button" href="${escape(gmailCompose)}" target="_blank" rel="noopener noreferrer">${icons.mail||''}${copy('写邮件','Write an email','撰寫電郵')}</a><button type="button" class="button secondary" data-copy-email>${copy('复制邮箱','Copy email','複製電郵地址')}</button></div>
    </section>
    <div class="contact-direct-channels">
      ${phone?`<article class="contact-channel-card" aria-labelledby="contact-phone-title"><div><h2 id="contact-phone-title">${copy('电话','Phone','電話')}</h2><p class="contact-channel-value">${phoneCountryCode?`<span class="contact-country-code">${escape(phoneCountryCode)}</span>`:''}<span>${escape(phone)}</span></p></div><a class="button secondary" href="tel:${escape(phoneCountryCode+phone)}">${copy('拨打电话','Call','致電')}</a></article>`:''}
      ${wechat?`<article class="contact-channel-card" aria-labelledby="contact-wechat-title"><div><h2 id="contact-wechat-title">${copy('微信','WeChat','微信')}</h2><p class="contact-channel-value">${escape(wechat)}</p></div><button type="button" class="button secondary" data-copy-wechat>${copy('复制微信号','Copy WeChat ID','複製微信帳號')}</button></article>`:''}
    </div>
    <section class="contact-resume-downloads" aria-labelledby="contact-resume-title"><h2 id="contact-resume-title">${copy('简历下载','Download CV','下載履歷')}</h2><div class="contact-resume-grid">
      <a class="contact-resume-card" data-resume-download="zh" href="assets/resume/Haocong-YE-CV-zh.docx" download="CV-Haocong YE-V3-中文版-含照片及主修课程.docx"><span><strong>${copy('中文简历','Chinese CV','簡體中文履歷')}</strong><span>${copy('Chinese','中文','簡體中文')} · DOCX</span></span>${icons.download||'<span aria-hidden="true">↓</span>'}</a>
      <a class="contact-resume-card" data-resume-download="en" href="assets/resume/Haocong-YE-CV-en.docx" download="CV-Haocong YE-V3.docx"><span><strong>${copy('英文简历','English CV','英文履歷')}</strong><span>${copy('English','英文','英文')} · DOCX</span></span>${icons.download||'<span aria-hidden="true">↓</span>'}</a>
    </div></section>
    <article class="contact-personal" aria-labelledby="contact-personal-name">
      <figure class="contact-personal-photo"><img src="${portrait}" width="1122" height="1402" alt="${escape(copy('叶昊聪个人肖像','Portrait of Haocong YE','葉昊聰的肖像'))}" fetchpriority="high" decoding="async"></figure>
      <div class="contact-personal-copy"><header><h2 id="contact-personal-name">${escape(name)}</h2>${en?'':`<p class="contact-english-name">${escape(profile.english||'Haocong YE')}</p>`}<p class="contact-design-focus">${escape(data.overview.lead)}</p></header>
        ${biography?`<p class="contact-personal-bio">${escape(biography)}</p>`:''}
        <dl class="contact-personal-facts"><div><dt>${copy('教育背景','Education','教育背景')}</dt><dd>${escape(education.school)}<span>${escape(education.major)}</span></dd></div><div><dt>${copy('学习时间','Study period','修讀時間')}</dt><dd>${escape(education.period)}</dd></div><div><dt>${copy('目前在','Based in','所在地')}</dt><dd>${escape(location)}</dd></div></dl>
        <div class="contact-academic" role="group" aria-label="${copy('学业信息','Academic record','學業資料')}"><div><span>GPA</span><strong>${escape(education.gpa)}</strong></div><div><span>${copy('加权平均分','Weighted average score','加權平均分')}</span><strong>${escape(education.weightedAverage)}</strong></div><a href="#/about/education">${copy('教育与课程','Education & courses','教育與課程')} ${external}</a></div>
      </div>
    </article>
    <div class="contact-background"><section class="contact-language-panel" aria-labelledby="contact-languages-title"><h2 id="contact-languages-title">${copy('语言与沟通','Languages','語言與溝通')}</h2><dl>${data.languages.map(item=>`<div><dt>${escape(item.title)}</dt><dd>${escape(item.detail)}</dd></div>`).join('')}</dl></section>
      <nav class="contact-profile-links" aria-label="${copy('进一步了解','More about me','進一步了解')}"><a href="#/about"><span><strong>${copy('关于我','About me','關於我')}</strong><span>${copy('设计背景与个人经历','Design background and personal experience','設計背景與個人經歷')}</span></span>${external}</a></nav>
    </div>
  </section>`;
}
