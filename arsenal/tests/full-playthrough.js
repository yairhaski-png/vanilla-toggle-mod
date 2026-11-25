// Full playthrough regression test: plays every path node and answers every question type.
// Usage: node arsenal/tests/full-playthrough.js [viewportWidth] [light|dark]
const {chromium}=require('playwright');
const [,,vw,scheme]=process.argv;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:+vw||400,height:820},colorScheme:scheme||'light',reducedMotion:'reduce'});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'..','index.html'));
await p.evaluate(()=>localStorage.setItem('arsenal-v1',JSON.stringify({onboarded:1,hearts:5,gems:999})));await p.reload();await p.waitForTimeout(300);
const N=await p.evaluate(()=>FLAT.length);const stuck=[];let qcount=0;const types={};
async function answer(){
  const st=await p.evaluate(()=>{if(!L)return null;const q=L.qs[L.i];return {s:L.state,t:q&&q.t};});
  if(!st) return 'closed';
  if(st.s==='screens'||st.s==='done'){await p.click('#go');await p.waitForTimeout(80);return 'next';}
  if(st.s==='checked'){await p.click('#go');await p.waitForTimeout(60);return 'next';}
  types[st.t]=(types[st.t]||0)+1;qcount++;
  const t=st.t;
  if(t==='match'){const ids=await p.$$eval('.pairs .c:first-child .opt',e=>e.map(x=>x.dataset.i));for(const i of ids){await p.click(`.pairs .opt[data-s=A][data-i="${i}"]`);await p.click(`.pairs .opt[data-s=B][data-i="${i}"]`);await p.waitForTimeout(340);}}
  else if(t==='build'){const ws=await p.evaluate(()=>{const q=L.qs[L.i].base;return q.a[q.c].split(/\s+/).filter(Boolean)});for(const w of ws){const idx=await p.evaluate(w=>L.tiles.findIndex((x,i)=>x===w&&!L.build.includes(i)),w);await p.click(`#bank .tile[data-t="${idx}"]`);}await p.click('#go');}
  else if(t==='part'){const k=await p.evaluate(()=>L.part);await p.click(`.hot[data-p="${k}"]`,{force:true});await p.click('#go');}
  else if(t==='order'){const n=await p.evaluate(()=>L.qs[L.i].items.length);for(let i=0;i<n;i++)await p.click(`#obank .tile[data-o="${i}"]`);await p.click('#go');}
  else if(t==='story'){let g=0;while(await p.evaluate(()=>!L.storyDone)&&g++<12){await p.click('#go');await p.waitForTimeout(40);}const c=await p.evaluate(()=>L.qs[L.i].c);await p.click(`.opts .opt[data-a="${c}"]`);await p.click('#go');}
  else if(t==='type'){const nm=await p.evaluate(()=>WMAP[L.qs[L.i].w].n);await p.fill('#typeIn',nm);await p.click('#go');}
  else{const v=await p.evaluate(()=>{const q=L.qs[L.i];return L.cur?L.cur.c:q.t==='gap'?q.c:q.t==='mc'?q.c:(q.c?1:0)});await p.click(`.opts .opt[data-a="${v}"]`);await p.click('#go');}
  const ok=await p.evaluate(()=>document.querySelector('#foot').className.includes('ok'));
  if(!ok) stuck.push('WRONG:'+t+':'+await p.evaluate(()=>JSON.stringify(L.qs[L.i]).slice(0,90)));
  await p.click('#go');await p.waitForTimeout(40);return 'next';
}
for(let i=0;i<N;i++){
  const info=await p.evaluate(i=>({open:isOpen(i),t:FLAT[i].n.t,key:FLAT[i].key}),i);
  if(!info.open){stuck.push('LOCKED:'+info.key);break;}
  await p.evaluate(()=>{tab='learn';render();});
  await p.click(`.node[data-i="${i}"]`);await p.waitForTimeout(250);
  if(info.t==='chest'){await p.waitForTimeout(1000);await p.click('#sx');continue;}
  await p.evaluate(()=>document.querySelector('#popGo').click());await p.waitForTimeout(150);
  let guard=0;while(guard++<80){const r=await answer();if(r==='closed')break;}
  if(guard>=80) stuck.push('LOOP:'+info.key);
  await p.evaluate(()=>{S.hearts=5;save();});
}
const end=await p.evaluate(()=>({done:Object.keys(S.done).length,flat:FLAT.length,xp:S.xp,badges:BADGES.filter(earned).length,total:BADGES.length,rank:rankInfo().name}));
for(const t of ['armory','league','quests','badges','shop','me']){await p.evaluate(t=>{tab=t;render();},t);await p.waitForTimeout(150);}
const hs=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
console.log(JSON.stringify({vw,errs,stuck,qcount,types,end,hs}));
await b.close();})();
