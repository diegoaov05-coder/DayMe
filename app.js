// ═══ FIREBASE + SW ═══
firebase.initializeApp({apiKey:"AIzaSyAfMcI-3cIwWz1AlrkmisqNuZvcJ7wUfP4",authDomain:"dayone-14927.firebaseapp.com",databaseURL:"https://dayone-14927-default-rtdb.firebaseio.com",projectId:"dayone-14927",storageBucket:"dayone-14927.firebasestorage.app",messagingSenderId:"775317638738",appId:"1:775317638738:web:46bd112241356da613198b"});
const db=firebase.database(),dataRef=db.ref('routineApp');
let swReg=null;if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').then(r=>{swReg=r}).catch(()=>{});
function ntfy(t,b,g){if(swReg)try{swReg.showNotification(t,{body:b,tag:g||'md',renotify:true,vibrate:[200,100,200],requireInteraction:true})}catch(e){}else if('Notification' in window&&Notification.permission==='granted')try{new Notification(t,{body:b,tag:g||'md'})}catch(e){}}
// BUILD: 2026-02-22T20 v6.5
const LK='routine-sync-v6',DAYS=['sun','mon','tue','wed','thu','fri','sat'],DF={sun:'Sun',mon:'Mon',tue:'Tue',wed:'Wed',thu:'Thu',fri:'Fri',sat:'Sat'},DL={sun:'S',mon:'M',tue:'T',wed:'W',thu:'T',fri:'F',sat:'S'},ALL_DAYS=[...DAYS];
const getDow=()=>DAYS[new Date().getDay()];
const getISO=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const getHM=()=>{const d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const toM=t=>{if(!t)return 0;const p=t.split(':').map(Number);return p[0]*60+p[1]};
const gid=()=>'t'+Date.now()+Math.random().toString(36).slice(2,6);
const sL=d=>{try{localStorage.setItem(LK,JSON.stringify(d))}catch(e){}};
const lL=()=>{try{const s=localStorage.getItem(LK);return s?JSON.parse(s):null}catch(e){return null}};
const autoArc=tasks=>{const td=getISO();return(tasks||[]).map(t=>t.category==='event'&&!t.archived&&toArr(t.eventDates).length>0&&toArr(t.eventDates).every(d=>d<td)?{...t,archived:true}:t)};
function getActTime(tk,dow){if(!tk.timeCondition)return null;const ov=tk.timeCondition.dayOverrides;return(ov&&ov[dow])||tk.timeCondition.time}
function toArr(v){if(!v)return[];if(Array.isArray(v))return v;if(typeof v==='object')return Object.values(v);return[]}
const SEED=[
  {id:'t1',name:'Desayuno',category:'core',project:'',notes:'',timeCondition:{time:'07:20',labelBefore:null,labelAfter:null,labelSwitchTime:null,dayOverrides:{}},dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:0,reminderMin:0,isGoal:false,parentId:null},
  {id:'t2',name:'Almuerzo',category:'core',project:'',notes:'',timeCondition:{time:'12:30',labelBefore:null,labelAfter:null,labelSwitchTime:null,dayOverrides:{}},dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:1,reminderMin:0,isGoal:false,parentId:null},
  {id:'t3',name:'Cena',category:'core',project:'',notes:'',timeCondition:{time:'20:00',labelBefore:null,labelAfter:null,labelSwitchTime:null,dayOverrides:{}},dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:2,reminderMin:0,isGoal:false,parentId:null},
  {id:'t4',name:'PPT Mutún',category:'work',project:'Mutún',notes:'',timeCondition:null,dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:3,reminderMin:0,isGoal:false,parentId:null},
  {id:'t5',name:'TIKR',category:'work',project:'Research',notes:'',timeCondition:null,dependsOn:null,activeDays:['mon','wed','fri'],eventDates:[],archived:false,order:4,reminderMin:0,isGoal:false,parentId:null},
  {id:'t6',name:'Repaso CFA',category:'personal',project:'CFA',notes:'',timeCondition:null,dependsOn:null,activeDays:['mon','tue','wed','thu','fri'],eventDates:[],archived:false,order:5,reminderMin:0,isGoal:true,parentId:null},
  {id:'t7',name:'Cobblemon',category:'personal',project:'Gaming',notes:'',timeCondition:null,dependsOn:null,activeDays:['sat','sun'],eventDates:[],archived:false,order:6,reminderMin:0,isGoal:false,parentId:null},
  {id:'t8',name:'Reunión Mutún',category:'event',project:'Mutún',notes:'Sala 3B',timeCondition:{time:'10:00',labelBefore:null,labelAfter:null,labelSwitchTime:null,dayOverrides:{}},dependsOn:null,activeDays:[],eventDates:[getISO()],archived:false,order:7,reminderMin:30,isGoal:false,parentId:null},
];
const CAT={core:{bg:'rgba(251,191,36,0.12)',border:'#f59e0b',text:'#fbbf24',label:'Core'},event:{bg:'rgba(244,63,94,0.12)',border:'#f43f5e',text:'#fb7185',label:'Event'},work:{bg:'rgba(59,130,246,0.12)',border:'#3b82f6',text:'#60a5fa',label:'Work'},personal:{bg:'rgba(168,85,247,0.12)',border:'#a855f7',text:'#c084fc',label:'Personal'}};
const h=React.createElement;const{useState,useEffect,useCallback,useRef}=React;
function icon(ps,w){w=w||16;return()=>h('svg',{width:w,height:w,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'},...ps.map(p=>typeof p==='string'?h('path',{d:p}):h(p[0],p[1])))}
const IC={Sun:icon([['circle',{cx:12,cy:12,r:5}],['line',{x1:12,y1:1,x2:12,y2:3}],['line',{x1:12,y1:21,x2:12,y2:23}],['line',{x1:4.22,y1:4.22,x2:5.64,y2:5.64}],['line',{x1:18.36,y1:18.36,x2:19.78,y2:19.78}],['line',{x1:1,y1:12,x2:3,y2:12}],['line',{x1:21,y1:12,x2:23,y2:12}],['line',{x1:4.22,y1:19.78,x2:5.64,y2:18.36}],['line',{x1:18.36,y1:5.64,x2:19.78,y2:4.22}]],20),Brief:icon([['rect',{x:2,y:7,width:20,height:14,rx:2}],'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],20),Cal:icon([['rect',{x:3,y:4,width:18,height:18,rx:2}],['line',{x1:16,y1:2,x2:16,y2:6}],['line',{x1:8,y1:2,x2:8,y2:6}],['line',{x1:3,y1:10,x2:21,y2:10}]],20),Gear:icon([['circle',{cx:12,cy:12,r:3}],'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'],20),Plus:()=>h('svg',{width:24,height:24,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.5,strokeLinecap:'round'},h('line',{x1:12,y1:5,x2:12,y2:19}),h('line',{x1:5,y1:12,x2:19,y2:12})),Edit:icon(['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z']),Trash:icon([['polyline',{points:'3 6 5 6 21 6'}],'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2']),Lock:icon([['rect',{x:3,y:11,width:18,height:11,rx:2}],'M7 11V7a5 5 0 0 1 10 0v4'],14),Clock:icon([['circle',{cx:12,cy:12,r:10}],['polyline',{points:'12 6 12 12 16 14'}]],14),Check:()=>h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:3,strokeLinecap:'round',strokeLinejoin:'round'},h('polyline',{points:'20 6 9 17 4 12'})),CheckBig:()=>h('svg',{width:28,height:28,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:3,strokeLinecap:'round',strokeLinejoin:'round'},h('polyline',{points:'20 6 9 17 4 12'})),X:()=>h('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.5,strokeLinecap:'round',strokeLinejoin:'round'},h('line',{x1:18,y1:6,x2:6,y2:18}),h('line',{x1:6,y1:6,x2:18,y2:18})),Moon:icon(['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'],18),Focus:()=>h('svg',{width:22,height:22,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'},h('circle',{cx:12,cy:12,r:10}),h('circle',{cx:12,cy:12,r:6}),h('circle',{cx:12,cy:12,r:2})),Bell:icon(['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0']),BellOff:icon(['M13.73 21a2 2 0 0 1-3.46 0','M18.63 13A17.89 17.89 0 0 1 18 8','M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14',['line',{x1:1,y1:1,x2:23,y2:23}]]),Note:icon(['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',['polyline',{points:'14 2 14 8 20 8'}],['line',{x1:16,y1:13,x2:8,y2:13}],['line',{x1:16,y1:17,x2:8,y2:17}]],14),Archive:icon([['polyline',{points:'21 8 21 21 3 21 3 8'}],['rect',{x:1,y:3,width:22,height:5}],['line',{x1:10,y1:12,x2:14,y2:12}]],14),Copy:icon([['rect',{x:9,y:9,width:13,height:13,rx:2}],'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1']),Pause:icon([['rect',{x:6,y:4,width:4,height:16}],['rect',{x:14,y:4,width:4,height:16}]]),Play:icon([['polygon',{points:'5 3 19 12 5 21 5 3'}]]),Grip:()=>h('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'currentColor',stroke:'none'},h('circle',{cx:8,cy:4,r:2}),h('circle',{cx:16,cy:4,r:2}),h('circle',{cx:8,cy:12,r:2}),h('circle',{cx:16,cy:12,r:2}),h('circle',{cx:8,cy:20,r:2}),h('circle',{cx:16,cy:20,r:2})),Zap:icon(['M13 2L3 14h9l-1 10 10-12h-9l1-10'],16),Gift:icon([['polyline',{points:'20 12 20 22 4 22 4 12'}],['rect',{x:2,y:7,width:20,height:5}],['line',{x1:12,y1:22,x2:12,y2:7}],'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z','M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'],16)};
const F="'SF Pro Display',-apple-system,'Segoe UI',sans-serif";
if(!document.getElementById('cCSS')){const s=document.createElement('style');s.id='cCSS';s.textContent='@keyframes popIn{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes cbPulse{0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}.cb-pulse{animation:cbPulse .3s ease-out}@keyframes confetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-120px) rotate(720deg);opacity:0}}';document.head.appendChild(s)}
function Celebration({text,big,onDone}){const[op,setOp]=useState(0);useEffect(()=>{setOp(1);const t=setTimeout(()=>{setOp(0);setTimeout(onDone,500)},big?4500:1400);return()=>clearTimeout(t)},[]);const cf=big?Array.from({length:30},(_,i)=>({l:5+Math.random()*90,d:1+Math.random()*2.5,c:['#f59e0b','#10b981','#3b82f6','#a855f7','#f43f5e','#fbbf24','#34d399','#fb7185'][i%8],sz:5+Math.random()*10})):[];return h('div',{style:{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:999,pointerEvents:'none',transition:'opacity .5s',opacity:op,background:big?'radial-gradient(circle at 50% 40%,rgba(251,191,36,0.25),rgba(16,185,129,0.1),transparent 70%)':'none'}},cf.map((c,i)=>h('div',{key:i,style:{position:'absolute',left:c.l+'%',bottom:'20%',width:c.sz,height:c.sz,borderRadius:c.sz>8?'50%':'2px',background:c.c,animation:'confetti '+c.d+'s ease-out '+(i*60)+'ms both'}})),h('div',{style:{textAlign:'center',position:'relative'}},h('div',{style:{fontSize:big?100:48,animation:'popIn .5s cubic-bezier(.175,.885,.32,1.275) forwards'}},big?'🏆':'✅'),big&&h('div',{style:{fontSize:20,marginTop:4,animation:'popIn .5s .2s cubic-bezier(.175,.885,.32,1.275) both'}},'🎉🎉🎉'),h('div',{style:{fontSize:big?36:18,fontWeight:900,color:big?'#fbbf24':'#10b981',textShadow:big?'0 0 60px rgba(251,191,36,0.9),0 0 120px rgba(251,191,36,0.4)':'0 0 30px rgba(16,185,129,0.5)',animation:'popIn .5s '+(big?'.3s':'.15s')+' cubic-bezier(.175,.885,.32,1.275) both',fontFamily:F,marginTop:big?20:8,letterSpacing:big?'0.02em':'normal'}},text),big&&h('div',{style:{fontSize:16,color:'#94a3b8',marginTop:14,animation:'popIn .5s .5s both',fontFamily:F,letterSpacing:'0.05em'}},'🌟 ¡Lo lograste! 🌟')))}

// ═══ MAIN APP ═══
function App(){
  const savedMode=localStorage.getItem('myday-mode');
  const[tasks,setTasks]=useState([]);
  const[comp,setComp]=useState({});
  const[skip,setSkip]=useState({});
  const[hold,setHold]=useState({});
  const[tab,setTab]=useState('day');
  const[mode,setMode]=useState(savedMode||'work');
  const[ct,setCt]=useState(getHM());
  const[loading,setLoading]=useState(true);
  const[editing,setEditing]=useState(null);
  const[viewing,setViewing]=useState(null);
  const[cEnd,setCEnd]=useState(false);
  const[cDel,setCDel]=useState(null);
  const[nOn,setNOn]=useState(false);
  const[banner,setBanner]=useState(null);
  const[showAr,setShowAr]=useState(false);
  const[synced,setSynced]=useState(false);
  const[conflict,setConflict]=useState(null);
  const[celeb,setCeleb]=useState(null); // {text,big}
  const[celebBig,setCelebBig]=useState(false);
  const[collCats,setCollCats]=useState({});
  const[justDone,setJustDone]=useState(null);
  const[focusProj,setFocusProj]=useState(null);
  const[showFocus,setShowFocus]=useState(false);
  const[dragId,setDragId]=useState(null);
  const[dragOverId,setDragOverId]=useState(null);
  const[reorderOn,setReorderOn]=useState(false); // drag reorder toggle
  // Section toggles for day view
  const[showCompleted,setShowCompleted]=useState(true);
  const[showBlocked,setShowBlocked]=useState(true);
  const[showAhead,setShowAhead]=useState(true);
  const[collSubs,setCollSubs]=useState(()=>{try{const s=localStorage.getItem('myday-collsubs');return s?JSON.parse(s):{}}catch(e){return{}}});
  // Rewards system
  const[rewards,setRewards]=useState([]); // [{id,name,type:'micro'|'macro'}]
  const[inventory,setInventory]=useState([]); // [{name,type}] earned today
  const[showInv,setShowInv]=useState(false);
  const[showRewardEdit,setShowRewardEdit]=useState(false);
  const[rewardCeleb,setRewardCeleb]=useState(null); // {name,type} to show

  const ntfSet=useRef(new Set());const remSet=useRef(new Set());
  const initDone=useRef(false);const skipFB=useRef(false);
  const isResolving=useRef(true);const isDirty=useRef(false);
  const markDirty=()=>{isDirty.current=true};
  useEffect(()=>{localStorage.setItem('myday-mode',mode)},[mode]);
  useEffect(()=>{try{localStorage.setItem('myday-collsubs',JSON.stringify(collSubs))}catch(e){}},[collSubs]);

  const applyData=d=>{
    setTasks(autoArc(d.tasks||[]));setComp(d.completed||{});setSkip(d.skipped||{});
    if(d.hold)setHold(d.hold);if(d.rewards&&d.rewards.length>0)setRewards(d.rewards);if(d.inventory)setInventory(d.inventory);
    if(d.notified)ntfSet.current=new Set(d.notified);sL(d);setLoading(false);
  };

  // ═══ INIT ═══
  useEffect(()=>{
    if(initDone.current)return;initDone.current=true;
    const local=lL();const lTs=local?.ts||0;
    dataRef.once('value').then(snap=>{
      const remote=snap.val();const rTs=remote?.ts||0;
      if(remote&&local&&lTs>0&&rTs>0&&Math.abs(lTs-rTs)>10000){setConflict({local,remote,lTs,rTs});setLoading(false)}
      else if(remote&&rTs>=lTs){applyData(remote);isResolving.current=false}
      else if(local&&lTs>rTs){applyData(local);isResolving.current=false;markDirty()}
      else{const sd={tasks:SEED,completed:{},skipped:{},hold:{},rewards:[],inventory:[],notified:[],ts:Date.now()};applyData(sd);isResolving.current=false;markDirty()}
      dataRef.on('value',r=>{if(skipFB.current||isResolving.current){skipFB.current=false;return}const v=r.val();if(v&&v.ts>(lL()?.ts||0))applyData(v)});
    }).catch(()=>{if(local)applyData(local);else{const sd={tasks:SEED,completed:{},skipped:{},hold:{},rewards:[],inventory:[],notified:[],ts:Date.now()};applyData(sd)}isResolving.current=false});
    try{db.ref('.info/connected').on('value',s=>{setSynced(!!s.val())})}catch(e){}
    if('Notification' in window&&Notification.permission==='granted')setNOn(true);
  },[]);

  // ═══ SAVE ═══
  useEffect(()=>{
    if(loading||tasks.length===0||isResolving.current||!isDirty.current)return;isDirty.current=false;
    const d={tasks,completed:comp,skipped:skip,hold,rewards,inventory,notified:[...ntfSet.current],ts:Date.now()};
    sL(d);skipFB.current=true;try{dataRef.update(d)}catch(e){}
  },[tasks,comp,skip,hold,rewards,inventory,loading]);

  // Hold expiry
  useEffect(()=>{const iv=setInterval(()=>{const now=Date.now();let ch=false;setHold(p=>{const n={...p};Object.keys(n).forEach(k=>{if(n[k]<=now){delete n[k];ch=true}});return ch?n:p});if(ch)markDirty()},10000);return()=>clearInterval(iv)},[]);

  // Clock + notifs
  useEffect(()=>{
    const tick=()=>{const t=getHM();setCt(t);if(!nOn)return;const nm=toM(t),td=getISO(),dw=getDow();
      tasks.forEach(tk=>{if(tk.archived||!tk.timeCondition||comp[tk.id]||skip[tk.id])return;const at=getActTime(tk,dw);if(!at)return;
        if(tk.category==='event'&&(tk.reminderMin||0)>0&&toArr(tk.eventDates).includes(td)){const tM=toM(at),rM=tM-(tk.reminderMin||0),rk=tk.id+'_r';if(nm>=rM&&nm<tM&&!remSet.current.has(rk)){ntfy('📅 '+tk.name+' en '+tk.reminderMin+'min',at,rk);setBanner(tk.name+' en '+tk.reminderMin+'min');setTimeout(()=>setBanner(null),5000);remSet.current.add(rk)}}
        if(tk.category!=='core'&&tk.category!=='event')return;if(ntfSet.current.has(tk.id))return;
        if(tk.category==='core'&&!toArr(tk.activeDays).includes(dw))return;if(tk.category==='event'&&!toArr(tk.eventDates).includes(td))return;
        const tM=toM(at);if(nm>=tM&&nm<=tM+2){ntfy(tk.category==='event'?'📅':'⏰',tk.name,tk.id);setBanner(tk.name);setTimeout(()=>setBanner(null),5000);ntfSet.current.add(tk.id)}})};
    tick();const iv=setInterval(tick,10000);const onV=()=>{if(!document.hidden)tick()};document.addEventListener('visibilitychange',onV);
    // Schedule notifications in SW for background delivery
    if(swReg&&nOn){try{
      const now=new Date(),td=getISO(),dw=getDow(),notifs=[];
      tasks.forEach(tk=>{if(tk.archived||!tk.timeCondition||comp[tk.id]||skip[tk.id])return;
        const at=getActTime(tk,dw);if(!at)return;
        if(tk.category==='core'&&!toArr(tk.activeDays).includes(dw))return;
        if(tk.category==='event'&&!toArr(tk.eventDates).includes(td))return;
        const[h,m]=at.split(':').map(Number);const fire=new Date(now);fire.setHours(h,m,0,0);
        if(fire>now)notifs.push({title:tk.category==='event'?'📅 Event':'⏰ '+tk.name,body:at,tag:tk.id,fireAt:fire.getTime()});
        if(tk.category==='event'&&(tk.reminderMin||0)>0){const rf=new Date(fire.getTime()-tk.reminderMin*60000);
          if(rf>now)notifs.push({title:'📅 '+tk.name+' en '+tk.reminderMin+'min',body:at,tag:tk.id+'_r',fireAt:rf.getTime()})}
      });
      if(notifs.length>0&&swReg.active)swReg.active.postMessage({type:'SCHEDULE_NOTIFS',notifs});
    }catch(e){}}
    return()=>{clearInterval(iv);document.removeEventListener('visibilitychange',onV)};
  },[tasks,comp,skip,nOn]);

  const rqN=async()=>{if(!('Notification' in window)){setBanner('Not supported');setTimeout(()=>setBanner(null),3000);return}const p=await Notification.requestPermission();if(p==='granted'){setNOn(true);ntfy('🔔','On')}else{setBanner('Denied');setTimeout(()=>setBanner(null),3000)}};

  // ═══ LOGIC ═══
  // Helper: get children of a parent
  const childrenOf=useCallback(pid=>tasks.filter(t=>t.parentId===pid&&!t.archived),[tasks]);
  // Helper: does parent have a goal subtask?
  const parentHasGoal=useCallback(pid=>tasks.some(t=>t.parentId===pid&&!t.archived&&t.isGoal),[tasks]);
  // Resolved: task is done/skipped, OR parent with all subtasks resolved
  const resolved=useCallback(id=>{
    if(comp[id]||skip[id])return true;
    const subs=childrenOf(id);
    if(subs.length>0)return subs.every(s=>!!comp[s.id]||!!skip[s.id]);
    return false;
  },[comp,skip,childrenOf]);
  const isHeld=useCallback(id=>hold[id]&&hold[id]>Date.now(),[hold]);
  const td=getISO(),dw=getDow();
  const isAct=useCallback(t=>{if(t.archived)return false;if(t.category==='event')return toArr(t.eventDates).includes(td);return toArr(t.activeDays||ALL_DAYS).includes(dw)},[td,dw]);
  const ceT=tasks.filter(t=>(t.category==='core'||t.category==='event')&&isAct(t)&&!t.parentId);
  // Time check: subtasks inherit parent's time
  const tOk=useCallback(t=>{
    const tc=t.timeCondition||(t.parentId?tasks.find(p=>p.id===t.parentId)?.timeCondition:null);
    if(!tc)return true;const at=tc.dayOverrides&&tc.dayOverrides[dw]?tc.dayOverrides[dw]:tc.time;
    return!at||toM(ct)>=toM(at);
  },[ct,dw,tasks]);
  const dOk=useCallback(tk=>{
    if(tk.dependsOn&&!resolved(tk.dependsOn))return false;
    if(tk.category==='work'||tk.category==='personal')if(ceT.filter(c=>tOk(c)&&!resolved(c.id)&&!isHeld(c.id)).length>0)return false;
    return true;
  },[resolved,ceT,tOk,isHeld]);
  const isUL=useCallback(t=>{if(isHeld(t.id))return false;return tOk(t)&&dOk(t)},[tOk,dOk,isHeld]);
  const dN=useCallback(t=>{if(!t.timeCondition)return t.name;const tc=t.timeCondition;if(tc.labelSwitchTime&&tc.labelBefore&&tc.labelAfter)return toM(ct)>=toM(tc.labelSwitchTime)?tc.labelAfter:tc.labelBefore;return t.name},[ct]);
  const bW=useCallback(tk=>{
    const r=[];if(isHeld(tk.id)){const min=Math.ceil((hold[tk.id]-Date.now())/60000);r.push('⏸ Hold '+min+'min');return r}
    const at=getActTime(tk,dw);if(tk.timeCondition&&at&&toM(ct)<toM(at))r.push(at);
    if(tk.dependsOn&&!resolved(tk.dependsOn)){const p=tasks.find(x=>x.id===tk.dependsOn);if(p)r.push('After: '+p.name)}
    if(tk.category==='work'||tk.category==='personal'){const pn=ceT.filter(c=>tOk(c)&&!resolved(c.id)&&!isHeld(c.id));if(pn.length)r.push('Pending: '+pn.map(c=>c.name).join(', '))}
    return r;
  },[tOk,resolved,tasks,ceT,ct,dw,hold,isHeld]);

  // ═══ REWARDS LOGIC ═══
  const giveReward=(instant)=>{
    if(rewards.length===0)return;
    const rw=rewards[Math.floor(Math.random()*rewards.length)];
    // Always save to inventory
    setInventory(p=>[...p,{name:rw.name,type:rw.type}]);markDirty();
    // Also show popup if instant
    if(instant){setTimeout(()=>{setRewardCeleb(rw);setTimeout(()=>setRewardCeleb(null),3500)},100)}
  };

  // Goal check with rewards
  const checkGoal=(taskId)=>{
    const goal=tasks.find(t=>t.isGoal&&!t.archived&&t.id===taskId);
    if(!goal){return false}
    setCelebBig(true);setCeleb('🎯 ¡META CUMPLIDA!');
    setTimeout(()=>{if(mode==='work')giveReward(false);else giveReward(true)},4600);
    return true;
  };

  // Check if goal already met (for bonus rewards)
  const isGoalMet=(cat,extraId)=>{
    const catT=tasks.filter(t=>!t.archived&&isAct(t)&&t.category===cat);
    const goal=catT.find(t=>t.isGoal);if(!goal)return false;
    return!!comp[goal.id]||goal.id===extraId;
  };

  // ═══ ACTIONS ═══
  const doC=id=>{markDirty();const was=!!comp[id];
    setComp(p=>{const n={...p};n[id]?delete n[id]:(n[id]=true);return n});setSkip(p=>{const n={...p};delete n[id];return n});
    if(!was){setJustDone(id);setTimeout(()=>setJustDone(null),400);
      const tk=tasks.find(t=>t.id===id);
      if(tk){const isGoalHit=checkGoal(id);
        if(!isGoalHit){setCeleb('Done!');setCelebBig(false);
          // Bonus: if goal already met, give instant reward
          if((tk.category==='work'||tk.category==='personal')&&isGoalMet(tk.category,id))giveReward(true);
        }
      }
    }
  };
  const doS=id=>{markDirty();setSkip(p=>{const n={...p};n[id]?delete n[id]:(n[id]=true);return n});setComp(p=>{const n={...p};delete n[id];return n})};
  const doHold=(id,min)=>{markDirty();setHold(p=>({...p,[id]:Date.now()+min*60000}))};
  const doUnhold=id=>{markDirty();setHold(p=>{const n={...p};delete n[id];return n})};
  const endD=()=>{markDirty();setComp({});setSkip({});setHold({});setInventory([]);setCEnd(false);ntfSet.current.clear();remSet.current.clear()};
  const delT=id=>{markDirty();const subs=tasks.filter(t=>t.parentId===id).map(t=>t.id);const all=[id,...subs];setTasks(p=>p.filter(t=>!all.includes(t.id)).map(t=>t.dependsOn&&all.includes(t.dependsOn)?{...t,dependsOn:null}:t));all.forEach(d=>{setComp(p=>{const n={...p};delete n[d];return n});setSkip(p=>{const n={...p};delete n[d];return n})});setCDel(null)};
  const svT=td=>{markDirty();if(td.id)setTasks(p=>p.map(t=>t.id===td.id?td:t));else setTasks(p=>[...p,{...td,id:gid(),order:p.length}]);setEditing(null)};
  const uN=(id,notes)=>{markDirty();setTasks(p=>p.map(t=>t.id===id?{...t,notes}:t))};
  const arT=id=>{markDirty();setTasks(p=>p.map(t=>t.id===id?{...t,archived:true}:t))};
  const unT=id=>{markDirty();setTasks(p=>p.map(t=>t.id===id?{...t,archived:false}:t))};
  // Duplicate with subtasks
  const dupT=id=>{markDirty();setTasks(p=>{const t=p.find(x=>x.id===id);if(!t)return p;const newId=gid();const subs=p.filter(x=>x.parentId===id);const newSubs=subs.map(s=>({...s,id:gid(),parentId:newId,name:s.name,order:p.length+1}));return[...p,{...t,id:newId,name:t.name+' (copy)',order:p.length},...newSubs]})};

  // Drag reorder
  const handleDrop=(targetId,cat)=>{if(!dragId||dragId===targetId){setDragId(null);setDragOverId(null);return}markDirty();
    setTasks(prev=>{const ct=prev.filter(t=>t.category===cat&&!t.archived);const ot=prev.filter(t=>t.category!==cat||t.archived);
      const fi=ct.findIndex(t=>t.id===dragId);const ti=ct.findIndex(t=>t.id===targetId);if(fi<0||ti<0)return prev;
      const dt=ct[fi];let mv=[dragId];if(!dt.parentId)mv=[...mv,...ct.filter(t=>t.parentId===dragId).map(t=>t.id)];
      const moving=ct.filter(t=>mv.includes(t.id));const rest=ct.filter(t=>!mv.includes(t.id));
      const ins=rest.findIndex(t=>t.id===targetId);rest.splice(ins<0?rest.length:ins,0,...moving);
      return[...rest.map((t,i)=>({...t,order:i})),...ot]});
    setDragId(null);setDragOverId(null)};

  // ═══ COMPUTED ═══
  let dayT=tasks.filter(t=>{if(t.archived||!isAct(t))return false;
    if(tasks.some(c=>c.parentId===t.id&&!c.archived))return false; // parent groups hidden
    if(t.category==='core'||t.category==='event')return true;
    if(t.category!==mode)return false;
    if(focusProj&&t.project!==focusProj)return false;return true;
  }).sort((a,b)=>{
    // Effective order: subtasks get parent.order + fraction so they stay grouped after parent position
    const effOrd=t=>{
      if(t.parentId){const p=tasks.find(x=>x.id===t.parentId);return(p?p.order||0:0)+(t.order||0)*0.001}
      return t.order||0;
    };
    const aTime=a.timeCondition||(a.parentId?tasks.find(p=>p.id===a.parentId)?.timeCondition:null);
    const bTime=b.timeCondition||(b.parentId?tasks.find(p=>p.id===b.parentId)?.timeCondition:null);
    const aT=aTime?toM(getActTime(a,dw)||(aTime.dayOverrides&&aTime.dayOverrides[dw])||aTime.time||'23:59'):9999;
    const bT=bTime?toM(getActTime(b,dw)||(bTime.dayOverrides&&bTime.dayOverrides[dw])||bTime.time||'23:59'):9999;
    if(aT!==bT&&aT<9999&&bT<9999)return aT-bT;
    return effOrd(a)-effOrd(b);
  });

  const todayEv=dayT.filter(t=>t.category==='event');
  const nonEv=dayT.filter(t=>t.category!=='event');
  // FIX: sort by order not time for next task (time-activated tasks respect queue)
  const nxt=nonEv.filter(t=>!resolved(t.id)&&isUL(t)).sort((a,b)=>(a.order||0)-(b.order||0))[0];
  // Three sections
  const completedT=nonEv.filter(t=>resolved(t.id));
  const blockedT=nonEv.filter(t=>!resolved(t.id)&&!isUL(t)&&!isHeld(t.id)&&t.timeCondition&&!tOk(t));
  const aheadT=nonEv.filter(t=>!resolved(t.id)&&t.id!==(nxt?.id)&&!blockedT.find(b=>b.id===t.id));

  const rCnt=dayT.filter(t=>resolved(t.id)).length;
  const pct=dayT.length?rCnt/dayT.length:0;
  const actTasks=tasks.filter(t=>!t.archived),arcTasks=tasks.filter(t=>t.archived);
  const grp={core:[],event:[],work:[],personal:[]};actTasks.filter(t=>!t.parentId).forEach(t=>{if(grp[t.category])grp[t.category].push(t)});
  const projects=[...new Set(tasks.filter(t=>t.project&&(t.category==='work'||t.category==='personal')).map(t=>t.project))];

  if(loading)return h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#0c0f1a'}},h('p',{style:{color:'#94a3b8'}},'Loading...'));

  // ═══ CARD RENDERER ═══
  const rCard=(task,mini)=>{
    const done=!!comp[task.id],isSk=!!skip[task.id],rs=done||isSk,u=isUL(task),hld=isHeld(task.id);
    const reasons=bW(task),name=dN(task),c=CAT[task.category],isG=task.isGoal||parentHasGoal(task.id),pulsing=justDone===task.id;
    const parent=task.parentId?tasks.find(t=>t.id===task.parentId):null;
    return h('div',{key:task.id,style:{display:'flex',alignItems:'flex-start',gap:10,padding:task.parentId?'8px 12px 8px 26px':'10px 12px',background:isG?'linear-gradient(135deg,rgba(16,185,129,0.05),rgba(251,191,36,0.03))':'#111827',borderRadius:10,borderLeft:'3px solid '+c.border,cursor:'pointer',opacity:rs?0.4:(!u&&!rs?0.35:1),transition:'opacity .2s'},onClick:()=>setViewing(task)},
      h('button',{className:pulsing?'cb-pulse':'',style:{width:28,height:28,borderRadius:8,border:done?'2px solid #10b981':isSk?'2px solid #475569':hld?'2px solid #f59e0b':!u?'2px solid #1e293b':'2px solid #334155',background:done?'linear-gradient(135deg,#10b981,#059669)':isSk?'rgba(100,116,139,0.3)':hld?'rgba(245,158,11,0.15)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:!u&&!hld?'not-allowed':'pointer',flexShrink:0,color:done?'#fff':isSk?'#94a3b8':hld?'#f59e0b':'transparent',transition:'all .2s'},onClick:e=>{e.stopPropagation();if(hld)return;(u||rs)&&doC(task.id)}},
        done&&h(IC.Check),isSk&&h(IC.X),hld&&h(IC.Pause),!u&&!rs&&!hld&&h(IC.Lock)),
      h('div',{style:{flex:1,minWidth:0}},
        parent&&h('div',{style:{fontSize:9,color:'#475569',marginBottom:1}},'↳ '+parent.name+(parentHasGoal(parent.id)?' 🎯':'')),
        h('div',{style:{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}},
          h('span',{style:{fontSize:13,fontWeight:600,color:done||isSk?'#64748b':hld?'#f59e0b':!u?'#475569':'#e2e8f0',textDecoration:rs?'line-through':'none',fontStyle:isSk?'italic':'normal'}},name),
          !task.parentId&&!mini&&h('span',{style:{fontSize:8,fontWeight:700,padding:'1px 5px',borderRadius:4,border:'1px solid '+c.border,background:c.bg,color:c.text,textTransform:'uppercase'}},c.label),
          isG&&h('span',{style:{fontSize:9,fontWeight:800,color:'#fbbf24',background:'rgba(251,191,36,0.12)',padding:'1px 6px',borderRadius:5,border:'1px solid rgba(251,191,36,0.25)'}},'🎯 META')),
        !u&&!rs&&reasons.length>0&&!mini&&h('div',{style:{marginTop:2}},reasons.map((r,i)=>h('span',{key:i,style:{fontSize:9,color:hld?'#f59e0b':'#64748b',marginRight:8}},r)))),
      h('div',{style:{display:'flex',gap:3,flexShrink:0}},
        u&&!rs&&h('button',{style:{width:24,height:24,borderRadius:6,border:'1px solid rgba(100,116,139,0.2)',background:'rgba(100,116,139,0.08)',color:'#64748b',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'},onClick:e=>{e.stopPropagation();doS(task.id)}},h(IC.X)),
        u&&!rs&&!hld&&h('button',{style:{width:24,height:24,borderRadius:6,border:'1px solid rgba(245,158,11,0.2)',background:'rgba(245,158,11,0.08)',color:'#f59e0b',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'},onClick:e=>{e.stopPropagation();doHold(task.id,60)}},h(IC.Pause)),
        hld&&h('button',{style:{width:24,height:24,borderRadius:6,border:'1px solid rgba(16,185,129,0.3)',background:'rgba(16,185,129,0.1)',color:'#10b981',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'},onClick:e=>{e.stopPropagation();doUnhold(task.id)}},h(IC.Play))));
  };

  // ═══ EVENT CARD ═══
  const rEvent=task=>{
    const done=!!comp[task.id],isSk=!!skip[task.id],rs=done||isSk;const at=getActTime(task,dw);
    return h('div',{key:task.id,style:{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',background:'linear-gradient(135deg,rgba(244,63,94,0.05),rgba(244,63,94,0.01))',border:'1px solid rgba(244,63,94,'+(rs?'0.08':'0.15')+')',borderRadius:10,opacity:rs?0.5:1,cursor:'pointer'},onClick:()=>setViewing(task)},
      h('div',{style:{fontSize:18,flexShrink:0}},rs?'✅':'📅'),
      h('div',{style:{flex:1,minWidth:0}},h('div',{style:{fontSize:12,fontWeight:700,color:rs?'#64748b':'#fb7185',textDecoration:rs?'line-through':'none'}},task.name),
        h('div',{style:{display:'flex',gap:6,marginTop:1}},at&&h('span',{style:{fontSize:10,color:'#94a3b8'}},at),task.reminderMin>0&&h('span',{style:{fontSize:9,color:'#64748b'}},'⏰'+task.reminderMin+'m'))),
      h('div',{style:{display:'flex',gap:3}},
        h('button',{style:{width:24,height:24,borderRadius:6,background:rs?'rgba(100,116,139,0.15)':'rgba(16,185,129,0.15)',border:'none',color:rs?'#94a3b8':'#10b981',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'},onClick:e=>{e.stopPropagation();doC(task.id)}},rs?h(IC.X):h(IC.Check)),
        !rs&&h('button',{style:{width:24,height:24,borderRadius:6,background:'rgba(100,116,139,0.1)',border:'none',color:'#64748b',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'},onClick:e=>{e.stopPropagation();doS(task.id)}},h(IC.X))));
  };

  // Section header with toggle
  const secH=(label,count,show,setShow)=>h('div',{style:{display:'flex',alignItems:'center',gap:6,fontSize:10,fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:show?6:0,marginTop:8,padding:'0 4px',cursor:'pointer'},onClick:()=>setShow(!show)},
    h('span',{style:{display:'inline-block',transform:show?'rotate(0)':'rotate(-90deg)',transition:'transform .2s',fontSize:10}},'▾'),label+' ('+count+')');

  // ═══ ADMIN ROW ═══
  const aRow=(task,cat,isSub)=>{
    const done=!!comp[task.id],isSk=!!skip[task.id],c=CAT[cat],at=getActTime(task,dw);
    const isDO=dragOverId===task.id;const subs=tasks.filter(t=>t.parentId===task.id&&!t.archived);
    const subsColl=!!collSubs[task.id];
    const dates=Array.isArray(task.eventDates)?task.eventDates:task.eventDates?Object.values(task.eventDates):[];
    const dateStr=dates.length>0?dates.join(', '):'Sin fecha';

    // Build info chips array
    const chips=[];
    if(at)chips.push(h('span',{key:'time',style:{fontSize:9,color:'#64748b'}},at));
    if(cat==='event')chips.push(h('span',{key:'dates',style:{fontSize:9,color:'#fb7185',fontWeight:600}},'📅 '+dateStr));
    if(task.project)chips.push(h('span',{key:'proj',style:{fontSize:9,color:'#475569'}},task.project));

    // Build action buttons array
    const btns=[];
    btns.push(h('button',{key:'edit',style:{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:5,color:'#60a5fa',cursor:'pointer'},onClick:()=>setEditing(task)},h(IC.Edit)));
    btns.push(h('button',{key:'dup',style:{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:5,color:'#94a3b8',cursor:'pointer'},onClick:()=>dupT(task.id)},h(IC.Copy)));
    if(!isSub)btns.push(h('button',{key:'sub',style:{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:5,color:'#64748b',cursor:'pointer',fontSize:9},onClick:()=>setEditing({_newSub:true,parentId:task.id,category:cat})},'+'));
    if(cat==='event')btns.push(h('button',{key:'arc',style:{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:5,color:'#94a3b8',cursor:'pointer'},onClick:()=>arT(task.id)},h(IC.Archive)));
    else btns.push(h('button',{key:'del',style:{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:5,color:'#f87171',cursor:'pointer'},onClick:()=>setCDel(task.id)},h(IC.Trash)));

    const nameRow=h('div',{style:{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap'}},
      h('span',{style:{fontSize:12,fontWeight:600,color:done?'#64748b':'#e2e8f0',textDecoration:done?'line-through':'none'}},task.name),
      task.isGoal?h('span',{style:{fontSize:8,color:'#fbbf24'}},'🎯'):null,
      subs.length>0?h('button',{style:{fontSize:9,color:'#475569',background:'none',border:'none',cursor:'pointer',padding:'0 4px'},onClick:e=>{e.stopPropagation();setCollSubs(p=>({...p,[task.id]:!p[task.id]}))}},subsColl?'▸ '+subs.length+' sub':'▾ '+subs.length+' sub'):null);

    const infoRow=chips.length>0?h('div',{style:{display:'flex',flexWrap:'wrap',gap:4,marginTop:2}},chips):null;

    const content=h('div',{style:{flex:1,minWidth:0}},nameRow,infoRow);

    const row=h('div',{'data-cat':cat,'data-tid':task.id,draggable:reorderOn,
      onDragStart:()=>{if(reorderOn)setDragId(task.id)},
      onDragOver:e=>{if(reorderOn){e.preventDefault();setDragOverId(task.id)}},
      onDrop:()=>{if(reorderOn)handleDrop(task.id,cat)},
      onDragEnd:()=>{setDragId(null);setDragOverId(null)},
      onTouchStart:()=>{if(reorderOn)setDragId(task.id)},
      onTouchMove:e=>{if(!reorderOn)return;const y=e.touches[0].clientY;document.querySelectorAll('[data-cat="'+cat+'"]').forEach(el=>{const r=el.getBoundingClientRect();if(y>r.top&&y<r.bottom)setDragOverId(el.getAttribute('data-tid'))})},
      onTouchEnd:()=>{if(!reorderOn)return;if(dragId&&dragOverId)handleDrop(dragOverId,cat);else{setDragId(null);setDragOverId(null)}},
      style:{display:'flex',alignItems:'center',gap:6,padding:isSub?'8px 8px 8px 28px':'10px 12px',background:isDO?'#1e293b':dragId===task.id?'#0f172a':'#111827',borderRadius:10,borderLeft:'3px solid '+c.border,marginBottom:3,opacity:dragId===task.id?0.5:1,borderTop:isDO?'2px solid #f59e0b':'2px solid transparent',cursor:reorderOn?'grab':'default',touchAction:reorderOn?'none':'auto'}},
      reorderOn?h('div',{style:{color:'#334155',display:'flex',padding:'2px 0'}},h(IC.Grip)):null,
      h('div',{style:{width:8,height:8,borderRadius:4,flexShrink:0,background:done?'#10b981':isSk?'#475569':'#1e293b',border:done||isSk?'none':'2px solid #334155'}}),
      content,
      h('div',{style:{display:'flex',gap:2,flexShrink:0}},btns));

    const childRows=!subsColl?subs.sort((a,b)=>a.order-b.order).map(s=>aRow(s,cat,true)):[];

    return h('div',{key:task.id},row,...childRows);
  };

  // ═══ RENDER ═══
  return h('div',{style:{fontFamily:F,background:'#0c0f1a',minHeight:'100vh',maxWidth:480,margin:'0 auto',position:'relative',color:'#e2e8f0'}},
    celeb&&h(Celebration,{text:celeb,big:celebBig,onDone:()=>{setCeleb(null);setCelebBig(false)}}),
    rewardCeleb&&h('div',{style:{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:998,pointerEvents:'none'}},
      h('div',{style:{textAlign:'center',animation:'popIn .4s cubic-bezier(.175,.885,.32,1.275) forwards'}},
        h('div',{style:{fontSize:56}},'🎁'),h('div',{style:{fontSize:18,fontWeight:800,color:'#c084fc',marginTop:8,fontFamily:F}},rewardCeleb.name),
        h('div',{style:{fontSize:12,color:'#94a3b8',marginTop:4}},(rewardCeleb.type==='micro'?'⚡ Micro':'🌟 Macro')+' reward!'))),
    banner&&h('div',{style:{position:'fixed',top:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,background:'linear-gradient(135deg,#f59e0b,#d97706)',color:'#0c0f1a',padding:'12px 16px',display:'flex',alignItems:'center',gap:8,zIndex:300,paddingTop:'calc(12px + env(safe-area-inset-top))'}},
      h('span',{style:{fontSize:14}},'⏰'),h('span',{style:{flex:1,fontSize:13,fontWeight:700}},banner),h('button',{style:{background:'none',border:'none',color:'#0c0f1a',cursor:'pointer',padding:4,display:'flex'},onClick:()=>setBanner(null)},h(IC.X))),
    // Header
    h('div',{style:{padding:'14px 16px 10px',background:'linear-gradient(180deg,#0c0f1a,rgba(12,15,26,0.95))',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(148,163,184,0.06)',display:'flex',alignItems:'center',gap:8}},
      h('div',{style:{display:'flex',alignItems:'center',gap:8,flex:1}},
        h('span',{style:{fontSize:20,fontWeight:700,color:'#f8fafc'}},tab==='day'?'My Day':'Manage'),
        h('span',{style:{fontSize:9,color:'#334155'}},'6.5'),
        h('span',{style:{fontSize:13,color:'#64748b'}},ct),
        h('span',{className:'sd '+(synced?'sd-on':'sd-off')})),
      focusProj&&tab==='day'&&h('button',{style:{fontSize:9,padding:'3px 6px',borderRadius:5,background:'rgba(168,85,247,0.12)',border:'1px solid rgba(168,85,247,0.25)',color:'#c084fc',cursor:'pointer',fontFamily:F,fontWeight:700},onClick:()=>setFocusProj(null)},'⚡'+focusProj+' ✕'),
      tab==='day'&&projects.length>0&&h('button',{style:{background:'none',border:'none',cursor:'pointer',padding:3,display:'flex',color:focusProj?'#a855f7':'#334155'},onClick:()=>setShowFocus(!showFocus)},h(IC.Zap)),
      h('button',{style:{background:'none',border:'none',cursor:'pointer',padding:3,display:'flex',color:nOn?'#f59e0b':'#475569'},onClick:nOn?()=>setNOn(false):rqN},nOn?h(IC.Bell):h(IC.BellOff))),
    showFocus&&h('div',{style:{position:'absolute',top:55,right:40,background:'#1e293b',borderRadius:10,padding:6,zIndex:60,boxShadow:'0 8px 30px rgba(0,0,0,0.5)',minWidth:140}},
      h('button',{style:{width:'100%',textAlign:'left',padding:'6px 8px',background:!focusProj?'rgba(168,85,247,0.12)':'none',border:'none',borderRadius:6,color:!focusProj?'#c084fc':'#94a3b8',cursor:'pointer',fontSize:11,fontFamily:F,fontWeight:600},onClick:()=>{setFocusProj(null);setShowFocus(false)}},'All'),
      projects.map(p=>h('button',{key:p,style:{width:'100%',textAlign:'left',padding:'6px 8px',background:focusProj===p?'rgba(168,85,247,0.12)':'none',border:'none',borderRadius:6,color:focusProj===p?'#c084fc':'#94a3b8',cursor:'pointer',fontSize:11,fontFamily:F,fontWeight:600,marginTop:1},onClick:()=>{setFocusProj(p);setShowFocus(false)}},p))),
    // Content
    h('div',{style:{padding:'10px 14px',paddingBottom:90}},
      tab==='day'?
      h('div',{style:{paddingBottom:80}},
        // Floating inventory button
        h('button',{style:{position:'fixed',top:56,right:'calc(50% - 225px)',zIndex:55,fontSize:13,padding:'6px 12px',borderRadius:10,background:inventory.length>0?'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(168,85,247,0.1))':'rgba(30,41,59,0.9)',border:'1px solid '+(inventory.length>0?'rgba(168,85,247,0.4)':'rgba(51,65,85,0.5)'),color:inventory.length>0?'#c084fc':'#64748b',cursor:'pointer',fontFamily:F,fontWeight:700,boxShadow:'0 4px 12px rgba(0,0,0,0.3)',backdropFilter:'blur(8px)'},onClick:()=>setShowInv(true)},inventory.length>0?'🎁 '+inventory.length:'🎁 0'),
        h('div',{style:{marginBottom:14}},h('div',{style:{display:'flex',position:'relative',background:'#1e293b',borderRadius:12,padding:3,height:44}},
          h('div',{style:{position:'absolute',top:3,left:3,width:'calc(50% - 3px)',height:38,borderRadius:10,transition:'all .3s',zIndex:0,transform:mode==='work'?'translateX(100%)':'translateX(0%)',background:mode==='personal'?'linear-gradient(135deg,#a855f7,#7c3aed)':'linear-gradient(135deg,#3b82f6,#2563eb)'}}),
          h('button',{style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,fontSize:13,fontWeight:600,background:'none',border:'none',cursor:'pointer',zIndex:1,position:'relative',fontFamily:F,color:mode==='personal'?'#fff':'#94a3b8'},onClick:()=>setMode('personal')},h(IC.Sun),' Personal'),
          h('button',{style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,fontSize:13,fontWeight:600,background:'none',border:'none',cursor:'pointer',zIndex:1,position:'relative',fontFamily:F,color:mode==='work'?'#fff':'#94a3b8'},onClick:()=>setMode('work')},h(IC.Brief),' Work'))),
        h('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:14}},
          h('div',{style:{flex:1,height:5,background:'#1e293b',borderRadius:3,overflow:'hidden'}},h('div',{style:{height:'100%',borderRadius:3,transition:'width .5s',width:pct*100+'%',background:pct===1?'linear-gradient(90deg,#10b981,#34d399)':'linear-gradient(90deg,#f59e0b,#fbbf24)'}})),
          h('span',{style:{fontSize:12,fontWeight:600,color:'#94a3b8',minWidth:28,textAlign:'right'}},rCnt+'/'+dayT.length)),
        // Events
        todayEv.length>0&&h('div',{style:{marginBottom:14}},h('div',{style:{fontSize:10,fontWeight:700,color:'#fb7185',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6,padding:'0 4px'}},'📅 Events'),h('div',{style:{display:'flex',flexDirection:'column',gap:4}},todayEv.map(rEvent))),
        // Hero
        nxt&&h('div',{style:{background:'linear-gradient(135deg,rgba(251,191,36,0.05),rgba(251,191,36,0.01))',border:'1px solid rgba(251,191,36,0.15)',borderRadius:18,padding:'20px 18px',marginBottom:8,boxShadow:'0 0 30px rgba(251,191,36,0.04)'},onClick:()=>setViewing(nxt)},
          h('div',{style:{display:'flex',alignItems:'center',gap:6,color:'#f59e0b',marginBottom:10}},h(IC.Focus),h('span',{style:{fontSize:11,fontWeight:800,letterSpacing:'0.1em'}},'FOCUS NOW')),
          h('div',{style:{fontSize:24,fontWeight:800,color:'#fef3c7',lineHeight:1.2,marginBottom:8}},dN(nxt)),
          nxt.isGoal&&h('div',{style:{fontSize:13,fontWeight:800,color:'#fbbf24',marginBottom:8,background:'linear-gradient(90deg,rgba(251,191,36,0.1),transparent)',padding:'5px 10px',borderRadius:7,border:'1px solid rgba(251,191,36,0.2)'}},'🎯 DAILY GOAL'),
          h('div',{style:{display:'flex',alignItems:'center',gap:6,marginBottom:14,flexWrap:'wrap'}},
            h('span',{style:{fontSize:8,fontWeight:700,padding:'2px 5px',borderRadius:4,border:'1px solid '+CAT[nxt.category].border,background:CAT[nxt.category].bg,color:CAT[nxt.category].text,textTransform:'uppercase'}},CAT[nxt.category].label),
            nxt.project&&h('span',{style:{fontSize:11,fontWeight:600,color:'#94a3b8',background:'rgba(148,163,184,0.1)',padding:'2px 8px',borderRadius:5}},nxt.project)),
          h('div',{style:{display:'flex',gap:8},onClick:e=>e.stopPropagation()},
            h('button',{style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'12px 16px',background:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:12,color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:()=>doC(nxt.id)},h(IC.CheckBig),' Done'),
            h('button',{style:{padding:'12px 14px',background:'rgba(100,116,139,0.12)',border:'1px solid rgba(100,116,139,0.2)',borderRadius:12,color:'#94a3b8',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:()=>doS(nxt.id)},'Skip'),
            h('button',{style:{padding:'12px 14px',background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:12,color:'#f59e0b',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:()=>doHold(nxt.id,60)},'⏸1h'))),
        pct===1&&h('div',{style:{background:'linear-gradient(135deg,rgba(16,185,129,0.05),rgba(16,185,129,0.01))',border:'1px solid rgba(16,185,129,0.15)',borderRadius:18,padding:'20px',textAlign:'center'}},h('span',{style:{fontSize:26}},'🎉'),h('div',{style:{fontSize:20,fontWeight:800,color:'#34d399',marginTop:6}},'All done!')),
        // 3 Sections
        completedT.length>0&&h('div',null,secH('Completed',completedT.length,showCompleted,setShowCompleted),showCompleted&&h('div',{style:{display:'flex',flexDirection:'column',gap:4}},completedT.map(t=>rCard(t,true)))),
        blockedT.length>0&&h('div',null,secH('Time blocked',blockedT.length,showBlocked,setShowBlocked),showBlocked&&h('div',{style:{display:'flex',flexDirection:'column',gap:4}},blockedT.map(t=>rCard(t,true)))),
        aheadT.length>0&&h('div',null,secH('Up ahead',aheadT.length,showAhead,setShowAhead),showAhead&&h('div',{style:{display:'flex',flexDirection:'column',gap:4}},aheadT.map(t=>rCard(t)))),
        rCnt>0&&h('button',{style:{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:12,marginTop:20,background:'linear-gradient(135deg,#1e293b,#0f172a)',border:'1px solid rgba(251,191,36,0.15)',borderRadius:12,color:'#fbbf24',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:()=>setCEnd(true)},h(IC.Moon),' End Day'))
      :
      // ═══ ADMIN ═══
      h('div',{style:{paddingBottom:100}},
        h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}},
          h('button',{style:{fontSize:11,padding:'5px 12px',borderRadius:8,background:reorderOn?'rgba(251,191,36,0.15)':'rgba(100,116,139,0.1)',border:'1px solid '+(reorderOn?'rgba(251,191,36,0.3)':'rgba(100,116,139,0.2)'),color:reorderOn?'#fbbf24':'#64748b',cursor:'pointer',fontFamily:F,fontWeight:700},onClick:()=>setReorderOn(!reorderOn)},reorderOn?'🔓 Reorder ON':'🔒 Reorder OFF')),
        ['core','event','work','personal'].map(cat=>{const list=grp[cat];if(!list||!list.length)return null;const c=CAT[cat],coll=!!collCats[cat];
          return h('div',{key:cat,style:{marginBottom:coll?6:16}},
            h('div',{style:{display:'flex',alignItems:'center',gap:6,fontSize:12,fontWeight:700,textTransform:'uppercase',color:c.text,marginBottom:coll?0:6,padding:'0 4px',cursor:'pointer'},onClick:()=>setCollCats(p=>({...p,[cat]:!p[cat]}))},
              h('span',{style:{width:7,height:7,borderRadius:4,background:c.border}}),c.label+' ('+list.length+')',
              h('span',{style:{fontSize:10,marginLeft:3,display:'inline-block',transform:coll?'rotate(-90deg)':'rotate(0)',transition:'transform .2s'}},'▾')),
            !coll&&list.sort((a,b)=>a.order-b.order).map(t=>aRow(t,cat,false)))
        }),
        // Event calendar
        (()=>{const evts=tasks.filter(t=>t.category==='event'&&!t.archived);if(!evts.length)return null;
          const allDates=[];evts.forEach(t=>toArr(t.eventDates).forEach(d=>allDates.push({date:d,name:t.name,time:getActTime(t,dw)||'',id:t.id})));
          allDates.sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
          return h('div',{style:{marginTop:16,background:'#111827',borderRadius:12,padding:'12px 14px',border:'1px solid rgba(244,63,94,0.15)'}},
            h('div',{style:{fontSize:12,fontWeight:700,color:'#fb7185',marginBottom:8}},'📅 Cronograma de Eventos'),
            allDates.length===0?h('div',{style:{fontSize:11,color:'#475569',fontStyle:'italic'}},'Sin fechas'):
            allDates.map((ev,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:8,padding:'5px 0',borderBottom:i<allDates.length-1?'1px solid #1e293b':'none'}},
              h('span',{style:{fontSize:11,color:'#fb7185',fontWeight:700,minWidth:75,fontFamily:'monospace'}},ev.date),
              ev.time&&h('span',{style:{fontSize:10,color:'#64748b',minWidth:36}},ev.time),
              h('span',{style:{fontSize:11,color:'#e2e8f0'}},ev.name))))})(),
        // Rewards config section
        h('div',{style:{marginTop:20,borderTop:'1px solid #1e293b',paddingTop:16}},
          h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}},
            h('div',{style:{fontSize:12,fontWeight:700,color:'#c084fc',textTransform:'uppercase'}},'🎁 Bolsa de Recompensas'),
            h('button',{style:{fontSize:10,padding:'4px 10px',background:'rgba(168,85,247,0.15)',border:'1px solid rgba(168,85,247,0.3)',borderRadius:6,color:'#c084fc',cursor:'pointer',fontFamily:F,fontWeight:700},onClick:()=>setShowRewardEdit(true)},'+Add')),
          rewards.length===0?h('div',{style:{fontSize:11,color:'#475569',fontStyle:'italic',padding:8}},'No rewards yet. Add some!'):
          rewards.map((rw,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:8,padding:'6px 10px',background:'#111827',borderRadius:8,marginBottom:3}},
            h('span',{style:{fontSize:10,padding:'1px 5px',borderRadius:4,background:rw.type==='micro'?'rgba(59,130,246,0.15)':'rgba(168,85,247,0.15)',color:rw.type==='micro'?'#60a5fa':'#c084fc',fontWeight:700}},rw.type==='micro'?'⚡Micro':'🌟Macro'),
            h('span',{style:{flex:1,fontSize:12,color:'#e2e8f0'}},rw.name),
            h('button',{style:{background:'none',border:'none',color:'#f87171',cursor:'pointer',display:'flex'},onClick:()=>{markDirty();setRewards(p=>p.filter((_,j)=>j!==i))}},h(IC.X))))),
        arcTasks.length>0&&h('div',{style:{marginTop:16}},
          h('button',{style:{display:'flex',alignItems:'center',gap:6,width:'100%',padding:'10px 12px',background:'#111827',border:'1px solid #1e293b',borderRadius:10,color:'#64748b',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:F,marginBottom:6},onClick:()=>setShowAr(!showAr)},h(IC.Archive),' Archived ('+arcTasks.length+')'),
          showAr&&arcTasks.map(t=>h('div',{key:t.id,style:{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:'#111827',borderRadius:8,marginBottom:3,opacity:0.5}},
            h('div',{style:{flex:1,fontSize:12,color:'#e2e8f0',textDecoration:'line-through'}},t.name),
            h('button',{style:{width:24,height:24,background:'#1e293b',border:'none',borderRadius:6,color:'#60a5fa',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'},onClick:()=>unT(t.id)},'↩'),
            h('button',{style:{width:24,height:24,background:'#1e293b',border:'none',borderRadius:6,color:'#f87171',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'},onClick:()=>setCDel(t.id)},h(IC.Trash))))),
        h('button',{style:{position:'fixed',bottom:74,right:'calc(50% - 215px)',width:50,height:50,borderRadius:14,background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',color:'#0c0f1a',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 6px 24px rgba(245,158,11,0.3)',zIndex:90},onClick:()=>setEditing('new')},h(IC.Plus)))
    ),
    // Nav
    h('div',{style:{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,display:'flex',background:'rgba(12,15,26,0.95)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(148,163,184,0.06)',zIndex:100,padding:'5px 0',paddingBottom:'calc(5px + env(safe-area-inset-bottom))'}},
      h('button',{style:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'8px 0',background:'none',border:'none',color:tab==='day'?'#f59e0b':'#475569',cursor:'pointer',fontFamily:F},onClick:()=>setTab('day')},h(IC.Cal),h('span',{style:{fontSize:10,fontWeight:600}},'My Day')),
      h('button',{style:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'8px 0',background:'none',border:'none',color:tab==='admin'?'#f59e0b':'#475569',cursor:'pointer',fontFamily:F},onClick:()=>setTab('admin')},h(IC.Gear),h('span',{style:{fontSize:10,fontWeight:600}},'Manage'))),
    // Modals
    conflict&&h(Confirm,{title:'⚠️ Conflicto',msg:'Nube: '+new Date(conflict.rTs||0).toLocaleString()+'\nLocal: '+new Date(conflict.lTs||0).toLocaleString(),onOk:()=>{applyData(conflict.local);isResolving.current=false;setConflict(null);markDirty()},onNo:()=>{applyData(conflict.remote);isResolving.current=false;setConflict(null)},okLbl:'Local',noLbl:'Nube',okClr:'#f59e0b'}),
    editing!==null&&h(TaskForm,{task:editing==='new'?null:editing,allTasks:tasks,onSave:svT,onClose:()=>setEditing(null)}),
    viewing!==null&&h(DetailSheet,{task:viewing,dispName:dN(viewing),onClose:()=>setViewing(null),onUpdateNotes:n=>{uN(viewing.id,n);setViewing({...viewing,notes:n})}}),
    cEnd&&h(Confirm,{title:'End Day',msg:'Reset progress + inventory?',onOk:endD,onNo:()=>setCEnd(false),okLbl:'Reset',okClr:'#f59e0b'}),
    cDel&&h(Confirm,{title:'Delete',msg:'Delete "'+(tasks.find(t=>t.id===cDel)?.name||'')+'"?',onOk:()=>delT(cDel),onNo:()=>setCDel(null),okLbl:'Delete',okClr:'#ef4444'}),
    showRewardEdit&&h(RewardEditor,{rewards,onSave:r=>{markDirty();setRewards(r);setShowRewardEdit(false)},onClose:()=>setShowRewardEdit(false)}),
    showInv&&h(InventorySheet,{inventory,onClose:()=>setShowInv(false),onRemove:i=>{markDirty();setInventory(p=>p.filter((_,j)=>j!==i))}}));
}

// ═══ REWARD EDITOR ═══
function RewardEditor({rewards,onSave,onClose}){
  const[list,setList]=useState([...rewards]);const[name,setName]=useState('');const[type,setType]=useState('micro');
  const add=()=>{if(!name.trim())return;setList(p=>[...p,{name:name.trim(),type}]);setName('')};
  const inp={width:'100%',padding:'10px 12px',background:'#0f172a',border:'1px solid #334155',borderRadius:8,color:'#e2e8f0',fontSize:13,fontFamily:F,outline:'none',boxSizing:'border-box'};
  return h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16},onClick:onClose},
    h('div',{style:{width:'100%',maxWidth:400,background:'#1e293b',borderRadius:18,padding:'20px 18px',maxHeight:'80vh',overflow:'auto'},onClick:e=>e.stopPropagation()},
      h('h2',{style:{fontSize:16,fontWeight:700,color:'#f8fafc',margin:'0 0 14px'}},'🎁 Bolsa de Recompensas'),
      h('div',{style:{display:'flex',gap:6,marginBottom:10}},
        h('input',{style:{...inp,flex:1},value:name,onChange:e=>setName(e.target.value),placeholder:'Movie, Snack, Game...',onKeyDown:e=>{if(e.key==='Enter')add()}}),
        h('select',{style:{...inp,width:80,WebkitAppearance:'none'},value:type,onChange:e=>setType(e.target.value)},h('option',{value:'micro'},'⚡Micro'),h('option',{value:'macro'},'🌟Macro')),
        h('button',{style:{padding:'8px 14px',background:'linear-gradient(135deg,#a855f7,#7c3aed)',border:'none',borderRadius:8,color:'#fff',fontWeight:700,cursor:'pointer',fontFamily:F},onClick:add},'+')),
      list.map((rw,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:6,padding:'6px 8px',background:'#111827',borderRadius:6,marginBottom:3}},
        h('span',{style:{fontSize:9,padding:'1px 5px',borderRadius:4,background:rw.type==='micro'?'rgba(59,130,246,0.15)':'rgba(168,85,247,0.15)',color:rw.type==='micro'?'#60a5fa':'#c084fc',fontWeight:700}},rw.type==='micro'?'⚡':'🌟'),
        h('span',{style:{flex:1,fontSize:12,color:'#e2e8f0'}},rw.name),
        h('button',{style:{background:'none',border:'none',color:'#f87171',cursor:'pointer',display:'flex'},onClick:()=>setList(p=>p.filter((_,j)=>j!==i))},h(IC.X)))),
      h('div',{style:{display:'flex',gap:8,marginTop:14}},
        h('button',{style:{flex:1,padding:12,background:'#0f172a',border:'1px solid #334155',borderRadius:10,color:'#94a3b8',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:onClose},'Cancel'),
        h('button',{style:{flex:1,padding:12,background:'linear-gradient(135deg,#a855f7,#7c3aed)',border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:()=>onSave(list)},'Save'))));
}

// ═══ INVENTORY ═══
function InventorySheet({inventory,onClose,onRemove}){
  return h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16},onClick:onClose},
    h('div',{style:{width:'100%',maxWidth:400,background:'#1e293b',borderRadius:18,padding:'20px 18px',maxHeight:'70vh',overflow:'auto'},onClick:e=>e.stopPropagation()},
      h('h2',{style:{fontSize:16,fontWeight:700,color:'#f8fafc',margin:'0 0 14px'}},'🎁 Inventory ('+inventory.length+')'),
      inventory.length===0?h('div',{style:{fontSize:13,color:'#475569',textAlign:'center',padding:20}},'Complete goals to earn rewards!'):
      inventory.map((rw,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',background:'#111827',borderRadius:8,marginBottom:4}},
        h('span',{style:{fontSize:18}},rw.type==='micro'?'⚡':'🌟'),
        h('span',{style:{flex:1,fontSize:14,color:'#e2e8f0',fontWeight:600}},rw.name),
        h('button',{style:{padding:'4px 8px',fontSize:10,background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:6,color:'#f87171',cursor:'pointer',fontFamily:F,fontWeight:600},onClick:()=>onRemove(i)},'Used'))),
      h('div',{style:{fontSize:10,color:'#475569',textAlign:'center',marginTop:10,fontStyle:'italic'}},'Resets at End Day'),
      h('button',{style:{width:'100%',padding:12,marginTop:12,background:'#0f172a',border:'1px solid #334155',borderRadius:10,color:'#94a3b8',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:onClose},'Close')));
}

// ═══ DETAIL SHEET ═══
function DetailSheet({task,dispName,onClose,onUpdateNotes}){
  const[notes,setNotes]=useState(task.notes||'');const[dirty,setDirty]=useState(false);const c=CAT[task.category];
  return h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16},onClick:onClose},
    h('div',{style:{width:'100%',maxWidth:420,background:'#1e293b',borderRadius:18,padding:'20px 18px',maxHeight:'80vh',overflow:'auto'},onClick:e=>e.stopPropagation()},
      h('div',{style:{display:'flex',alignItems:'center',gap:6,marginBottom:4}},
        h('span',{style:{fontSize:9,fontWeight:700,padding:'2px 5px',borderRadius:4,border:'1px solid '+c.border,background:c.bg,color:c.text,textTransform:'uppercase'}},c.label),
        task.project&&h('span',{style:{fontSize:11,color:'#64748b'}},task.project),
        (task.isGoal||parentHasGoal(task.id))&&h('span',{style:{fontSize:9,color:'#fbbf24',fontWeight:800}},'🎯')),
      h('h2',{style:{fontSize:16,fontWeight:700,color:'#f8fafc',margin:'6px 0 14px'}},dispName),
      task.timeCondition&&h('div',{style:{fontSize:11,color:'#64748b',marginBottom:6}},task.timeCondition.time),
      task.category==='event'&&toArr(task.eventDates).length>0&&h('div',{style:{fontSize:11,color:'#fb7185',marginBottom:6}},'📅 '+toArr(task.eventDates).join(', ')),
      toArr(task.activeDays).length>0&&toArr(task.activeDays).length<7&&h('div',{style:{display:'flex',gap:3,marginBottom:10}},DAYS.map(d=>h('span',{key:d,style:{fontSize:9,fontWeight:700,padding:'2px 5px',borderRadius:4,background:toArr(task.activeDays).includes(d)?'rgba(251,191,36,0.12)':'transparent',color:toArr(task.activeDays).includes(d)?'#fbbf24':'#334155'}},DL[d]))),
      h('label',{style:{display:'block',fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',marginBottom:4}},'Notes'),
      h('textarea',{style:{width:'100%',padding:'10px 12px',background:'#0f172a',border:'1px solid #334155',borderRadius:8,color:'#e2e8f0',fontSize:13,fontFamily:F,outline:'none',boxSizing:'border-box',minHeight:100,resize:'vertical'},value:notes,onChange:e=>{setNotes(e.target.value);setDirty(true)},placeholder:'Notes...'}),
      h('div',{style:{display:'flex',gap:8,marginTop:14}},
        h('button',{style:{flex:1,padding:12,background:'#0f172a',border:'1px solid #334155',borderRadius:10,color:'#94a3b8',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:onClose},'Close'),
        dirty&&h('button',{style:{flex:1,padding:12,background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',borderRadius:10,color:'#0c0f1a',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:()=>{onUpdateNotes(notes);setDirty(false)}},'Save'))));
}

// ═══ TASK FORM ═══
function TaskForm({task,allTasks,onSave,onClose}){
  const iNS=task&&task._newSub;const isE=!!task&&!iNS;const pId=iNS?task.parentId:(task?.parentId||null);const dCat=iNS?task.category:(task?.category||'core');
  const[nm,setNm]=useState(isE?task.name:'');const[cat,setCat]=useState(dCat);
  const[proj,setProj]=useState(isE?task.project:(pId?allTasks.find(t=>t.id===pId)?.project||'':''));
  const[notes,setNotes]=useState(isE?task.notes:'');const[hasT,setHT]=useState(isE?!!task.timeCondition:false);
  const[time,setTime]=useState(task?.timeCondition?.time||'08:00');
  const[lb,setLb]=useState(task?.timeCondition?.labelBefore||'');const[la,setLa]=useState(task?.timeCondition?.labelAfter||'');
  const[lst,setLst]=useState(task?.timeCondition?.labelSwitchTime||'');
  const[dOv,setDOv]=useState(task?.timeCondition?.dayOverrides||{});
  const[shDOv,setShDOv]=useState(Object.keys(task?.timeCondition?.dayOverrides||{}).length>0);
  const[dep,setDep]=useState(isE?task.dependsOn||'':'');const[ad,setAD]=useState(isE?task.activeDays:[...ALL_DAYS]);
  const[ed,setED]=useState(isE?task.eventDates:[]);const[nd,setND]=useState('');
  const[rm,setRM]=useState(task?.reminderMin||0);const[isG,setIG]=useState(task?.isGoal||false);
  const togD=d=>setAD(p=>p.includes(d)?p.filter(x=>x!==d):[...p,d]);
  const addD=()=>{if(nd&&!ed.includes(nd)){setED(p=>[...p,nd].sort());setND('')}};
  const submit=()=>{if(!nm.trim())return;onSave({...(isE?task:{}),name:nm.trim(),category:cat,project:proj.trim(),notes:notes.trim(),
    timeCondition:hasT?{time,labelBefore:lb.trim()||null,labelAfter:la.trim()||null,labelSwitchTime:lst.trim()||null,dayOverrides:shDOv?dOv:{}}:null,
    dependsOn:dep||null,activeDays:cat==='event'?[]:ad,eventDates:cat==='event'?ed:[],archived:task?.archived||false,reminderMin:parseInt(rm)||0,isGoal:isG,parentId:pId||null})};
  const pjs=[...new Set(allTasks.map(t=>t.project).filter(Boolean))];
  const inp={width:'100%',padding:'10px 12px',background:'#0f172a',border:'1px solid #334155',borderRadius:8,color:'#e2e8f0',fontSize:13,fontFamily:F,outline:'none',boxSizing:'border-box'};
  const lbl={display:'block',fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4,marginTop:14};
  const slbl={display:'block',fontSize:10,fontWeight:600,color:'#64748b',marginBottom:3,marginTop:8};
  return h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16},onClick:onClose},
    h('div',{style:{width:'100%',maxWidth:420,background:'#1e293b',borderRadius:18,padding:'20px 18px',maxHeight:'85vh',overflow:'auto'},onClick:e=>e.stopPropagation()},
      h('h2',{style:{fontSize:16,fontWeight:700,color:'#f8fafc',margin:'0 0 14px'}},isE?'Edit':iNS?'New Sub':'New Task'),
      pId&&h('div',{style:{fontSize:11,color:'#64748b',marginBottom:10}},'↳ '+(allTasks.find(t=>t.id===pId)?.name||'')),
      h('label',{style:lbl},'Name'),h('input',{style:inp,value:nm,onChange:e=>setNm(e.target.value),placeholder:'Name',autoFocus:true}),
      !pId&&h('div',null,h('label',{style:lbl},'Category'),h('select',{style:{...inp,WebkitAppearance:'none'},value:cat,onChange:e=>setCat(e.target.value)},h('option',{value:'core'},'Core'),h('option',{value:'event'},'Event'),h('option',{value:'work'},'Work'),h('option',{value:'personal'},'Personal'))),
      h('label',{style:lbl},'Project'),h('input',{style:inp,value:proj,onChange:e=>setProj(e.target.value),placeholder:'Project',list:'pl'}),h('datalist',{id:'pl'},pjs.map(p=>h('option',{key:p,value:p}))),
      h('label',{style:lbl},'Notes'),h('textarea',{style:{...inp,minHeight:40,resize:'vertical'},value:notes,onChange:e=>setNotes(e.target.value),placeholder:'...'}),
      (cat==='work'||cat==='personal')&&h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:14}},
        h('label',{style:{...lbl,marginTop:0}},'🎯 Daily Goal'),
        h('button',{style:{width:40,height:22,borderRadius:11,border:'none',cursor:'pointer',position:'relative',padding:0,background:isG?'#10b981':'#334155'},onClick:()=>setIG(!isG)},h('div',{style:{width:18,height:18,borderRadius:9,background:'#fff',position:'absolute',top:2,transition:'transform .2s',transform:isG?'translateX(20px)':'translateX(2px)'}}))),
      cat!=='event'&&h('div',null,h('label',{style:lbl},'Days'),h('div',{style:{display:'flex',gap:3,flexWrap:'wrap'}},DAYS.map(d=>h('button',{key:d,onClick:()=>togD(d),style:{padding:'6px 10px',borderRadius:6,fontSize:11,fontWeight:700,fontFamily:F,cursor:'pointer',border:ad.includes(d)?'2px solid #f59e0b':'2px solid #1e293b',background:ad.includes(d)?'rgba(251,191,36,0.12)':'#0f172a',color:ad.includes(d)?'#fbbf24':'#475569'}},DF[d])))),
      cat==='event'&&h('div',null,h('label',{style:lbl},'Dates'),
        h('div',{style:{display:'flex',gap:6,marginBottom:6}},h('input',{type:'date',style:{...inp,flex:1},value:nd,onChange:e=>setND(e.target.value)}),h('button',{style:{padding:'8px 14px',background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',borderRadius:8,color:'#0c0f1a',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:addD},'Add')),
        h('div',{style:{display:'flex',flexWrap:'wrap',gap:4}},ed.map(d=>h('span',{key:d,style:{display:'flex',alignItems:'center',gap:3,fontSize:11,background:'rgba(244,63,94,0.12)',color:'#fb7185',padding:'3px 8px',borderRadius:6,fontWeight:600}},d,h('button',{onClick:()=>setED(p=>p.filter(x=>x!==d)),style:{background:'none',border:'none',color:'#fb7185',cursor:'pointer',padding:0,display:'flex'}},h(IC.X)))),ed.length===0&&h('span',{style:{fontSize:11,color:'#475569',fontStyle:'italic'}},'No dates')),
        h('label',{style:{...lbl,marginTop:10}},'Reminder'),h('select',{style:{...inp,WebkitAppearance:'none'},value:rm,onChange:e=>setRM(e.target.value)},h('option',{value:0},'None'),h('option',{value:5},'5m'),h('option',{value:10},'10m'),h('option',{value:15},'15m'),h('option',{value:30},'30m'),h('option',{value:60},'1h'))),
      h('label',{style:lbl},'Depends On'),h('select',{style:{...inp,WebkitAppearance:'none'},value:dep,onChange:e=>setDep(e.target.value)},h('option',{value:''},'None'),allTasks.filter(t=>t.id!==(isE?task.id:null)).map(t=>h('option',{key:t.id,value:t.id},t.name+' ('+CAT[t.category]?.label+')'))),
      h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:14}},
        h('label',{style:{...lbl,marginTop:0}},'Time'),
        h('button',{style:{width:40,height:22,borderRadius:11,border:'none',cursor:'pointer',position:'relative',padding:0,background:hasT?'#f59e0b':'#334155'},onClick:()=>setHT(!hasT)},h('div',{style:{width:18,height:18,borderRadius:9,background:'#fff',position:'absolute',top:2,transition:'transform .2s',transform:hasT?'translateX(20px)':'translateX(2px)'}}))),
      hasT&&h('div',{style:{background:'#0f172a',borderRadius:10,padding:'6px 12px 12px',marginTop:6}},
        h('label',{style:slbl},'Default time'),h('input',{type:'time',style:inp,value:time,onChange:e=>setTime(e.target.value)}),
        h('label',{style:slbl},'Before label'),h('input',{style:inp,value:lb,onChange:e=>setLb(e.target.value),placeholder:'Optional'}),
        h('label',{style:slbl},'After label'),h('input',{style:inp,value:la,onChange:e=>setLa(e.target.value),placeholder:'Optional'}),
        (lb||la)&&h('div',null,h('label',{style:slbl},'Switch name at'),h('input',{type:'time',style:inp,value:lst,onChange:e=>setLst(e.target.value)})),
        h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:10}},
          h('label',{style:{fontSize:10,fontWeight:700,color:'#64748b'}},'Per-day times'),
          h('button',{style:{width:36,height:18,borderRadius:9,border:'none',cursor:'pointer',position:'relative',padding:0,background:shDOv?'#3b82f6':'#334155'},onClick:()=>setShDOv(!shDOv)},h('div',{style:{width:14,height:14,borderRadius:7,background:'#fff',position:'absolute',top:2,transition:'transform .2s',transform:shDOv?'translateX(20px)':'translateX(2px)'}}))),
        shDOv&&h('div',{style:{marginTop:6,display:'flex',flexDirection:'column',gap:3}},DAYS.filter(d=>ad.includes(d)).map(d=>h('div',{key:d,style:{display:'flex',alignItems:'center',gap:6}},h('span',{style:{fontSize:11,color:'#94a3b8',width:28}},DF[d]),h('input',{type:'time',style:{...inp,flex:1,padding:'6px 8px',fontSize:11},value:dOv[d]||'',onChange:e=>{const v=e.target.value;setDOv(p=>v?{...p,[d]:v}:(()=>{const n={...p};delete n[d];return n})())},placeholder:time}))))),
      h('div',{style:{display:'flex',gap:8,marginTop:20}},
        h('button',{style:{flex:1,padding:12,background:'#0f172a',border:'1px solid #334155',borderRadius:10,color:'#94a3b8',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:onClose},'Cancel'),
        h('button',{style:{flex:1,padding:12,background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',borderRadius:10,color:'#0c0f1a',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:submit,disabled:!nm.trim()},isE?'Save':'Add'))));
}

// ═══ CONFIRM ═══
function Confirm({title,msg,onOk,onNo,okLbl,noLbl,okClr}){
  return h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16},onClick:onNo},
    h('div',{style:{width:'100%',maxWidth:320,background:'#1e293b',borderRadius:18,padding:'20px 18px'},onClick:e=>e.stopPropagation()},
      h('h2',{style:{fontSize:16,fontWeight:700,color:'#f8fafc',margin:'0 0 16px'}},title),
      h('p',{style:{fontSize:13,color:'#94a3b8',lineHeight:1.5,margin:'0 0 16px',whiteSpace:'pre-line'}},msg),
      h('div',{style:{display:'flex',gap:8}},
        h('button',{style:{flex:1,padding:12,background:'#0f172a',border:'1px solid #334155',borderRadius:10,color:'#94a3b8',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:onNo},noLbl||'Cancel'),
        h('button',{style:{flex:1,padding:12,background:okClr,border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:onOk},okLbl))));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
