const {JSDOM}=require('jsdom');
const html=require('fs').readFileSync(process.argv[2],'utf8');
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail=1};
const w=new JSDOM(html,{runScripts:'dangerously',url:'http://localhost/'}).window;
for(const t of ['what am I missing','what\'s missing','what is left','what do I still need','what am I forgetting','what else do I need'])
 ok(w.eval(`ASK.test(norm(${JSON.stringify(t)}))`),'ask: '+t);
for(const t of ['dry bag','oar','mesh bag'])ok(!w.eval(`ASK.test(norm(${JSON.stringify(t)}))`),'not ask: '+t);
ok(/You are missing 64 items\. /.test(w.eval('missingText()')),'all missing');
w.eval(`matchText('buoy')`);
const m=w.eval('missingText()');ok(/missing 63 items/.test(m)&&!/[ ]Buoy[,.]/.test(m),'buoy excluded');
w.eval('ITEMS.forEach(i=>done.add(i.id))');ok(/all set/.test(w.eval('missingText()')),'all set');
w.eval('done.clear()');
let spoken=null;w.SpeechSynthesisUtterance=function(t){this.text=t};w.speechSynthesis={cancel(){},resume(){},speak(u){spoken=u}};
w.eval('want=true;speakMissing()');
setTimeout(()=>{ok(spoken&&spoken.text.startsWith('You are missing'),'speaks');ok(w.eval('muted'),'muted while speaking');spoken.onend();
setTimeout(()=>{ok(!w.eval('muted'),'unmuted after');process.exit(fail)},700)},600);
