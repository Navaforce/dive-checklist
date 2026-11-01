const {JSDOM}=require('jsdom');
const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail=1};
const mk=ls=>{const d=new JSDOM(html,{runScripts:'dangerously',url:'http://localhost/'});return d.window};
const w=mk();
const secs=()=>[...w.document.querySelectorAll('.sec')];
const say=t=>w.eval(`matchText(${JSON.stringify(t)})`);
const names=h=>h.map(i=>w.eval(`ITEMS[${i}].n`));
const rows=si=>[...secs()[si].querySelectorAll('li')].filter(li=>li.querySelector('.chk'));
ok(secs().length===4&&w.eval('ITEMS.length')===64,'4 sections, 64 items');
ok(rows(0).length===4,'clothing rows 4');
ok(names(say('belt reel')).join()==='Belt Reel','belt reel only');
ok(names(say('dry bag')).join()==='Dry Bag'&&w.eval('done.has(ITEMS.find(x=>x.n==="Dry Bag"&&x.sec==\'s3\').id)')===false,'dry bag only other');
// remove with X
rows(0)[3].querySelector('.x').click();
ok(rows(0).length===3&&w.eval('ITEMS.length')===63,'X removes Gloves');
ok(!w.document.getElementById('restore'),'no restore button');
// removed item no longer voice-matches
ok(say('gloves').length===0,'removed item not matched');
// completing remaining 3 closes section
say('top bottom booties');
ok(secs()[0].classList.contains('complete')&&secs()[0].classList.contains('closed'),'section completes after removal');
// persistence
const w2=new JSDOM(html,{runScripts:'dangerously',url:'http://localhost/'}).window;
ok(w2.eval('ITEMS.length')===64,'fresh window w/o storage = 64 (separate origin storage)');
w.eval('edits.removed=[];rebuild();draw()');
// add
secs()[0].querySelector('.addb').click();
let inp=secs()[0].querySelector('.addf input');
ok(!!inp,'add form appears');
inp.value='Dive Hood';inp.dispatchEvent(new w.Event('input'));
secs()[0].querySelector('.addf').dispatchEvent(new w.Event('submit',{cancelable:true}));
ok(w.eval('ITEMS.length')===65&&rows(0).some(li=>li.textContent.includes('Dive Hood')),'item added');
ok(names(say('dive hood')).join()==='Dive Hood','new item voice-matches');
// duplicate name rejected
secs()[0].querySelector('.addb')&&secs()[0].querySelector('.addb').click();
inp=secs()[0].querySelector('.addf input');inp.value='top';inp.dispatchEvent(new w.Event('input'));
secs()[0].querySelector('.addf').dispatchEvent(new w.Event('submit',{cancelable:true}));
ok(w.eval('ITEMS.length')===65,'duplicate rejected');
// remove custom is permanent
const hoodIdx=rows(0).findIndex(li=>li.textContent.includes('Dive Hood'));
rows(0)[hoodIdx].querySelector('.x').click();
ok(w.eval('ITEMS.length')===64&&w.eval('edits.added.length')===0&&w.eval('edits.removed.length')===0,'custom removed permanently');
// persistence through reload of same storage
w.eval('edits.removed.push("d0:Top");saveEdits()');
const saved=w.localStorage.getItem('gearcheck.edits.v1');
ok(JSON.parse(saved).removed[0]==='d0:Top','saved to localStorage');
// reset keeps edits
w.document.getElementById('reset').click();
ok(w.eval('edits.removed.length')===1,'reset keeps edits');
process.exit(fail);
