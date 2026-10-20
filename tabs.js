const pageMeta={daily:['일일 연습문제','하루 5문항 및 날짜별 풀이 기록'],learn:['개념 및 이론','프로젝트 관리 이론, 관리 기법 및 적용 사례'],roadmap:['학습 계획','8주 학습 순서 및 주차별 학습 항목'],sources:['참고 자료','공식 시험 안내, 표준 및 이론 참고문헌']};
const pageTabs=Array.from(document.querySelectorAll('.page-tabs [role="tab"]'));
function activatePage(id,{focus=false}={}){
 if(!Object.hasOwn(pageMeta,id))id='daily';
 for(const [page] of Object.entries(pageMeta)){
  const selected=page===id,panel=document.getElementById(page),tab=document.getElementById(`tab-${page}`);
  panel.hidden=!selected;tab.classList.toggle('active',selected);tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;
 }
 document.getElementById('pageTitle').textContent=pageMeta[id][0];
 document.getElementById('pageDescription').textContent=pageMeta[id][1];
 document.title=`${pageMeta[id][0]} | PMP Study`;
 if(focus)document.getElementById(`tab-${id}`).focus();
 window.scrollTo({top:0,behavior:'instant'});
}
function pageFromHash(){return Object.hasOwn(pageMeta,location.hash.slice(1))?location.hash.slice(1):'daily';}
for(const [index,tab] of pageTabs.entries()){
 tab.addEventListener('click',event=>{event.preventDefault();const id=tab.getAttribute('aria-controls');if(location.hash!==`#${id}`)location.hash=`#${id}`;activatePage(id);});
 tab.addEventListener('keydown',event=>{
  const offset={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1};let next;
  if(event.key==='Home')next=0;else if(event.key==='End')next=pageTabs.length-1;else if(Object.hasOwn(offset,event.key))next=(index+offset[event.key]+pageTabs.length)%pageTabs.length;else return;
  event.preventDefault();const id=pageTabs[next].getAttribute('aria-controls');location.hash=`#${id}`;activatePage(id,{focus:true});
 });
}
window.addEventListener('hashchange',()=>activatePage(pageFromHash()));
const mobileTabs=window.matchMedia('(max-width: 760px)');
function setTabOrientation(){document.querySelector('.page-tabs').setAttribute('aria-orientation',mobileTabs.matches?'horizontal':'vertical');}
mobileTabs.addEventListener('change',setTabOrientation);setTabOrientation();activatePage(pageFromHash());
