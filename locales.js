export const localeInfo = Object.freeze({
  zh: {label:'简体中文',short:'简',tag:'zh-CN',chooser:'选择语言'},
  'zh-HK': {label:'繁體中文（香港）',short:'繁',tag:'zh-HK',chooser:'選擇語言'},
  en: {label:'English',short:'EN',tag:'en',chooser:'Choose language'}
});

export function normalizeLocale(value){
  const key=String(value??'').toLowerCase();
  if(key==='zh-hk')return 'zh-HK';
  return key==='zh'||key==='en'?key:null;
}

export function resolveLocale(query,saved){
  return normalizeLocale(query)||normalizeLocale(saved)||'zh';
}
