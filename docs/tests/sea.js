const {JSDOM}=require('jsdom');
const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');
const calls={};
const ctx=new Proxy({}, {get:(t,k)=>{ if(k in t) return t[k]; return (...a)=>{calls[k]=(calls[k]||0)+1}}, set:(t,k,v)=>{t[k]=v;return true}});
let raf=[];let errs=[];
const w=new JSDOM(html,{runScripts:'dangerously',url:'http://localhost/',pretendToBeVisual:true,beforeParse(w){
 w.HTMLCanvasElement.prototype.getContext=()=>ctx;
 w.addEventListener('error',e=>errs.push(e.message));
}}).window;
setTimeout(()=>{
 console.log('errors:',errs.length?errs:'none');
 console.log('ellipse',calls.ellipse>0,'arc',calls.arc>100,'frames(clearRect)',calls.clearRect);
 process.exit(errs.length?1:0);
},1500);
