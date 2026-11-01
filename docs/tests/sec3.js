const {JSDOM}=require('jsdom');
const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail=1};
const mk=pre=>new JSDOM(html,{runScripts:'dangerously',url:'http://localhost/',beforeParse(w){if(pre)w.localStorage.setItem('gearcheck.edits.v1',JSON.stringify(pre))}}).window;
let w=mk();
const D=()=>w.document;
const secs=()=>[...D().querySelectorAll('.sec')];
const say=(t,k)=>w.eval(`matchText(${JSON.stringify(t)},${k})`);
const nm=h=>h.map(i=>w.eval(`ITEMS[${i}].n+'@'+ITEMS[${i}].sec`));
const rows=si=>[...secs()[si].querySelectorAll('li')].filter(li=>li.querySelector('.chk'));
const sub=(f)=>f.dispatchEvent(new w.Event('submit',{cancelable:true}));
const typeIn=(inp,v)=>{inp.value=v;inp.dispatchEvent(new w.Event('input'))};
// voice misrecognitions
for(const [t,exp] of [['boy','Buoy'],['buoy','Buoy'],['or','Oar'],['ore','Oar'],['oar','Oar'],['or leashes','Oar Leashes'],['oar leashes','Oar Leashes'],['our leashes','Oar Leashes']]){
 w=mk();ok(nm(say(t)).map(s=>s.split('@')[0]).join()===exp,`"${t}" -> ${exp}`);
}
w=mk();
let h=nm(say('dry bag',0));ok(h.join()==='Dry Bag@s2','dry bag #1 -> Other Equipment');
ok(say('dry bag',0).length===0,'same result repeated/interim: no extra');
ok(say('drive bag',0).length===0,'alternative of same result: no extra');
h=nm(say('dry bag',1));ok(h.join()==='Dry Bag@s3','dry bag #2 (new result) -> Kayak');
w=mk();ok(nm(say('kayak dry bag')).join()==='Dry Bag@s3','kayak dry bag explicit');
w=mk();ok(nm(say('dry bag dry bag')).length===2,'said twice in one result checks both');
w=mk();
// rename
rows(0)[0].querySelector('.ed').click();
let inp=secs()[0].querySelector('.addf input');
ok(inp&&inp.value==='Top','edit form prefilled');
typeIn(inp,'Hood');sub(secs()[0].querySelector('.addf'));
ok(rows(0)[0].querySelector('.nm').textContent==='Hood','renamed shown');
ok(nm(say('hood')).join()==='Hood@s0','renamed voice-matches');
ok(say('top').length===0,'old name no longer matches');
// rename with note
rows(2)[0]; w.eval('1');
let wi=rows(2).findIndex(li=>li.textContent.includes('Dive Watch'));
rows(2)[wi].querySelector('.ed').click();inp=secs()[2].querySelector('.addf input');
ok(inp.value==='Dive Watch (Charger?)','label with note prefilled');
typeIn(inp,'Dive Watch (Charged)');sub(secs()[2].querySelector('.addf'));
ok(rows(2)[wi].querySelector('.note').textContent==='(Charged)','note edited');
// rename dup rejected
rows(0)[1].querySelector('.ed').click();inp=secs()[0].querySelector('.addf input');
typeIn(inp,'hood');sub(secs()[0].querySelector('.addf'));
ok(!!secs()[0].querySelector('.addf')&&w.eval('edits.renamed["d0:Bottom"]')===undefined,'duplicate rename rejected');
secs()[0].querySelector('.cx').click();
// rename back to original removes override
rows(0)[0].querySelector('.ed').click();inp=secs()[0].querySelector('.addf input');
typeIn(inp,'Top');sub(secs()[0].querySelector('.addf'));
ok(Object.keys(w.eval('edits.renamed')).join()==='d2:Dive Watch','rename back clears override');
// new section
D().querySelector('#newsec .addb').click();
inp=D().querySelector('#newsec input');typeIn(inp,'Spearfishing Trip');sub(D().querySelector('#newsec form'));
ok(secs().length===5&&secs()[4].querySelector('.hd').textContent.includes('Spearfishing Trip'),'new section created');
ok(secs()[4].querySelector('.ct').textContent==='0 of 0'&&!secs()[4].classList.contains('complete'),'empty section not complete');
// add item in new section
secs()[4].querySelector('.addb').click();inp=secs()[4].querySelector('.addf input');typeIn(inp,'Permit');sub(secs()[4].querySelector('.addf'));
ok(rows(4).length===1&&nm(say('permit')).join()==='Permit@'+w.eval('SECS[4].id'),'item in new section voice-matches');
// drag existing item to new section
w.document.elementFromPoint=()=>secs()[4];
const li=rows(1).find(l=>l.textContent.includes('Dive Flag'));
const dg=li.querySelector('.dg');
const pe=(type,x,y)=>{const e=new w.Event(type,{bubbles:true,cancelable:true});e.clientX=x;e.clientY=y;e.pointerId=1;return e};
dg.dispatchEvent(pe('pointerdown',10,10));
ok(!!D().querySelector('.ghost')&&li.classList.contains('lifted'),'ghost + lifted during drag');
dg.dispatchEvent(pe('pointermove',50,300));
ok(secs()[4].classList.contains('drop'),'target highlighted');
dg.dispatchEvent(pe('pointerup',50,300));
ok(!D().querySelector('.ghost')&&rows(4).some(l=>l.textContent.includes('Dive Flag'))&&!rows(1).some(l=>l.textContent.includes('Dive Flag')),'Dive Flag moved to new section');
ok(w.eval('edits.moved["d1:Dive Flag"]')===w.eval('SECS[4].id'),'move recorded');
ok(nm(say('flag')).join()==='Dive Flag@'+w.eval('SECS[4].id'),'moved item still voice-matches');
// drag cancel
const li2=rows(1)[0];li2.querySelector('.dg').dispatchEvent(pe('pointerdown',1,1));
li2.querySelector('.dg').dispatchEvent(pe('pointercancel',1,1));
ok(!D().querySelector('.ghost'),'cancel cleans up');
// draw deferred during drag
const li3=rows(1)[0];li3.querySelector('.dg').dispatchEvent(pe('pointerdown',1,1));
w.eval('draw()');ok(!!D().querySelector('.ghost'),'draw deferred mid-drag');
li3.querySelector('.dg').dispatchEvent(pe('pointerup',1,1));
// move back to original removes override
const sec4=w.eval('SECS[4].id');
w.eval(`moveItem('d1:Dive Flag','s1')`);
ok(w.eval('edits.moved["d1:Dive Flag"]')===undefined,'moving home clears override');
// persistence via reload
w.eval(`moveItem('d1:Dive Flag','${sec4}');`);
const saved=JSON.parse(w.localStorage.getItem('gearcheck.edits.v1'));
const w2=mk(saved);w=w2;
ok(secs().length===5&&rows(4).some(l=>l.textContent.includes('Dive Flag'))&&rows(4).some(l=>l.textContent.includes('Permit')),'reload restores sections, moved + custom items');
ok(rows(2).some(l=>l.querySelector('.note')&&l.querySelector('.note').textContent==='(Charged)'),'reload restores renames');
// completion in new section
w.eval(`ITEMS.filter(i=>i.sec==='${sec4}').forEach(i=>setDone(ITEMS.indexOf(i),true));draw()`);
ok(secs()[4].classList.contains('complete')&&secs()[4].classList.contains('closed'),'new section completes green + closes');
// delete custom section (confirm stubbed)
secs()[4].querySelector('.secdel').click();
D().querySelector('.mb.danger').click();
ok(secs().length===4&&!D().querySelector('.modal'),'delete section + items closes modal');
ok(w.eval('edits.added.length')===0,'custom items in deleted section removed');
// legacy numeric sec migration
w=mk({removed:[],added:[{id:'c1',n:'Hood',sec:0}]});
ok(rows(0).some(l=>l.textContent.includes('Hood')),'legacy numeric section ids migrate');
process.exit(fail);
