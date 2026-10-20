const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ids=['daily','learn','roadmap','sources'],elements=new Map(),events={},location={hash:'#learn'};
function el(id){if(!elements.has(id))elements.set(id,{hidden:false,tabIndex:0,attrs:{},listeners:{},classList:{toggle(){}},setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];},addEventListener(k,f){this.listeners[k]=f;},focus(){this.focused=true;}});return elements.get(id);}
const tabs=ids.map(id=>{const t=el('tab-'+id);t.attrs['aria-controls']=id;return t;});
const document={title:'',getElementById:el,querySelector:s=>el(s),querySelectorAll:()=>tabs};
const context=vm.createContext({document,location,window:{scrollTo(){},addEventListener:(k,f)=>events[k]=f,matchMedia:()=>({matches:false,addEventListener(){}})}});
vm.runInContext(fs.readFileSync(`${__dirname}/tabs.js`,'utf8'),context);
function selected(id){assert.equal(ids.filter(p=>!el(p).hidden).length,1);assert.equal(el(id).hidden,false);for(const p of ids){assert.equal(el('tab-'+p).attrs['aria-selected'],String(p===id));assert.equal(el('tab-'+p).tabIndex,p===id?0:-1);}}
selected('learn');
tabs[2].listeners.click({preventDefault(){}});selected('roadmap');assert.equal(location.hash,'#roadmap');
location.hash='#daily';events.hashchange();selected('daily');
tabs[0].listeners.keydown({key:'End',preventDefault(){}});selected('sources');assert.equal(el('tab-sources').focused,true);
tabs[3].listeners.keydown({key:'ArrowRight',preventDefault(){}});selected('daily');
tabs[2].listeners.keydown({key:'Home',preventDefault(){}});selected('daily');
location.hash='#unknown';events.hashchange();selected('daily');
const html=fs.readFileSync(`${__dirname}/index.html`,'utf8');for(const id of ids)assert(html.includes(`id="${id}" class="page-panel" role="tabpanel"`));assert(html.includes('pretendardvariable-dynamic-subset.min.css'));assert(!html.includes('class="hero"'));
console.log('PASS: single visible panel, deep link, tab click, history hash, keyboard navigation, invalid route fallback and font reference.');
