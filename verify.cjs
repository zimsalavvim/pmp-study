const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=['content.js','theories.js','questions.js','graphics.js','app.js'].map(f=>fs.readFileSync(`${__dirname}/${f}`,'utf8')).join('\n');
const storage=new Map();let fakeNow='2026-10-20T14:59:00Z';
class TestDate extends Date{constructor(...args){super(...(args.length?args:[fakeNow]));}static now(){return new Date(fakeNow).valueOf();}}
function start(){const elements=new Map();const element=s=>{if(!elements.has(s))elements.set(s,{value:'',innerHTML:'',textContent:'',style:{},listeners:{},classList:{toggle(){},add(){}},addEventListener(n,f){this.listeners[n]=f;},setAttribute(){},focus(){},showModal(){this.open=true;},close(){this.open=false;}});return elements.get(s);};const context=vm.createContext({Date:TestDate,Intl,console,Blob,URL,setTimeout:()=>0,clearTimeout(){},setInterval(){},document:{querySelector:element,querySelectorAll:()=>[],addEventListener(){},activeElement:null},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}});vm.runInContext(source,context);return code=>vm.runInContext(code,context);}
let run=start();
assert.equal(run('lessons.length'),26);assert.equal(run('questionBank.length'),46);
assert.equal(run('new Set(questionBank.map(q=>q.id)).size'),46);
assert(run('questionBank.every(q=>lessons.some(l=>l.id===q.lessonId)&&q.options[q.answer]&&q.why.length>10)'));
assert(run('lessons.every(l=>l.details.length>=2)'));
assert.equal(run("koreaDate(new Date('2026-10-20T14:59:59Z'))"),'2026-10-20');
assert.equal(run("koreaDate(new Date('2026-10-20T15:00:00Z'))"),'2026-10-21');
assert(run("new Set(pickDaily('2026-10-20')).size===5"));
assert(run("pickDaily('2026-10-20').every(id=>!pickDaily('2026-10-21').includes(id))"));
const plan=run('JSON.stringify(state.daily[koreaDate()].ids)');
run('const first=bankById.get(state.daily[koreaDate()].ids[0]);');
assert.equal(run('submitDaily(first.id,(first.answer+1)%first.options.length)'),true);
assert.equal(run('submitDaily(first.id,first.answer)'),false);
assert.equal(run('dailyStats(state.daily[koreaDate()]).answered'),1);
assert.equal(run('dailyStats(state.daily[koreaDate()]).correct'),0);
assert(run('state.review.includes(first.lessonId)'));
run=start();assert.equal(run('JSON.stringify(state.daily[koreaDate()].ids)'),plan);
assert.equal(run('dailyStats(state.daily[koreaDate()]).answered'),1);
run('const session=state.daily[koreaDate()];for(const id of session.ids.slice(1))submitDaily(id,bankById.get(id).answer);');
assert.equal(run('dailyStats(state.daily[koreaDate()]).answered'),5);
assert.equal(run('dailyStats(state.daily[koreaDate()]).correct'),4);
fakeNow='2026-10-20T15:01:00Z';run('checkDay()');
assert.equal(run("$('#practiceDate').value"),'2026-10-21');
assert.equal(run('dailyStats(state.daily[koreaDate()]).answered'),0);
assert.equal(run("dailyStats(state.daily['2026-10-20']).answered"),5);
run("$('#practiceDate').value='2026-10-20';renderDaily()");
assert.equal(run("submitDaily(state.daily['2026-10-20'].ids[0],0)"),false);
run("$('#search').value='PERT';render()");assert(run("$('#cards').innerHTML.includes('data-id=\"pert\"')"));
run("showLesson('herzberg')");assert(run("$('#lessonBody').innerHTML.includes(lessons.find(l=>l.id==='herzberg').details[0][0])"));
run("toggle('done')");assert(run("state.done.includes('herzberg')"));
// Original version records remain readable after adding daily practice.
storage.set('pmp-study-v1',JSON.stringify({done:['value'],review:['evm'],notes:{value:'existing note'},answers:{}}));
run=start();assert(run("state.done.includes('value')&&state.review.includes('evm')&&state.notes.value==='existing note'"));
const html=fs.readFileSync(`${__dirname}/index.html`,'utf8');for(const m of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)){if(!m[1].startsWith('http'))assert(fs.existsSync(`${__dirname}/${m[1]}`));}
assert(!/[—ㅡ]/.test(html));
console.log('PASS: 26 topics, 46 questions, source assets, answer locking, scoring, reload persistence, prior records, KST midnight rollover, history restrictions, review, search, lesson detail and completion.');
