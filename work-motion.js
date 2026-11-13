const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
const easing='cubic-bezier(.22,.75,.26,1)';

function moveIndicator(filters,selected,animate){
  let indicator=filters.querySelector('.work-filter-indicator');
  if(!indicator){
    indicator=document.createElement('span');
    indicator.className='work-filter-indicator';
    indicator.setAttribute('aria-hidden','true');
    filters.prepend(indicator);
  }
  const before=indicator.getBoundingClientRect();
  for(const animation of indicator.getAnimations?.()||[])animation.cancel();
  Object.assign(indicator.style,{
    left:`${selected.offsetLeft}px`,top:`${selected.offsetTop}px`,
    width:`${selected.offsetWidth}px`,height:`${selected.offsetHeight}px`
  });
  filters.classList.add('has-filter-indicator');
  if(!animate||!before.width)return;
  const after=indicator.getBoundingClientRect();
  indicator.animate([
    {transform:`translate(${before.left-after.left}px,${before.top-after.top}px) scale(${before.width/after.width},${before.height/after.height})`},
    {transform:'none'}
  ],{duration:220,easing});
}

export function syncWorkFilter(root){
  const filters=root.querySelector('.work-filters');
  const selected=filters?.querySelector('[aria-pressed="true"]');
  if(selected)moveIndicator(filters,selected,false);
}

export function updateWorkResults(root,html,selected){
  const results=root.querySelector('#work-results');
  const filters=selected.closest('.work-filters');
  const count=root.querySelector('.work-count');
  const template=document.createElement('template');
  template.innerHTML=html;
  const next=template.content.querySelector('#work-results');
  if(!results||!next||!filters)return false;
  if(selected.getAttribute('aria-pressed')==='true')return true;

  const animate=!reduced?.matches&&typeof results.animate==='function';
  const cards=new Map([...results.children].map(card=>[card.dataset.projectId,card]));
  const before=new Map();
  for(const [id,card] of cards){
    if(animate)before.set(id,{rect:card.getBoundingClientRect(),opacity:getComputedStyle(card).opacity});
    for(const animation of card.getAnimations?.()||[]){
      if(animation.id==='work-filter-motion')animation.cancel();
    }
  }
  results.replaceChildren(...[...next.children].map(card=>{
    const retained=cards.get(card.dataset.projectId);
    if(!retained)return card;
    const cover=retained.querySelector('img'),nextCover=card.querySelector('img');
    if(cover&&nextCover){cover.loading=nextCover.loading;cover.fetchPriority=nextCover.fetchPriority;}
    return retained;
  }));
  count.textContent=template.content.querySelector('.work-count').textContent;
  for(const button of filters.querySelectorAll('.work-filter'))button.setAttribute('aria-pressed',String(button===selected));
  moveIndicator(filters,selected,animate);
  if(!animate)return true;

  for(const card of results.children){
    const former=before.get(card.dataset.projectId),rect=card.getBoundingClientRect();
    if(rect.bottom<0||rect.top>innerHeight)continue;
    const prior=former&&former.rect.bottom>0&&former.rect.top<innerHeight?former:null;
    const x=prior?prior.rect.left-rect.left:0,y=prior?prior.rect.top-rect.top:6;
    const opacity=prior?.opacity??.72;
    if(Math.abs(x)+Math.abs(y)<.5&&Number(opacity)===1)continue;
    const animation=card.animate([
      {translate:`${x}px ${y}px`,opacity},
      {translate:'0 0',opacity:1}
    ],{duration:220,easing});
    animation.id='work-filter-motion';
  }
  return true;
}
