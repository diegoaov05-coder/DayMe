// ═══ FIREBASE ═══
firebase.initializeApp({
  apiKey:"AIzaSyAfMcI-3cIwWz1AlrkmisqNuZvcJ7wUfP4",
  authDomain:"dayone-14927.firebaseapp.com",
  databaseURL:"https://dayone-14927-default-rtdb.firebaseio.com",
  projectId:"dayone-14927",
  storageBucket:"dayone-14927.firebasestorage.app",
  messagingSenderId:"775317638738",
  appId:"1:775317638738:web:46bd112241356da613198b"
});
const db=firebase.database(),dataRef=db.ref('routineApp');
let swReg=null;
if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').then(r=>{swReg=r}).catch(()=>{});
function ntfy(title,body,tag){
  if(swReg)try{swReg.showNotification(title,{body,tag:tag||'md',renotify:true,vibrate:[200,100,200,100,200],requireInteraction:true})}catch(e){}
  else if('Notification' in window&&Notification.permission==='granted')try{new Notification(title,{body,tag:tag||'md'})}catch(e){}
}

const LK='routine-sync-v5';
const DAYS=['sun','mon','tue','wed','thu','fri','sat'];
const DF={sun:'Sun',mon:'Mon',tue:'Tue',wed:'Wed',thu:'Thu',fri:'Fri',sat:'Sat'};
const DL={sun:'S',mon:'M',tue:'T',wed:'W',thu:'T',fri:'F',sat:'S'};
const ALL_DAYS=[...DAYS];
const getDow=()=>DAYS[new Date().getDay()];
const getISO=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const getHM=()=>{const d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const toM=t=>{if(!t)return 0;const p=t.split(':').map(Number);return p[0]*60+p[1]};
const gid=()=>'t'+Date.now()+Math.random().toString(36).slice(2,6);
const sL=d=>{try{localStorage.setItem(LK,JSON.stringify(d))}catch(e){}};
const lL=()=>{try{const s=localStorage.getItem(LK);return s?JSON.parse(s):null}catch(e){return null}};
const autoArc=tasks=>{const td=getISO();return(tasks||[]).map(t=>t.category==='event'&&!t.archived&&t.eventDates&&t.eventDates.length>0&&t.eventDates.every(d=>d<td)?{...t,archived:true}:t)};

// Per-day time override helper
function getActTime(task,dow){
  if(!task.timeCondition)return null;
  const ov=task.timeCondition.dayOverrides;
  if(ov&&ov[dow])return ov[dow];
  return task.timeCondition.time;
}

const SEED=[
  {id:'t1',name:'Desayuno',category:'core',project:'',notes:'',timeCondition:{time:'07:20',labelBefore:null,labelAfter:null,labelSwitchTime:null,dayOverrides:{}},dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:0,reminderMin:0,isGoal:false,parentId:null},
  {id:'t2',name:'Almuerzo',category:'core',project:'',notes:'',timeCondition:{time:'12:30',labelBefore:null,labelAfter:null,labelSwitchTime:null,dayOverrides:{}},dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:1,reminderMin:0,isGoal:false,parentId:null},
  {id:'t3',name:'Cena',category:'core',project:'',notes:'',timeCondition:{time:'20:00',labelBefore:null,labelAfter:null,labelSwitchTime:null,dayOverrides:{}},dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:2,reminderMin:0,isGoal:false,parentId:null},
  {id:'t4',name:'Completar PPT mina Mutún',category:'work',project:'Mutún Mining',notes:'',timeCondition:null,dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:3,reminderMin:0,isGoal:false,parentId:null},
  {id:'t5',name:'Revisar plataforma TIKR',category:'work',project:'Research',notes:'',timeCondition:null,dependsOn:null,activeDays:['mon','wed','fri'],eventDates:[],archived:false,order:4,reminderMin:0,isGoal:false,parentId:null},
  {id:'t6',name:'Repaso CFA',category:'personal',project:'CFA Level I',notes:'',timeCondition:null,dependsOn:null,activeDays:['mon','tue','wed','thu','fri'],eventDates:[],archived:false,order:5,reminderMin:0,isGoal:false,parentId:null},
  {id:'t7',name:'Ruta Nuzlocke en Cobblemon',category:'personal',project:'Gaming',notes:'',timeCondition:null,dependsOn:null,activeDays:['sat','sun'],eventDates:[],archived:false,order:6,reminderMin:0,isGoal:false,parentId:null},
  {id:'t8',name:'Reunión equipo Mutún',category:'event',project:'Mutún Mining',notes:'Sala 3B',timeCondition:{time:'10:00',labelBefore:null,labelAfter:null,labelSwitchTime:null,dayOverrides:{}},dependsOn:null,activeDays:[],eventDates:[getISO()],archived:false,order:7,reminderMin:30,isGoal:false,parentId:null},
];

const CAT={
  core:{bg:'rgba(251,191,36,0.12)',border:'#f59e0b',text:'#fbbf24',label:'Core'},
  event:{bg:'rgba(244,63,94,0.12)',border:'#f43f5e',text:'#fb7185',label:'Event'},
  work:{bg:'rgba(59,130,246,0.12)',border:'#3b82f6',text:'#60a5fa',label:'Work'},
  personal:{bg:'rgba(168,85,247,0.12)',border:'#a855f7',text:'#c084fc',label:'Personal'},
};

const h=React.createElement;
const{useState,useEffect,useCallback,useRef}=React;

function icon(paths,w){w=w||16;return()=>h('svg',{width:w,height:w,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'},...paths.map(p=>typeof p==='string'?h('path',{d:p}):h(p[0],p[1])))}
const IC={
  Sun:icon([['circle',{cx:12,cy:12,r:5}],['line',{x1:12,y1:1,x2:12,y2:3}],['line',{x1:12,y1:21,x2:12,y2:23}],['line',{x1:4.22,y1:4.22,x2:5.64,y2:5.64}],['line',{x1:18.36,y1:18.36,x2:19.78,y2:19.78}],['line',{x1:1,y1:12,x2:3,y2:12}],['line',{x1:21,y1:12,x2:23,y2:12}],['line',{x1:4.22,y1:19.78,x2:5.64,y2:18.36}],['line',{x1:18.36,y1:5.64,x2:19.78,y2:4.22}]],20),
  Brief:icon([['rect',{x:2,y:7,width:20,height:14,rx:2}],'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],20),
  Cal:icon([['rect',{x:3,y:4,width:18,height:18,rx:2}],['line',{x1:16,y1:2,x2:16,y2:6}],['line',{x1:8,y1:2,x2:8,y2:6}],['line',{x1:3,y1:10,x2:21,y2:10}]],20),
  Gear:icon([['circle',{cx:12,cy:12,r:3}],'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'],20),
  Plus:()=>h('svg',{width:24,height:24,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.5,strokeLinecap:'round'},h('line',{x1:12,y1:5,x2:12,y2:19}),h('line',{x1:5,y1:12,x2:19,y2:12})),
  Edit:icon(['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z']),
  Trash:icon([['polyline',{points:'3 6 5 6 21 6'}],'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2']),
  Lock:icon([['rect',{x:3,y:11,width:18,height:11,rx:2}],'M7 11V7a5 5 0 0 1 10 0v4'],14),
  Clock:icon([['circle',{cx:12,cy:12,r:10}],['polyline',{points:'12 6 12 12 16 14'}]],14),
  Check:()=>h('svg',{width:18,height:18,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:3,strokeLinecap:'round',strokeLinejoin:'round'},h('polyline',{points:'20 6 9 17 4 12'})),
  CheckBig:()=>h('svg',{width:28,height:28,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:3,strokeLinecap:'round',strokeLinejoin:'round'},h('polyline',{points:'20 6 9 17 4 12'})),
  X:()=>h('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.5,strokeLinecap:'round',strokeLinejoin:'round'},h('line',{x1:18,y1:6,x2:6,y2:18}),h('line',{x1:6,y1:6,x2:18,y2:18})),
  Up:()=>h('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.5,strokeLinecap:'round',strokeLinejoin:'round'},h('polyline',{points:'18 15 12 9 6 15'})),
  Down:()=>h('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.5,strokeLinecap:'round',strokeLinejoin:'round'},h('polyline',{points:'6 9 12 15 18 9'})),
  Moon:icon(['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'],18),
  Focus:()=>h('svg',{width:22,height:22,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'},h('circle',{cx:12,cy:12,r:10}),h('circle',{cx:12,cy:12,r:6}),h('circle',{cx:12,cy:12,r:2})),
  Bell:icon(['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0']),
  BellOff:icon(['M13.73 21a2 2 0 0 1-3.46 0','M18.63 13A17.89 17.89 0 0 1 18 8','M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14',['line',{x1:1,y1:1,x2:23,y2:23}]]),
  Note:icon(['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',['polyline',{points:'14 2 14 8 20 8'}],['line',{x1:16,y1:13,x2:8,y2:13}],['line',{x1:16,y1:17,x2:8,y2:17}]],14),
  Archive:icon([['polyline',{points:'21 8 21 21 3 21 3 8'}],['rect',{x:1,y:3,width:22,height:5}],['line',{x1:10,y1:12,x2:14,y2:12}]],14),
  Copy:icon([['rect',{x:9,y:9,width:13,height:13,rx:2}],'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1']),
  Pause:icon([['rect',{x:6,y:4,width:4,height:16}],['rect',{x:14,y:4,width:4,height:16}]]),
  Grip:()=>h('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'currentColor',stroke:'none'},h('circle',{cx:8,cy:4,r:2}),h('circle',{cx:16,cy:4,r:2}),h('circle',{cx:8,cy:12,r:2}),h('circle',{cx:16,cy:12,r:2}),h('circle',{cx:8,cy:20,r:2}),h('circle',{cx:16,cy:20,r:2})),
  Zap:icon(['M13 2L3 14h9l-1 10 10-12h-9l1-10'],16),
  Sub:icon([['polyline',{points:'9 18 15 12 9 6'}]],12),
};
const F="'SF Pro Display',-apple-system,'Segoe UI',sans-serif";

// ═══ CSS ANIMATIONS ═══
if(!document.getElementById('cCSS')){const s=document.createElement('style');s.id='cCSS';s.textContent='@keyframes popIn{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes cbPulse{0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}.cb-pulse{animation:cbPulse .3s ease-out}@keyframes goalBg{0%{opacity:0}50%{opacity:1}100%{opacity:0}}@keyframes confetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-120px) rotate(720deg);opacity:0}}';document.head.appendChild(s)}

// ═══ CELEBRATION ═══
function Celebration({text,big,onDone}){
  const[op,setOp]=useState(0);
  useEffect(()=>{setOp(1);const dur=big?3500:1600;const t=setTimeout(()=>{setOp(0);setTimeout(onDone,400)},dur);return()=>clearTimeout(t)},[]);
  const confetti=big?Array.from({length:20},(_,i)=>({l:10+Math.random()*80,d:Math.random()*2+1,c:['#f59e0b','#10b981','#3b82f6','#a855f7','#f43f5e','#fbbf24','#34d399'][i%7],sz:4+Math.random()*6})):[];
  return h('div',{style:{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:999,pointerEvents:'none',transition:'opacity .4s',opacity:op,background:big?'radial-gradient(circle,rgba(251,191,36,0.2),transparent)':'none'}},
    confetti.map((c,i)=>h('div',{key:i,style:{position:'absolute',left:c.l+'%',bottom:'30%',width:c.sz,height:c.sz,borderRadius:c.sz>7?'50%':'2px',background:c.c,animation:'confetti '+c.d+'s ease-out '+(i*80)+'ms both'}})),
    h('div',{style:{textAlign:'center',position:'relative'}},
      h('div',{style:{fontSize:big?80:48,animation:'popIn .4s cubic-bezier(.175,.885,.32,1.275) forwards'}},big?'🏆':'✅'),
      h('div',{style:{fontSize:big?32:20,fontWeight:900,color:big?'#fbbf24':'#10b981',textShadow:'0 0 40px '+(big?'rgba(251,191,36,0.8)':'rgba(16,185,129,0.5)'),animation:'popIn .5s .15s cubic-bezier(.175,.885,.32,1.275) both',fontFamily:F,letterSpacing:'-0.02em',marginTop:big?16:8}},text),
      big&&h('div',{style:{fontSize:16,color:'#94a3b8',marginTop:12,animation:'popIn .5s .3s both',fontFamily:F}},'Daily goal completed!')));
}

// ═══ MAIN APP ═══
function App(){
  const savedMode=localStorage.getItem('myday-mode');
  const[tasks,setTasks]=useState([]);
  const[comp,setComp]=useState({});
  const[skip,setSkip]=useState({});
  const[hold,setHold]=useState({}); // {taskId: expireTimestamp}
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
  const[celeb,setCeleb]=useState(null);
  const[celebBig,setCelebBig]=useState(false);
  const[collCats,setCollCats]=useState({});
  const[justDone,setJustDone]=useState(null);
  const[focusProj,setFocusProj]=useState(null); // focus mode project
  const[showFocus,setShowFocus]=useState(false);
  // Drag state for manage reorder
  const[dragId,setDragId]=useState(null);
  const[dragOverId,setDragOverId]=useState(null);
  const dragY=useRef(null);

  const ntfSet=useRef(new Set());
  const remSet=useRef(new Set());
  const initDone=useRef(false);
  const skipFB=useRef(false);
  const isResolving=useRef(true);
  const isDirty=useRef(false);
  const markDirty=()=>{isDirty.current=true};

  // Save mode preference
  useEffect(()=>{localStorage.setItem('myday-mode',mode)},[mode]);

  const applyData=d=>{
    setTasks(autoArc(d.tasks||[]));setComp(d.completed||{});setSkip(d.skipped||{});
    if(d.hold)setHold(d.hold);
    if(d.notified)ntfSet.current=new Set(d.notified);sL(d);setLoading(false);
  };

  // ═══ INIT ═══
  useEffect(()=>{
    if(initDone.current)return;initDone.current=true;
    const local=lL();const lTs=local?.ts||0;
    dataRef.once('value').then(snap=>{
      const remote=snap.val();const rTs=remote?.ts||0;
      if(remote&&local&&lTs>0&&rTs>0&&Math.abs(lTs-rTs)>10000){
        setConflict({local,remote,lTs,rTs});setLoading(false);
      }else if(remote&&rTs>=lTs){
        applyData(remote);isResolving.current=false;
      }else if(local&&lTs>rTs){
        applyData(local);isResolving.current=false;markDirty();
      }else{
        const sd={tasks:SEED,completed:{},skipped:{},hold:{},notified:[],ts:Date.now()};
        applyData(sd);isResolving.current=false;markDirty();
      }
      dataRef.on('value',rSnap=>{
        if(skipFB.current||isResolving.current){skipFB.current=false;return}
        const v=rSnap.val();if(v&&v.ts>(lL()?.ts||0))applyData(v);
      });
    }).catch(()=>{
      if(local)applyData(local);else{const sd={tasks:SEED,completed:{},skipped:{},hold:{},notified:[],ts:Date.now()};applyData(sd);}
      isResolving.current=false;
    });
    try{db.ref('.info/connected').on('value',s=>{setSynced(!!s.val())})}catch(e){}
    if('Notification' in window&&Notification.permission==='granted')setNOn(true);
  },[]);

  // ═══ SAVE ═══
  useEffect(()=>{
    if(loading||tasks.length===0||isResolving.current||!isDirty.current)return;
    isDirty.current=false;
    const d={tasks,completed:comp,skipped:skip,hold,notified:[...ntfSet.current],ts:Date.now()};
    sL(d);skipFB.current=true;try{dataRef.update(d)}catch(e){}
  },[tasks,comp,skip,hold,loading]);

  // ═══ HOLD EXPIRY CHECK ═══
  useEffect(()=>{
    const iv=setInterval(()=>{
      const now=Date.now();let changed=false;
      setHold(prev=>{
        const next={...prev};
        Object.keys(next).forEach(k=>{if(next[k]<=now){delete next[k];changed=true}});
        return changed?next:prev;
      });
      if(changed)markDirty();
    },10000);
    return()=>clearInterval(iv);
  },[]);

  // ═══ CLOCK + NOTIFS ═══
  useEffect(()=>{
    const tick=()=>{
      const t=getHM();setCt(t);if(!nOn)return;
      const nm=toM(t),td=getISO(),dw=getDow();
      tasks.forEach(tk=>{
        if(tk.archived||!tk.timeCondition)return;
        if(comp[tk.id]||skip[tk.id])return;
        const actT=getActTime(tk,dw);if(!actT)return;
        // Event reminder
        if(tk.category==='event'&&(tk.reminderMin||0)>0&&(tk.eventDates||[]).includes(td)){
          const tMin=toM(actT);const remMin=tMin-(tk.reminderMin||0);const rk=tk.id+'_r';
          if(nm>=remMin&&nm<tMin&&!remSet.current.has(rk)){
            ntfy('📅 '+tk.name+' en '+tk.reminderMin+'min',actT,rk);
            setBanner(tk.name+' en '+tk.reminderMin+'min');setTimeout(()=>setBanner(null),5000);
            remSet.current.add(rk);
          }
        }
        if(tk.category!=='core'&&tk.category!=='event')return;
        if(ntfSet.current.has(tk.id))return;
        if(tk.category==='core'&&!(tk.activeDays||[]).includes(dw))return;
        if(tk.category==='event'&&!(tk.eventDates||[]).includes(td))return;
        const tMin=toM(actT);
        if(nm>=tMin&&nm<=tMin+2){
          ntfy(tk.category==='event'?'📅 Event':'⏰ Core',tk.name,tk.id);
          setBanner(tk.name);setTimeout(()=>setBanner(null),5000);
          ntfSet.current.add(tk.id);
        }
      });
    };
    tick();const iv=setInterval(tick,10000);
    const onVis=()=>{if(!document.hidden)tick()};
    document.addEventListener('visibilitychange',onVis);
    return()=>{clearInterval(iv);document.removeEventListener('visibilitychange',onVis)};
  },[tasks,comp,skip,nOn]);

  const rqN=async()=>{
    if(!('Notification' in window)){setBanner('Not supported');setTimeout(()=>setBanner(null),3000);return}
    const p=await Notification.requestPermission();
    if(p==='granted'){setNOn(true);ntfy('🔔','Notifications on')}else{setBanner('Denied');setTimeout(()=>setBanner(null),3000)}
  };

  // ═══ LOGIC ═══
  const resolved=useCallback(id=>!!comp[id]||!!skip[id],[comp,skip]);
  const isHeld=useCallback(id=>hold[id]&&hold[id]>Date.now(),[hold]);
  const td=getISO(),dw=getDow();
  const isAct=useCallback(t=>{if(t.archived)return false;if(t.category==='event')return(t.eventDates||[]).includes(td);return(t.activeDays||ALL_DAYS).includes(dw)},[td,dw]);
  const ceT=tasks.filter(t=>(t.category==='core'||t.category==='event')&&isAct(t));

  const tOk=useCallback(t=>{
    if(!t.timeCondition)return true;
    const actT=getActTime(t,dw);
    return!actT||toM(ct)>=toM(actT);
  },[ct,dw]);

  const dOk=useCallback(tk=>{
    if(tk.dependsOn&&!resolved(tk.dependsOn))return false;
    if(tk.category==='work'||tk.category==='personal')if(ceT.filter(c=>tOk(c)&&!resolved(c.id)&&!isHeld(c.id)).length>0)return false;
    return true;
  },[resolved,ceT,tOk,isHeld]);
  const isUL=useCallback(t=>{
    if(isHeld(t.id))return false;
    return tOk(t)&&dOk(t);
  },[tOk,dOk,isHeld]);

  const dN=useCallback(t=>{
    if(!t.timeCondition)return t.name;
    const tc=t.timeCondition;
    if(tc.labelSwitchTime&&tc.labelBefore&&tc.labelAfter)return toM(ct)>=toM(tc.labelSwitchTime)?tc.labelAfter:tc.labelBefore;
    return t.name;
  },[ct]);

  const bW=useCallback(tk=>{
    const r=[];
    if(isHeld(tk.id)){const min=Math.ceil((hold[tk.id]-Date.now())/60000);r.push('⏸ Hold '+min+'min');return r}
    const actT=getActTime(tk,dw);
    if(tk.timeCondition&&actT&&toM(ct)<toM(actT))r.push(actT);
    if(tk.dependsOn&&!resolved(tk.dependsOn)){const p=tasks.find(x=>x.id===tk.dependsOn);if(p)r.push('After: '+p.name)}
    if(tk.category==='work'||tk.category==='personal'){const pn=ceT.filter(c=>tOk(c)&&!resolved(c.id)&&!isHeld(c.id));if(pn.length)r.push('Pending: '+pn.map(c=>c.name).join(', '))}
    return r;
  },[tOk,resolved,tasks,ceT,ct,dw,hold,isHeld]);

  // Goal check
  const checkGoal=(taskId,cat)=>{
    const catT=tasks.filter(t=>!t.archived&&isAct(t)&&t.category===cat).sort((a,b)=>a.order-b.order);
    const goal=catT.find(t=>t.isGoal);
    if(!goal)return;
    const idx=catT.indexOf(goal);
    const upTo=catT.slice(0,idx+1);
    if(upTo.every(t=>t.id===taskId||resolved(t.id))&&taskId===goal.id){
      setCeleb('🎯 ¡META CUMPLIDA!');setCelebBig(true);
    }
  };

  // ═══ ACTIONS ═══
  const doC=id=>{
    markDirty();const was=!!comp[id];
    setComp(p=>{const n={...p};n[id]?delete n[id]:(n[id]=true);return n});
    setSkip(p=>{const n={...p};delete n[id];return n});
    if(!was){setJustDone(id);setTimeout(()=>setJustDone(null),400);
      setCeleb('Done!');setCelebBig(false);
      const tk=tasks.find(t=>t.id===id);if(tk)checkGoal(id,tk.category);
    }
  };
  const doS=id=>{markDirty();setSkip(p=>{const n={...p};n[id]?delete n[id]:(n[id]=true);return n});setComp(p=>{const n={...p};delete n[id];return n})};
  const doHold=(id,minutes)=>{markDirty();setHold(p=>({...p,[id]:Date.now()+minutes*60000}))};
  const endD=()=>{markDirty();setComp({});setSkip({});setHold({});setCEnd(false);ntfSet.current.clear();remSet.current.clear()};
  const delT=id=>{markDirty();
    // Also delete subtasks
    const subs=tasks.filter(t=>t.parentId===id).map(t=>t.id);
    const allDel=[id,...subs];
    setTasks(p=>p.filter(t=>!allDel.includes(t.id)).map(t=>t.dependsOn&&allDel.includes(t.dependsOn)?{...t,dependsOn:null}:t));
    allDel.forEach(did=>{setComp(p=>{const n={...p};delete n[did];return n});setSkip(p=>{const n={...p};delete n[did];return n})});
    setCDel(null);
  };
  const svT=td=>{markDirty();if(td.id)setTasks(p=>p.map(t=>t.id===td.id?td:t));else setTasks(p=>[...p,{...td,id:gid(),order:p.length}]);setEditing(null)};
  const uN=(id,notes)=>{markDirty();setTasks(p=>p.map(t=>t.id===id?{...t,notes}:t))};
  const arT=id=>{markDirty();setTasks(p=>p.map(t=>t.id===id?{...t,archived:true}:t))};
  const unT=id=>{markDirty();setTasks(p=>p.map(t=>t.id===id?{...t,archived:false}:t))};
  const dupT=id=>{markDirty();setTasks(p=>{const t=p.find(x=>x.id===id);if(!t)return p;return[...p,{...t,id:gid(),name:t.name+' (copy)',order:p.length,parentId:t.parentId}]})};

  // Drag-and-drop reorder within same category
  const handleDragStart=(id,cat)=>{setDragId(id)};
  const handleDragOver=(e,id)=>{e.preventDefault();setDragOverId(id)};
  const handleDrop=(targetId,cat)=>{
    if(!dragId||dragId===targetId){setDragId(null);setDragOverId(null);return}
    markDirty();
    setTasks(prev=>{
      const catTasks=prev.filter(t=>t.category===cat&&!t.archived);
      const otherTasks=prev.filter(t=>t.category!==cat||t.archived);
      const fromIdx=catTasks.findIndex(t=>t.id===dragId);
      const toIdx=catTasks.findIndex(t=>t.id===targetId);
      if(fromIdx<0||toIdx<0)return prev;
      // If dragging a parent, move its children too
      const dragTask=catTasks[fromIdx];
      let movingIds=[dragId];
      if(!dragTask.parentId)movingIds=[...movingIds,...catTasks.filter(t=>t.parentId===dragId).map(t=>t.id)];
      const moving=catTasks.filter(t=>movingIds.includes(t.id));
      const remaining=catTasks.filter(t=>!movingIds.includes(t.id));
      const insertAt=remaining.findIndex(t=>t.id===targetId);
      remaining.splice(insertAt<0?remaining.length:insertAt,0,...moving);
      return[...remaining.map((t,i)=>({...t,order:i})),...otherTasks];
    });
    setDragId(null);setDragOverId(null);
  };

  // Touch drag
  const touchStart=useRef(null);
  const handleTouchStart=(e,id)=>{touchStart.current={id,y:e.touches[0].clientY,el:e.currentTarget};setDragId(id)};
  const handleTouchMove=(e,cat)=>{
    if(!dragId)return;
    const y=e.touches[0].clientY;
    const els=document.querySelectorAll('[data-cat="'+cat+'"]');
    els.forEach(el=>{
      const r=el.getBoundingClientRect();
      if(y>r.top&&y<r.bottom){const tid=el.getAttribute('data-tid');if(tid)setDragOverId(tid)}
    });
  };
  const handleTouchEnd=(cat)=>{
    if(dragId&&dragOverId)handleDrop(dragOverId,cat);
    else{setDragId(null);setDragOverId(null)}
    touchStart.current=null;
  };

  // Computed
  const parentTasks=t=>t.filter(x=>!x.parentId);
  const childrenOf=(t,pid)=>t.filter(x=>x.parentId===pid);

  // Day tasks: include subtasks, filter by focus mode
  let dayT=tasks.filter(t=>{
    if(t.archived||!isAct(t))return false;
    // Parents that are groups (have children) don't show as tasks themselves in day view
    const hasChildren=tasks.some(c=>c.parentId===t.id&&!c.archived);
    if(hasChildren)return false;
    if(t.category==='core'||t.category==='event')return true;
    if(t.category!==mode)return false;
    if(focusProj&&t.project!==focusProj)return false;
    return true;
  }).sort((a,b)=>{
    const at=a.timeCondition?toM(getActTime(a,dw)||'23:59'):9999;
    const bt=b.timeCondition?toM(getActTime(b,dw)||'23:59'):9999;
    return at!==bt?at-bt:a.order-b.order;
  });

  const todayEvents=dayT.filter(t=>t.category==='event');
  const nonEvents=dayT.filter(t=>t.category!=='event');
  const nxt=nonEvents.find(t=>!resolved(t.id)&&isUL(t));
  const rest=nxt?nonEvents.filter(t=>t.id!==nxt.id):nonEvents;
  const rCnt=dayT.filter(t=>resolved(t.id)).length;
  const pct=dayT.length?rCnt/dayT.length:0;
  const actTasks=tasks.filter(t=>!t.archived),arcTasks=tasks.filter(t=>t.archived);
  const grp={core:[],event:[],work:[],personal:[]};actTasks.filter(t=>!t.parentId).forEach(t=>{if(grp[t.category])grp[t.category].push(t)});

  // Projects list for focus mode
  const projects=[...new Set(tasks.filter(t=>t.project&&(t.category==='work'||t.category==='personal')).map(t=>t.project))];

  if(loading)return h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',background:'#0c0f1a'}},h('p',{style:{color:'#94a3b8'}},'Loading...'));

// ═══ RENDER TASK CARD (Day view) ═══
  const rCard=task=>{
    const done=!!comp[task.id],isSk=!!skip[task.id],rs=done||isSk,u=isUL(task),hld=isHeld(task.id);
    const reasons=bW(task),name=dN(task),c=CAT[task.category];
    const canSk=u&&!rs;
    const isG=task.isGoal;
    const pulsing=justDone===task.id;
    const parent=task.parentId?tasks.find(t=>t.id===task.parentId):null;
    return h('div',{key:task.id,style:{display:'flex',alignItems:'flex-start',gap:12,padding:task.parentId?'10px 14px 10px 28px':'12px 14px',background:isG?'linear-gradient(135deg,rgba(16,185,129,0.06),rgba(251,191,36,0.04))':'#111827',borderRadius:12,borderLeft:'3px solid '+c.border,cursor:'pointer',opacity:rs?0.45:(!u&&!rs?0.4:1),transition:'opacity .2s'},onClick:()=>setViewing(task)},
      h('button',{className:pulsing?'cb-pulse':'',style:{width:32,height:32,borderRadius:9,border:done?'2px solid #10b981':isSk?'2px solid #475569':hld?'2px solid #f59e0b':!u&&!rs?'2px solid #1e293b':'2px solid #334155',background:done?'linear-gradient(135deg,#10b981,#059669)':isSk?'rgba(100,116,139,0.3)':hld?'rgba(245,158,11,0.15)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:!u&&!rs&&!hld?'not-allowed':'pointer',flexShrink:0,color:done?'#fff':isSk?'#94a3b8':hld?'#f59e0b':'transparent',transition:'all .2s'},onClick:e=>{e.stopPropagation();if(hld)return;(u||rs)&&doC(task.id)},disabled:!u&&!rs&&!hld},
        done&&h(IC.Check),isSk&&h(IC.X),hld&&h(IC.Pause),!u&&!rs&&!hld&&h(IC.Lock)),
      h('div',{style:{flex:1,minWidth:0}},
        parent&&h('div',{style:{fontSize:10,color:'#475569',marginBottom:2}},'↳ '+parent.name),
        h('div',{style:{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}},
          h('span',{style:{fontSize:14,fontWeight:600,color:done||isSk?'#64748b':hld?'#f59e0b':!u&&!rs?'#475569':'#e2e8f0',textDecoration:done||isSk?'line-through':'none',fontStyle:isSk?'italic':'normal'}},name),
          !task.parentId&&h('span',{style:{fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:5,border:'1px solid '+c.border,background:c.bg,color:c.text,textTransform:'uppercase'}},c.label),
          isG&&h('span',{style:{fontSize:10,fontWeight:800,color:'#fbbf24',background:'linear-gradient(135deg,rgba(251,191,36,0.15),rgba(16,185,129,0.1))',padding:'2px 8px',borderRadius:6,border:'1px solid rgba(251,191,36,0.3)'}},'🎯 META'),
          task.notes&&h('span',{style:{color:'#475569',display:'flex'}},h(IC.Note))),
        task.project&&!task.parentId&&h('div',{style:{fontSize:11,color:'#64748b',marginTop:2}},task.project),
        !u&&!rs&&reasons.length>0&&h('div',{style:{display:'flex',flexDirection:'column',gap:2,marginTop:4}},reasons.map((r,i)=>h('span',{key:i,style:{display:'flex',alignItems:'center',gap:4,fontSize:10,color:hld?'#f59e0b':'#64748b'}},h(IC.Clock),' ',r))),
        isSk&&h('span',{style:{display:'inline-block',marginTop:3,fontSize:10,fontWeight:600,color:'#64748b',fontStyle:'italic'}},'Skipped')),
      h('div',{style:{display:'flex',gap:4,flexShrink:0,alignItems:'center'}},
        canSk&&h('button',{style:{width:28,height:28,borderRadius:7,border:'1px solid rgba(100,116,139,0.3)',background:'rgba(100,116,139,0.1)',color:'#64748b',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:10},onClick:e=>{e.stopPropagation();doS(task.id)},title:'Skip'},h(IC.X)),
        canSk&&!hld&&h('button',{style:{width:28,height:28,borderRadius:7,border:'1px solid rgba(245,158,11,0.3)',background:'rgba(245,158,11,0.1)',color:'#f59e0b',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:10},onClick:e=>{e.stopPropagation();doHold(task.id,60)},title:'Hold 1h'},h(IC.Pause))));
  };

  // ═══ EVENT CARD ═══
  const rEvent=task=>{
    const done=!!comp[task.id],isSk=!!skip[task.id],rs=done||isSk;
    const actT=getActTime(task,dw);
    return h('div',{key:task.id,style:{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:'linear-gradient(135deg,rgba(244,63,94,0.06),rgba(244,63,94,0.02))',border:'1px solid rgba(244,63,94,'+(rs?'0.08':'0.18')+')',borderRadius:12,opacity:rs?0.5:1,cursor:'pointer'},onClick:()=>setViewing(task)},
      h('div',{style:{fontSize:20,flexShrink:0}},rs?'✅':'📅'),
      h('div',{style:{flex:1,minWidth:0}},
        h('div',{style:{fontSize:13,fontWeight:700,color:rs?'#64748b':'#fb7185',textDecoration:rs?'line-through':'none'}},task.name),
        h('div',{style:{display:'flex',gap:8,marginTop:2}},
          actT&&h('span',{style:{fontSize:11,color:'#94a3b8'}},actT),
          task.reminderMin>0&&h('span',{style:{fontSize:10,color:'#64748b'}},'⏰ '+task.reminderMin+'min'),
          task.project&&h('span',{style:{fontSize:11,color:'#64748b'}},task.project))),
      !rs&&h('div',{style:{display:'flex',gap:4}},
        h('button',{style:{width:28,height:28,borderRadius:7,background:'rgba(16,185,129,0.15)',border:'none',color:'#10b981',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'},onClick:e=>{e.stopPropagation();doC(task.id)}},h(IC.Check)),
        h('button',{style:{width:28,height:28,borderRadius:7,background:'rgba(100,116,139,0.1)',border:'none',color:'#64748b',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'},onClick:e=>{e.stopPropagation();doS(task.id)}},h(IC.X))));
  };

// ═══ ADMIN TASK ROW ═══
  const aRow=(task,idx,list,cat,isSub)=>{
    const done=!!comp[task.id],isSk=!!skip[task.id];
    const c=CAT[cat];const actT=getActTime(task,dw);
    const isDragOver=dragOverId===task.id;
    const subs=tasks.filter(t=>t.parentId===task.id&&!t.archived);
    return h('div',{key:task.id},
      h('div',{'data-cat':cat,'data-tid':task.id,
        draggable:true,
        onDragStart:()=>handleDragStart(task.id,cat),
        onDragOver:e=>handleDragOver(e,task.id),
        onDrop:()=>handleDrop(task.id,cat),
        onDragEnd:()=>{setDragId(null);setDragOverId(null)},
        onTouchStart:e=>handleTouchStart(e,task.id),
        onTouchMove:e=>handleTouchMove(e,cat),
        onTouchEnd:()=>handleTouchEnd(cat),
        style:{display:'flex',alignItems:'center',gap:8,padding:isSub?'10px 10px 10px 30px':'12px 14px',background:isDragOver?'#1e293b':dragId===task.id?'#0f172a':'#111827',borderRadius:12,borderLeft:'3px solid '+c.border,marginBottom:4,opacity:dragId===task.id?0.5:1,borderTop:isDragOver?'2px solid #f59e0b':'2px solid transparent',cursor:'grab',touchAction:'none'}},
        h('div',{style:{color:'#334155',display:'flex',cursor:'grab',padding:'4px 0',touchAction:'none'}},h(IC.Grip)),
        h('div',{style:{width:10,height:10,borderRadius:5,flexShrink:0,background:done?'#10b981':isSk?'#475569':'#1e293b',border:done||isSk?'none':'2px solid #334155'}}),
        h('div',{style:{flex:1,minWidth:0}},
          h('div',{style:{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}},
            h('span',{style:{fontSize:13,fontWeight:600,color:done?'#64748b':'#e2e8f0',textDecoration:done?'line-through':'none'}},task.name),
            task.isGoal&&h('span',{style:{fontSize:9,color:'#fbbf24',fontWeight:800}},'🎯'),
            subs.length>0&&h('span',{style:{fontSize:10,color:'#475569'}},'('+subs.length+' sub)')),
          h('div',{style:{display:'flex',flexWrap:'wrap',gap:4,marginTop:2}},
            actT&&h('span',{style:{fontSize:10,color:'#64748b'}},actT),
            task.reminderMin>0&&h('span',{style:{fontSize:10,color:'#64748b'}},'⏰'+task.reminderMin+'m'),
            task.project&&h('span',{style:{fontSize:10,color:'#475569'}},'📁'+task.project))),
        h('div',{style:{display:'flex',gap:2,flexShrink:0}},
          h('button',{style:{width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:6,color:'#60a5fa',cursor:'pointer'},onClick:()=>setEditing(task)},h(IC.Edit)),
          h('button',{style:{width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:6,color:'#94a3b8',cursor:'pointer'},onClick:()=>dupT(task.id)},h(IC.Copy)),
          !isSub&&h('button',{style:{width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:6,color:'#64748b',cursor:'pointer',fontSize:10},onClick:()=>setEditing({_newSub:true,parentId:task.id,category:cat})},'+sub'),
          cat==='event'?h('button',{style:{width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:6,color:'#94a3b8',cursor:'pointer'},onClick:()=>arT(task.id)},h(IC.Archive)):
          h('button',{style:{width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:6,color:'#f87171',cursor:'pointer'},onClick:()=>setCDel(task.id)},h(IC.Trash)))),
      // Subtasks
      subs.sort((a,b)=>a.order-b.order).map((sub,si)=>aRow(sub,si,subs,cat,true)));
  };

  // ═══ MAIN RENDER ═══
  return h('div',{style:{fontFamily:F,background:'#0c0f1a',minHeight:'100vh',maxWidth:480,margin:'0 auto',position:'relative',color:'#e2e8f0'}},
    celeb&&h(Celebration,{text:celeb,big:celebBig,onDone:()=>{setCeleb(null);setCelebBig(false)}}),
    banner&&h('div',{style:{position:'fixed',top:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,background:'linear-gradient(135deg,#f59e0b,#d97706)',color:'#0c0f1a',padding:'14px 16px',display:'flex',alignItems:'center',gap:10,zIndex:300,paddingTop:'calc(14px + env(safe-area-inset-top))'}},
      h('span',{style:{fontSize:16}},'⏰'),h('span',{style:{flex:1,fontSize:14,fontWeight:700}},banner),h('button',{style:{background:'none',border:'none',color:'#0c0f1a',cursor:'pointer',padding:4,display:'flex'},onClick:()=>setBanner(null)},h(IC.X))),
    // Header
    h('div',{style:{padding:'16px 20px 12px',background:'linear-gradient(180deg,#0c0f1a,rgba(12,15,26,0.95))',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(148,163,184,0.06)',display:'flex',alignItems:'center',gap:10}},
      h('div',{style:{display:'flex',alignItems:'center',gap:10,flex:1}},
        h('span',{style:{fontSize:22,fontWeight:700,color:'#f8fafc'}},tab==='day'?'My Day':'Manage'),
        h('span',{style:{fontSize:14,color:'#64748b',fontVariantNumeric:'tabular-nums'}},ct),
        h('span',{className:'sd '+(synced?'sd-on':'sd-off')})),
      focusProj&&tab==='day'&&h('button',{style:{fontSize:10,padding:'4px 8px',borderRadius:6,background:'rgba(168,85,247,0.15)',border:'1px solid rgba(168,85,247,0.3)',color:'#c084fc',cursor:'pointer',fontFamily:F,fontWeight:700},onClick:()=>setFocusProj(null)},'⚡'+focusProj+' ✕'),
      tab==='day'&&projects.length>0&&h('button',{style:{background:'none',border:'none',cursor:'pointer',padding:4,display:'flex',color:focusProj?'#a855f7':'#334155'},onClick:()=>setShowFocus(!showFocus)},h(IC.Zap)),
      h('button',{style:{background:'none',border:'none',cursor:'pointer',padding:4,display:'flex',color:nOn?'#f59e0b':'#475569'},onClick:nOn?()=>setNOn(false):rqN},nOn?h(IC.Bell):h(IC.BellOff))),
    // Focus mode dropdown
    showFocus&&h('div',{style:{position:'absolute',top:60,right:50,background:'#1e293b',borderRadius:12,padding:8,zIndex:60,boxShadow:'0 8px 30px rgba(0,0,0,0.5)',minWidth:160}},
      h('div',{style:{fontSize:11,color:'#64748b',padding:'4px 8px',fontWeight:700}},'FOCUS MODE'),
      h('button',{style:{width:'100%',textAlign:'left',padding:'8px 10px',background:!focusProj?'rgba(168,85,247,0.15)':'none',border:'none',borderRadius:8,color:!focusProj?'#c084fc':'#94a3b8',cursor:'pointer',fontSize:12,fontFamily:F,fontWeight:600},onClick:()=>{setFocusProj(null);setShowFocus(false)}},'All projects'),
      projects.map(p=>h('button',{key:p,style:{width:'100%',textAlign:'left',padding:'8px 10px',background:focusProj===p?'rgba(168,85,247,0.15)':'none',border:'none',borderRadius:8,color:focusProj===p?'#c084fc':'#94a3b8',cursor:'pointer',fontSize:12,fontFamily:F,fontWeight:600,marginTop:2},onClick:()=>{setFocusProj(p);setShowFocus(false)}},p))),
    // Content
    h('div',{style:{padding:'12px 16px',paddingBottom:90}},
      tab==='day'?
      h('div',{style:{paddingBottom:80}},
        h('div',{style:{marginBottom:16}},h('div',{style:{display:'flex',position:'relative',background:'#1e293b',borderRadius:14,padding:4,height:48}},
          h('div',{style:{position:'absolute',top:4,left:4,width:'calc(50% - 4px)',height:40,borderRadius:11,transition:'all .3s',zIndex:0,transform:mode==='work'?'translateX(100%)':'translateX(0%)',background:mode==='personal'?'linear-gradient(135deg,#a855f7,#7c3aed)':'linear-gradient(135deg,#3b82f6,#2563eb)'}}),
          h('button',{style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer',zIndex:1,position:'relative',fontFamily:F,color:mode==='personal'?'#fff':'#94a3b8'},onClick:()=>setMode('personal')},h(IC.Sun),' Personal'),
          h('button',{style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer',zIndex:1,position:'relative',fontFamily:F,color:mode==='work'?'#fff':'#94a3b8'},onClick:()=>setMode('work')},h(IC.Brief),' Work'))),
        h('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:16}},
          h('div',{style:{flex:1,height:6,background:'#1e293b',borderRadius:3,overflow:'hidden'}},
            h('div',{style:{height:'100%',borderRadius:3,transition:'width .5s',width:pct*100+'%',background:pct===1?'linear-gradient(90deg,#10b981,#34d399)':'linear-gradient(90deg,#f59e0b,#fbbf24)'}})),
          h('span',{style:{fontSize:13,fontWeight:600,color:'#94a3b8',minWidth:32,textAlign:'right'}},rCnt+'/'+dayT.length)),
        todayEvents.length>0&&h('div',{style:{marginBottom:16}},
          h('div',{style:{fontSize:11,fontWeight:700,color:'#fb7185',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8,padding:'0 4px'}},'📅 Events'),
          h('div',{style:{display:'flex',flexDirection:'column',gap:6}},todayEvents.map(rEvent))),
        nxt&&h('div',{style:{background:'linear-gradient(135deg,rgba(251,191,36,0.06),rgba(251,191,36,0.02))',border:'1px solid rgba(251,191,36,0.18)',borderRadius:20,padding:'24px 20px',marginBottom:8,boxShadow:'0 0 40px rgba(251,191,36,0.06),0 8px 32px rgba(0,0,0,0.3)',cursor:'pointer'},onClick:()=>setViewing(nxt)},
          h('div',{style:{display:'flex',alignItems:'center',gap:8,color:'#f59e0b',marginBottom:12}},h(IC.Focus),h('span',{style:{fontSize:12,fontWeight:800,letterSpacing:'0.1em'}},'FOCUS NOW')),
          h('div',{style:{fontSize:26,fontWeight:800,color:'#fef3c7',lineHeight:1.2,marginBottom:10}},dN(nxt)),
          nxt.isGoal&&h('div',{style:{fontSize:14,fontWeight:800,color:'#fbbf24',marginBottom:10,background:'linear-gradient(90deg,rgba(251,191,36,0.1),transparent)',padding:'6px 12px',borderRadius:8,border:'1px solid rgba(251,191,36,0.2)'}},'🎯 DAILY GOAL'),
          h('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:18,flexWrap:'wrap'}},
            h('span',{style:{fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:5,border:'1px solid '+CAT[nxt.category].border,background:CAT[nxt.category].bg,color:CAT[nxt.category].text,textTransform:'uppercase'}},CAT[nxt.category].label),
            nxt.project&&h('span',{style:{fontSize:12,fontWeight:600,color:'#94a3b8',background:'rgba(148,163,184,0.1)',padding:'3px 10px',borderRadius:6}},nxt.project)),
          h('div',{style:{display:'flex',gap:10},onClick:e=>e.stopPropagation()},
            h('button',{style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px 20px',background:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:14,color:'#fff',fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:()=>doC(nxt.id)},h(IC.CheckBig),' Done'),
            h('button',{style:{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'14px 16px',background:'rgba(100,116,139,0.15)',border:'1px solid rgba(100,116,139,0.3)',borderRadius:14,color:'#94a3b8',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:()=>doS(nxt.id)},h(IC.X)),
            h('button',{style:{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'14px 16px',background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:14,color:'#f59e0b',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:()=>doHold(nxt.id,60)},'⏸ 1h'))),
        pct===1&&h('div',{style:{background:'linear-gradient(135deg,rgba(16,185,129,0.06),rgba(16,185,129,0.02))',border:'1px solid rgba(16,185,129,0.18)',borderRadius:20,padding:'24px 20px',textAlign:'center'}},
          h('span',{style:{fontSize:28}},'🎉'),h('div',{style:{fontSize:22,fontWeight:800,color:'#34d399',marginTop:8}},'All done!')),
        rest.length>0&&h('div',{style:{marginTop:12}},
          h('div',{style:{fontSize:11,fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8,padding:'0 4px'}},'Up ahead'),
          h('div',{style:{display:'flex',flexDirection:'column',gap:6}},rest.map(rCard))),
        rCnt>0&&h('button',{style:{display:'flex',alignItems:'center',justifyContent:'center',gap:10,width:'100%',padding:14,marginTop:24,background:'linear-gradient(135deg,#1e293b,#0f172a)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:14,color:'#fbbf24',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:()=>setCEnd(true)},h(IC.Moon),' End Day'))
      :
      // ═══ ADMIN VIEW ═══
      h('div',{style:{paddingBottom:100}},
        h('div',{style:{fontSize:10,color:'#475569',marginBottom:12,padding:'0 4px',fontStyle:'italic'}},'Drag tasks to reorder'),
        ['core','event','work','personal'].map(cat=>{
          const list=grp[cat];if(!list||!list.length)return null;const c=CAT[cat];const collapsed=!!collCats[cat];
          return h('div',{key:cat,style:{marginBottom:collapsed?8:20}},
            h('div',{style:{display:'flex',alignItems:'center',gap:8,fontSize:13,fontWeight:700,textTransform:'uppercase',color:c.text,marginBottom:collapsed?0:8,padding:'0 4px',cursor:'pointer'},onClick:()=>setCollCats(p=>({...p,[cat]:!p[cat]}))},
              h('span',{style:{width:8,height:8,borderRadius:4,background:c.border}}),c.label+' ('+list.length+')',
              h('span',{style:{fontSize:12,marginLeft:4,display:'inline-block',transform:collapsed?'rotate(-90deg)':'rotate(0)',transition:'transform .2s'}},'▾')),
            !collapsed&&list.sort((a,b)=>a.order-b.order).map((task,idx)=>aRow(task,idx,list,cat,false)))
        }),
        arcTasks.length>0&&h('div',{style:{marginTop:16}},
          h('button',{style:{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'12px 14px',background:'#111827',border:'1px solid #1e293b',borderRadius:12,color:'#64748b',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F,marginBottom:8},onClick:()=>setShowAr(!showAr)},h(IC.Archive),' Archived ('+arcTasks.length+') ',showAr?'▾':'▸'),
          showAr&&arcTasks.map(task=>h('div',{key:task.id,style:{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:'#111827',borderRadius:12,borderLeft:'3px solid #334155',marginBottom:6,opacity:0.6}},
            h('div',{style:{flex:1}},h('div',{style:{fontSize:14,fontWeight:600,color:'#e2e8f0',textDecoration:'line-through'}},task.name)),
            h('div',{style:{display:'flex',gap:3}},
              h('button',{style:{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:8,color:'#60a5fa',cursor:'pointer'},onClick:()=>unT(task.id)},'↩'),
              h('button',{style:{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:8,color:'#f87171',cursor:'pointer'},onClick:()=>setCDel(task.id)},h(IC.Trash)))))),
        h('button',{style:{position:'fixed',bottom:80,right:'calc(50% - 220px)',width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',color:'#0c0f1a',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 8px 30px rgba(245,158,11,0.3)',zIndex:90},onClick:()=>setEditing('new')},h(IC.Plus)))
    ),
    // Nav
    h('div',{style:{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,display:'flex',background:'rgba(12,15,26,0.95)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(148,163,184,0.06)',zIndex:100,padding:'6px 0',paddingBottom:'calc(6px + env(safe-area-inset-bottom))'}},
      h('button',{style:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'10px 0',background:'none',border:'none',color:tab==='day'?'#f59e0b':'#475569',cursor:'pointer',fontFamily:F},onClick:()=>setTab('day')},h(IC.Cal),h('span',{style:{fontSize:11,fontWeight:600}},'My Day')),
      h('button',{style:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'10px 0',background:'none',border:'none',color:tab==='admin'?'#f59e0b':'#475569',cursor:'pointer',fontFamily:F},onClick:()=>setTab('admin')},h(IC.Gear),h('span',{style:{fontSize:11,fontWeight:600}},'Manage'))),
    // Modals
    conflict&&h(Confirm,{title:'⚠️ Conflicto',msg:'Nube: '+new Date(conflict.rTs||0).toLocaleString()+'\nLocal: '+new Date(conflict.lTs||0).toLocaleString(),onOk:()=>{applyData(conflict.local);isResolving.current=false;setConflict(null);markDirty()},onNo:()=>{applyData(conflict.remote);isResolving.current=false;setConflict(null)},okLbl:'Usar Local',noLbl:'Usar Nube',okClr:'#f59e0b'}),
    editing!==null&&h(TaskForm,{task:editing==='new'?null:editing,allTasks:tasks,onSave:svT,onClose:()=>setEditing(null)}),
    viewing!==null&&h(DetailSheet,{task:viewing,dispName:dN(viewing),onClose:()=>setViewing(null),onUpdateNotes:n=>{uN(viewing.id,n);setViewing({...viewing,notes:n})}}),
    cEnd&&h(Confirm,{title:'End Day',msg:'Reset all progress?',onOk:endD,onNo:()=>setCEnd(false),okLbl:'Reset',okClr:'#f59e0b'}),
    cDel&&h(Confirm,{title:'Delete',msg:'Delete "'+(tasks.find(t=>t.id===cDel)?.name||'')+'" and its subtasks?',onOk:()=>delT(cDel),onNo:()=>setCDel(null),okLbl:'Delete',okClr:'#ef4444'})
  );
}

// ═══ DETAIL SHEET ═══
function DetailSheet({task,dispName,onClose,onUpdateNotes}){
  const[notes,setNotes]=useState(task.notes||'');const[dirty,setDirty]=useState(false);const c=CAT[task.category];
  return h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16},onClick:onClose},
    h('div',{style:{width:'100%',maxWidth:440,background:'#1e293b',borderRadius:20,padding:'24px 20px',maxHeight:'85vh',overflow:'auto'},onClick:e=>e.stopPropagation()},
      h('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:4}},
        h('span',{style:{fontSize:10,fontWeight:700,padding:'2px 6px',borderRadius:5,border:'1px solid '+c.border,background:c.bg,color:c.text,textTransform:'uppercase'}},c.label),
        task.project&&h('span',{style:{fontSize:12,color:'#64748b'}},task.project),
        task.isGoal&&h('span',{style:{fontSize:10,color:'#fbbf24',fontWeight:800}},'🎯 META')),
      h('h2',{style:{fontSize:18,fontWeight:700,color:'#f8fafc',margin:'8px 0 16px'}},dispName),
      task.timeCondition&&h('div',{style:{display:'flex',alignItems:'center',gap:6,marginBottom:8,color:'#64748b',fontSize:12}},h(IC.Clock),' '+task.timeCondition.time),
      task.category==='event'&&(task.eventDates||[]).length>0&&h('div',{style:{fontSize:12,color:'#fb7185',marginBottom:8}},'📅 '+task.eventDates.join(', ')),
      task.reminderMin>0&&h('div',{style:{fontSize:12,color:'#64748b',marginBottom:8}},'⏰ '+task.reminderMin+' min before'),
      (task.activeDays||[]).length>0&&(task.activeDays||[]).length<7&&h('div',{style:{display:'flex',gap:4,marginBottom:12}},
        DAYS.map(d=>h('span',{key:d,style:{fontSize:10,fontWeight:700,padding:'3px 6px',borderRadius:5,background:(task.activeDays||[]).includes(d)?'rgba(251,191,36,0.15)':'transparent',color:(task.activeDays||[]).includes(d)?'#fbbf24':'#334155'}},DL[d]))),
      h('label',{style:{display:'block',fontSize:12,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}},'Notes'),
      h('textarea',{style:{width:'100%',padding:'12px 14px',background:'#0f172a',border:'1px solid #334155',borderRadius:10,color:'#e2e8f0',fontSize:14,fontFamily:F,outline:'none',boxSizing:'border-box',minHeight:120,resize:'vertical',lineHeight:1.5},value:notes,onChange:e=>{setNotes(e.target.value);setDirty(true)},placeholder:'Add notes...'}),
      h('div',{style:{display:'flex',gap:10,marginTop:16}},
        h('button',{style:{flex:1,padding:14,background:'#0f172a',border:'1px solid #334155',borderRadius:12,color:'#94a3b8',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:onClose},'Close'),
        dirty&&h('button',{style:{flex:1,padding:14,background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',borderRadius:12,color:'#0c0f1a',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:()=>{onUpdateNotes(notes);setDirty(false)}},'Save'))));
}

// ═══ TASK FORM ═══
function TaskForm({task,allTasks,onSave,onClose}){
  const isNewSub=task&&task._newSub;
  const isE=!!task&&!isNewSub;
  const parentId=isNewSub?task.parentId:(task?.parentId||null);
  const defaultCat=isNewSub?task.category:(task?.category||'core');

  const[name,setName]=useState(isE?task.name:'');
  const[category,setCat]=useState(defaultCat);
  const[project,setProj]=useState(isE?task.project:(parentId?allTasks.find(t=>t.id===parentId)?.project||'':''));
  const[notes,setNotes]=useState(isE?task.notes:'');
  const[hasTime,setHT]=useState(isE?!!task.timeCondition:false);
  const[time,setTime]=useState(task?.timeCondition?.time||'08:00');
  const[lb,setLb]=useState(task?.timeCondition?.labelBefore||'');
  const[la,setLa]=useState(task?.timeCondition?.labelAfter||'');
  const[lsTime,setLsTime]=useState(task?.timeCondition?.labelSwitchTime||'');
  const[dayOv,setDayOv]=useState(task?.timeCondition?.dayOverrides||{});
  const[showDayOv,setShowDayOv]=useState(Object.keys(task?.timeCondition?.dayOverrides||{}).length>0);
  const[dep,setDep]=useState(isE?task.dependsOn||'':'');
  const[activeDays,setAD]=useState(isE?task.activeDays:[...ALL_DAYS]);
  const[eventDates,setED]=useState(isE?task.eventDates:[]);
  const[newDate,setNewDate]=useState('');
  const[reminderMin,setRemMin]=useState(task?.reminderMin||0);
  const[isGoal,setIsGoal]=useState(task?.isGoal||false);

  const togD=d=>setAD(p=>p.includes(d)?p.filter(x=>x!==d):[...p,d]);
  const addD=()=>{if(newDate&&!eventDates.includes(newDate)){setED(p=>[...p,newDate].sort());setNewDate('')}};
  const submit=()=>{
    if(!name.trim())return;
    const base=isE?task:{};
    onSave({...base,name:name.trim(),category,project:project.trim(),notes:notes.trim(),
      timeCondition:hasTime?{time,labelBefore:lb.trim()||null,labelAfter:la.trim()||null,labelSwitchTime:lsTime.trim()||null,dayOverrides:showDayOv?dayOv:{}}:null,
      dependsOn:dep||null,activeDays:category==='event'?[]:activeDays,eventDates:category==='event'?eventDates:[],
      archived:task?.archived||false,reminderMin:parseInt(reminderMin)||0,isGoal,parentId:parentId||null});
  };
  const projs=[...new Set(allTasks.map(t=>t.project).filter(Boolean))];
  const inp={width:'100%',padding:'12px 14px',background:'#0f172a',border:'1px solid #334155',borderRadius:10,color:'#e2e8f0',fontSize:14,fontFamily:F,outline:'none',boxSizing:'border-box'};
  const lbl={display:'block',fontSize:12,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6,marginTop:16};
  const slbl={display:'block',fontSize:11,fontWeight:600,color:'#64748b',marginBottom:4,marginTop:10};
  return h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16},onClick:onClose},
    h('div',{style:{width:'100%',maxWidth:440,background:'#1e293b',borderRadius:20,padding:'24px 20px',maxHeight:'85vh',overflow:'auto'},onClick:e=>e.stopPropagation()},
      h('h2',{style:{fontSize:18,fontWeight:700,color:'#f8fafc',margin:'0 0 16px'}},isE?'Edit Task':isNewSub?'New Subtask':'New Task'),
      parentId&&h('div',{style:{fontSize:12,color:'#64748b',marginBottom:12}},'↳ Sub of: '+(allTasks.find(t=>t.id===parentId)?.name||'?')),
      h('label',{style:lbl},'Name'),h('input',{style:inp,value:name,onChange:e=>setName(e.target.value),placeholder:'Task name',autoFocus:true}),
      !parentId&&h('div',null,
        h('label',{style:lbl},'Category'),h('select',{style:{...inp,WebkitAppearance:'none'},value:category,onChange:e=>setCat(e.target.value)},
          h('option',{value:'core'},'Core'),h('option',{value:'event'},'Event'),h('option',{value:'work'},'Work'),h('option',{value:'personal'},'Personal'))),
      h('label',{style:lbl},'Project'),h('input',{style:inp,value:project,onChange:e=>setProj(e.target.value),placeholder:'Project',list:'pl'}),
      h('datalist',{id:'pl'},projs.map(p=>h('option',{key:p,value:p}))),
      h('label',{style:lbl},'Notes'),h('textarea',{style:{...inp,minHeight:50,resize:'vertical'},value:notes,onChange:e=>setNotes(e.target.value),placeholder:'Context...'}),

      (category==='work'||category==='personal')&&h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:16}},
        h('label',{style:{...lbl,marginTop:0}},'🎯 Daily Goal'),
        h('button',{style:{width:44,height:24,borderRadius:12,border:'none',cursor:'pointer',position:'relative',padding:0,background:isGoal?'#10b981':'#334155'},onClick:()=>setIsGoal(!isGoal)},
          h('div',{style:{width:20,height:20,borderRadius:10,background:'#fff',position:'absolute',top:2,transition:'transform .2s',transform:isGoal?'translateX(20px)':'translateX(2px)'}}))),

      category!=='event'&&h('div',null,h('label',{style:lbl},'Active Days'),
        h('div',{style:{display:'flex',gap:4,flexWrap:'wrap'}},DAYS.map(d=>h('button',{key:d,onClick:()=>togD(d),style:{padding:'8px 12px',borderRadius:8,fontSize:12,fontWeight:700,fontFamily:F,cursor:'pointer',border:activeDays.includes(d)?'2px solid #f59e0b':'2px solid #1e293b',background:activeDays.includes(d)?'rgba(251,191,36,0.15)':'#0f172a',color:activeDays.includes(d)?'#fbbf24':'#475569'}},DF[d])))),

      category==='event'&&h('div',null,h('label',{style:lbl},'Dates'),
        h('div',{style:{display:'flex',gap:8,marginBottom:8}},h('input',{type:'date',style:{...inp,flex:1},value:newDate,onChange:e=>setNewDate(e.target.value)}),
          h('button',{style:{padding:'10px 16px',background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',borderRadius:12,color:'#0c0f1a',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:addD},'Add')),
        h('div',{style:{display:'flex',flexWrap:'wrap',gap:6}},eventDates.map(d=>h('span',{key:d,style:{display:'flex',alignItems:'center',gap:4,fontSize:12,background:'rgba(244,63,94,0.15)',color:'#fb7185',padding:'4px 10px',borderRadius:8,fontWeight:600}},
          d,h('button',{onClick:()=>setED(p=>p.filter(x=>x!==d)),style:{background:'none',border:'none',color:'#fb7185',cursor:'pointer',padding:0,display:'flex'}},h(IC.X)))),
          eventDates.length===0&&h('span',{style:{fontSize:12,color:'#475569',fontStyle:'italic'}},'No dates')),
        h('label',{style:{...lbl,marginTop:12}},'Reminder'),
        h('select',{style:{...inp,WebkitAppearance:'none'},value:reminderMin,onChange:e=>setRemMin(e.target.value)},
          h('option',{value:0},'None'),h('option',{value:5},'5 min'),h('option',{value:10},'10 min'),h('option',{value:15},'15 min'),h('option',{value:30},'30 min'),h('option',{value:60},'1 hour'))),

      h('label',{style:lbl},'Depends On'),h('select',{style:{...inp,WebkitAppearance:'none'},value:dep,onChange:e=>setDep(e.target.value)},
        h('option',{value:''},'None'),allTasks.filter(t=>t.id!==(isE?task.id:null)).map(t=>h('option',{key:t.id,value:t.id},t.name+' ('+CAT[t.category]?.label+')'))),

      h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:16}},
        h('label',{style:{...lbl,marginTop:0}},'Time'),
        h('button',{style:{width:44,height:24,borderRadius:12,border:'none',cursor:'pointer',position:'relative',padding:0,background:hasTime?'#f59e0b':'#334155'},onClick:()=>setHT(!hasTime)},
          h('div',{style:{width:20,height:20,borderRadius:10,background:'#fff',position:'absolute',top:2,transition:'transform .2s',transform:hasTime?'translateX(20px)':'translateX(2px)'}}))),
      hasTime&&h('div',{style:{background:'#0f172a',borderRadius:12,padding:'8px 14px 14px',marginTop:8}},
        h('label',{style:slbl},'Default time'),h('input',{type:'time',style:inp,value:time,onChange:e=>setTime(e.target.value)}),
        h('label',{style:slbl},'Before label'),h('input',{style:inp,value:lb,onChange:e=>setLb(e.target.value),placeholder:'Optional'}),
        h('label',{style:slbl},'After label'),h('input',{style:inp,value:la,onChange:e=>setLa(e.target.value),placeholder:'Optional'}),
        (lb||la)&&h('div',null,h('label',{style:slbl},'Switch name at'),h('input',{type:'time',style:inp,value:lsTime,onChange:e=>setLsTime(e.target.value)})),
        // Per-day overrides
        h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:12}},
          h('label',{style:{fontSize:11,fontWeight:700,color:'#64748b'}},'Per-day times'),
          h('button',{style:{width:36,height:20,borderRadius:10,border:'none',cursor:'pointer',position:'relative',padding:0,background:showDayOv?'#3b82f6':'#334155'},onClick:()=>setShowDayOv(!showDayOv)},
            h('div',{style:{width:16,height:16,borderRadius:8,background:'#fff',position:'absolute',top:2,transition:'transform .2s',transform:showDayOv?'translateX(18px)':'translateX(2px)'}}))),
        showDayOv&&h('div',{style:{marginTop:8,display:'flex',flexDirection:'column',gap:4}},
          DAYS.filter(d=>activeDays.includes(d)).map(d=>h('div',{key:d,style:{display:'flex',alignItems:'center',gap:8}},
            h('span',{style:{fontSize:12,color:'#94a3b8',width:30}},DF[d]),
            h('input',{type:'time',style:{...inp,flex:1,padding:'8px 10px',fontSize:12},value:dayOv[d]||'',onChange:e=>{const v=e.target.value;setDayOv(p=>v?{...p,[d]:v}:(()=>{const n={...p};delete n[d];return n})())},placeholder:time}))))),

      h('div',{style:{display:'flex',gap:10,marginTop:24}},
        h('button',{style:{flex:1,padding:14,background:'#0f172a',border:'1px solid #334155',borderRadius:12,color:'#94a3b8',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:onClose},'Cancel'),
        h('button',{style:{flex:1,padding:14,background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',borderRadius:12,color:'#0c0f1a',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:submit,disabled:!name.trim()},isE?'Save':'Add'))));
}

// ═══ CONFIRM ═══
function Confirm({title,msg,onOk,onNo,okLbl,noLbl,okClr}){
  return h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16},onClick:onNo},
    h('div',{style:{width:'100%',maxWidth:340,background:'#1e293b',borderRadius:20,padding:'24px 20px'},onClick:e=>e.stopPropagation()},
      h('h2',{style:{fontSize:18,fontWeight:700,color:'#f8fafc',margin:'0 0 20px'}},title),
      h('p',{style:{fontSize:14,color:'#94a3b8',lineHeight:1.5,margin:'0 0 20px',whiteSpace:'pre-line'}},msg),
      h('div',{style:{display:'flex',gap:10}},
        h('button',{style:{flex:1,padding:14,background:'#0f172a',border:'1px solid #334155',borderRadius:12,color:'#94a3b8',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:onNo},noLbl||'Cancel'),
        h('button',{style:{flex:1,padding:14,background:okClr,border:'none',borderRadius:12,color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:onOk},okLbl))));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
