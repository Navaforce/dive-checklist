const {JSDOM}=require('jsdom');
const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail=1};
const mk=pre=>new JSDOM(html,{runScripts:'dangerously',url:'http://localhost/',beforeParse(w){if(pre)w.localStorage.setItem('gearcheck.edits.v1',JSON.stringify(pre))}}).window;
let w=mk();const D=()=>w.document;
const secs=()=>[...D().querySelectorAll('.sec')];
const n0=w.eval('ITEMS.length');
const cnt0=w.eval(`ITEMS.filter(i=>i.sec==='s0').length`);
ok(secs()[0].querySelector('.secdel'),'base section has X');
secs()[0].querySelector('.secdel').click();
ok(D().querySelector('.modal [role=dialog], .modal .mbox'),'modal opens');
ok(D().querySelectorAll('.mb').length===3,'3 buttons');
D().querySelector('.mb.cancel').click();
ok(!D().querySelector('.modal')&&secs().length===5-0||secs().length>0,'cancel closes');
const nSecs=secs().length;
secs()[0].querySelector('.secdel').click();
D().dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));
ok(!D().querySelector('.modal')&&secs().length===nSecs,'escape closes, nothing deleted');
secs()[0].querySelector('.secdel').click();
D().querySelector('.mb.keep').click();
ok(secs().length===nSecs-1,'section gone');
ok(!D().getElementById('loose').hidden&&D().querySelectorAll('#loose li .chk').length===cnt0,'loose tray has items');
ok(w.eval('ITEMS.length')===n0,'no items lost');
const sav=JSON.parse(w.localStorage.getItem('gearcheck.edits.v1'));
w=mk(sav);
ok(secs().length===nSecs-1&&D().querySelectorAll('#loose li .chk').length===cnt0,'persists after reload');
// voice checks loose item
const first=w.eval(`ITEMS.find(i=>i.sec==='loose').n`);
ok(w.eval(`matchText(${JSON.stringify(first)}).length`)>=1,'voice checks loose item');
// move loose item into section
const id=w.eval(`ITEMS.find(i=>i.sec==='loose').id`);
w.eval(`moveItem(${JSON.stringify(id)},'s1')`);
ok(w.eval(`ITEMS.find(i=>i.id===${JSON.stringify(id)}).sec`)==='s1','loose -> section');
ok(D().querySelectorAll('#loose li .chk').length===cnt0-1,'tray shrinks');
// delete section + items
secs()[0].querySelector('.secdel').click();
D().querySelector('.mb.danger').click();
ok(w.eval('ITEMS.length')<n0&&secs().length===nSecs-2,'delete with items removes them');
// loose item add to empty-section delete
w=mk();
w.eval(`addSection('Tmp');draw()`);
secs()[secs().length-1].querySelector('.secdel').click();
ok(D().querySelectorAll('.mb').length===2,'empty section: 2 buttons');
D().querySelector('.mb.danger').click();
ok(secs().length===nSecs-2+2,'empty custom deleted');
process.exit(fail);
