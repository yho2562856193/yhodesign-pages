// Shared, language-independent identities for navigation, filtering and media.
export function parseContentRoute(hash=''){
  const parts=String(hash).replace(/^#\/?/,'').split('/').map(part=>{try{return decodeURIComponent(part);}catch{return '';}});
  return {route:parts[0]||'home',id:parts[1]||null,section:parts[2]||null};
}
export function targetHref(target){
  if(target.kind==='project')return `#/project/${encodeURIComponent(target.id)}${target.section?`/${encodeURIComponent(target.section)}`:''}`;
  if(target.kind==='experience')return `#/journey/${encodeURIComponent(target.id)}`;
  return '#/work';
}
export function selectWorkProjects(projects,category='all'){
  return category==='all'?projects.filter(p=>!p.parentId):projects.filter(p=>p.kind!=='collection'&&p.categoryId===category);
}
export function projectGallery(project){
  if(Array.isArray(project.gallery))return project.gallery;
  return Array.from({length:project.pages||0},(_,i)=>({src:`${project.id}-${String(i+1).padStart(2,'0')}.webp`,caption:`${project.title} · ${i+1}`}));
}
export function pairedById(current,other){const index=new Map(other.map(item=>[item.id,item]));return current.map(item=>[item,index.get(item.id)]);}
