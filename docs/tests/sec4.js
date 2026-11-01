const {JSDOM}=require('jsdom');
const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail=1};
const mk=pre=>new JSDOM(html,{runScripts:'dangerously',url:'http://localhost/',beforeParse(w){if(pre)w.localStorage.setItem('gearcheck.edits.v1',JSON.stringify(pre))}}).window;
let w=mk();
const secs=()=>[...w.document.querySelectorAll('#list>.sec')];
const names=()=>secs().map(s=>s.querySelector('.hd').textContent.replace(/[▾✓]|\d+ of \d+/g,'').trim());
const pe=(type,x,y)=>{const e=new w.Event(type,{bubbles:true,cancelable:true});e.clientX=x;e.clientY=y;e.pointerId=1;return e};
ok(names().join()==='Dive Clothing,Dive Equipment,Other Equipment,Kayak','default order');
// drag Kayak (idx 3) before Dive Clothing
const sg=secs()[3].querySelector('.sdg');
const tgt=secs()[0];
tgt.getBoundingClientRect=()=>({top:0,height:100,left:0,width:400,bottom:100,right:400});
w.document.elementFromPoint=()=>tgt;
sg.dispatchEvent(pe('pointerdown',10,10));
ok(!!w.document.querySelector('.ghost')&&w.document.getElementById('list').classList.contains('reorder')&&secs()[3].classList.contains('lifted'),'ghost, compact mode, lifted');
sg.dispatchEvent(pe('pointermove',20,20));
ok(tgt.classList.contains('before'),'drop-before indicator');
sg.dispatchEvent(pe('pointermove',20,80));
ok(tgt.classList.contains('after')&&!tgt.classList.contains('before'),'drop-after indicator below midpoint');
sg.dispatchEvent(pe('pointermove',20,20));
sg.dispatchEvent(pe('pointerup',20,20));
ok(names().join()==='Kayak,Dive Clothing,Dive Equipment,Other Equipment','Kayak moved to top');
ok(!w.document.querySelector('.ghost')&&!w.document.getElementById('list').classList.contains('reorder'),'cleanup');
// items follow section order
ok(w.eval('ITEMS[0].sec')==='s3','items sorted by new section order');
// persistence
const saved=JSON.parse(w.localStorage.getItem('gearcheck.edits.v1'));
ok(saved.order.join()==='s3,s0,s1,s2','order saved');
w=mk(saved);
ok(names().join()==='Kayak,Dive Clothing,Dive Equipment,Other Equipment','order restored on reload');
// drop after last
const sg2=secs()[0].querySelector('.sdg');const last=secs()[3];
last.getBoundingClientRect=()=>({top:0,height:100});w.document.elementFromPoint=()=>last;
sg2.dispatchEvent(pe('pointerdown',1,1));sg2.dispatchEvent(pe('pointermove',5,90));sg2.dispatchEvent(pe('pointerup',5,90));
ok(names().join()==='Dive Clothing,Dive Equipment,Other Equipment,Kayak','dropped after last');
// new custom section appears at end, and can be moved
w.eval(`addSection('Trip');draw()`);
ok(names().pop()==='Trip','new section at end');
// cancel
const sg3=secs()[1].querySelector('.sdg');sg3.dispatchEvent(pe('pointerdown',1,1));sg3.dispatchEvent(pe('pointercancel',1,1));
ok(names().length===5&&!w.document.querySelector('.ghost'),'cancel leaves order');
// item drag into a moved/reordered section still works
const secId=w.eval('SECS[0].id');w.eval(`moveItem('d3:Oar','${secId}')`);
ok(w.eval(`ITEMS.find(i=>i.id==='d3:Oar').sec`)===secId,'item move still works after reorder');
process.exit(fail);
