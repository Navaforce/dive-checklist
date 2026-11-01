const {JSDOM}=require('jsdom');
const fs=require('fs');const html=fs.readFileSync(process.argv[2],'utf8');
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail=1};
const mk=pre=>new JSDOM(html,{runScripts:'dangerously',url:'http://localhost/',beforeParse(w){if(pre)w.localStorage.setItem('gearcheck.edits.v1',JSON.stringify(pre))}}).window;
let w=mk();
const secs=()=>[...w.document.querySelectorAll('#list>.sec')];
const nm=()=>secs().map(s=>(s.querySelector('.hd')||{textContent:'?'}).textContent.replace(/[▾✓]|\d+ of \d+/g,'').trim());
const sub=f=>f.dispatchEvent(new w.Event('submit',{cancelable:true}));
const typeIn=(i,v)=>{i.value=v;i.dispatchEvent(new w.Event('input'))};
secs()[3].querySelector('.secedit').click();
let inp=secs()[3].querySelector('.secrename input');
ok(inp&&inp.value==='Kayak','rename form prefilled');
typeIn(inp,'Kayak & Boat');sub(secs()[3].querySelector('.secrename'));
ok(nm()[3]==='Kayak & Boat','section renamed');
ok(w.eval('edits.secNames.s3')==='Kayak & Boat','override saved');
// dup rejected
secs()[0].querySelector('.secedit').click();inp=secs()[0].querySelector('.secrename input');
typeIn(inp,'dive equipment');sub(secs()[0].querySelector('.secrename'));
ok(!!secs()[0].querySelector('.secrename'),'duplicate name rejected');
secs()[0].querySelector('.cx').click();
ok(nm()[0]==='Dive Clothing','cancel keeps name');
// empty rejected
secs()[0].querySelector('.secedit').click();inp=secs()[0].querySelector('.secrename input');
typeIn(inp,'   ');sub(secs()[0].querySelector('.secrename'));
ok(!!secs()[0].querySelector('.secrename'),'empty rejected');
secs()[0].querySelector('.cx').click();
// rename back clears override
secs()[3].querySelector('.secedit').click();inp=secs()[3].querySelector('.secrename input');
typeIn(inp,'Kayak');sub(secs()[3].querySelector('.secrename'));
ok(w.eval('edits.secNames.s3')===undefined&&nm()[3]==='Kayak','rename back clears override');
// custom section rename + persistence + delete cleans
w.eval(`addSection('Trip');draw()`);
secs()[4].querySelector('.secedit').click();inp=secs()[4].querySelector('.secrename input');
typeIn(inp,'Big Trip');sub(secs()[4].querySelector('.secrename'));
ok(nm()[4]==='Big Trip','custom renamed');
const saved=JSON.parse(w.localStorage.getItem('gearcheck.edits.v1'));
w=mk(saved);ok(nm()[4]==='Big Trip','persists after reload');
secs()[4].querySelector('.secdel').click();w.document.querySelector('.mb.danger').click();
ok(secs().length===4&&Object.keys(w.eval('edits.secNames')).length===0,'delete clears name override');
// rename keeps items and order
w=mk();w.eval(`addSection('X')`);
secs()[0].querySelector('.secedit').click();inp=secs()[0].querySelector('.secrename input');typeIn(inp,'Wetsuit');sub(secs()[0].querySelector('.secrename'));
ok(secs()[0].querySelectorAll('li .chk').length===4,'items intact after rename');
process.exit(fail);
