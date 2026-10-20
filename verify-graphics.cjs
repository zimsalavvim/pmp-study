const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({});
vm.runInContext(['content.js','theories.js','graphics.js'].map(f=>fs.readFileSync(`${__dirname}/${f}`,'utf8')).join('\n'),context);
const graphics=vm.runInContext('lessons.map(l=>({id:l.id,html:lessonGraphic(l.id)}))',context);
assert.equal(graphics.length,26);
for(const {id,html} of graphics){assert(html.includes('<svg'),id);assert(html.includes('<title'),id);assert(html.includes('<figcaption>'),id);assert(!html.includes('undefined'),id);assert(!html.includes('NaN'),id);assert(!html.includes('<script'),id);}
const app=fs.readFileSync(`${__dirname}/app.js`,'utf8');assert(app.includes('${lessonGraphic(l.id)}'));
if(process.argv.includes('--json'))console.log(JSON.stringify(graphics));else console.log('PASS: accessible SVG and captions for all 26 concepts, no missing labels, lesson integration.');
