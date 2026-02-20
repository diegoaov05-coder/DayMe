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
const db=firebase.database(), dataRef=db.ref('routineApp');

// ═══ SW ═══
let swReg=null;
if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').then(r=>{swReg=r}).catch(()=>{});
function ntfy(title,body,tag){
  if(swReg)try{swReg.showNotification(title,{body,tag:tag||'md',renotify:true,vibrate:[200,100,200],requireInteraction:true})}catch(e){}
  else if('Notification' in window&&Notification.permission==='granted')try{new Notification(title,{body,tag:tag||'md'})}catch(e){}
}

// ═══ HELPERS ═══
const LK='routine-sync-v3';
const DAYS=['sun','mon','tue','wed','thu','fri','sat'];
const DF={sun:'Sun',mon:'Mon',tue:'Tue',wed:'Wed',thu:'Thu',fri:'Fri',sat:'Sat'};
const DL={sun:'S',mon:'M',tue:'T',wed:'W',thu:'T',fri:'F',sat:'S'};
const ALL_DAYS=[...DAYS];
const getDow=()=>DAYS[new Date().getDay()];
const getISO=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const getHM=()=>{const d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const toM=t=>{const p=t.split(':').map(Number);return p[0]*60+p[1]};
const gid=()=>'t'+Date.now()+Math.random().toString(36).slice(2,6);
const sL=d=>{try{localStorage.setItem(LK,JSON.stringify(d))}catch(e){}};
const lL=()=>{try{const s=localStorage.getItem(LK);return s?JSON.parse(s):null}catch(e){return null}};
const autoArc=tasks=>{const td=getISO();return tasks.map(t=>t.category==='event'&&!t.archived&&t.eventDates&&t.eventDates.length>0&&t.eventDates.every(d=>d<td)?{...t,archived:true}:t)};

const SEED=[
  {id:'t1',name:'Desayuno',category:'core',project:'',notes:'',timeCondition:{time:'07:20',labelBefore:'Desayuno en casa',labelAfter:'Desayuno ofi'},dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:0},
  {id:'t2',name:'Almuerzo',category:'core',project:'',notes:'',timeCondition:{time:'12:30',labelBefore:null,labelAfter:null},dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:1},
  {id:'t3',name:'Cena',category:'core',project:'',notes:'',timeCondition:{time:'20:00',labelBefore:null,labelAfter:null},dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:2},
  {id:'t4',name:'Completar PPT mina Mutún',category:'work',project:'Mutún Mining',notes:'Revisar slides 5-8',timeCondition:null,dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:3},
  {id:'t5',name:'Revisar plataforma TIKR',category:'work',project:'Research',notes:'',timeCondition:null,dependsOn:null,activeDays:['mon','wed','fri'],eventDates:[],archived:false,order:4},
  {id:'t6',name:'Repaso CFA',category:'personal',project:'CFA Level I',notes:'Capítulo 12: Fixed Income',timeCondition:null,dependsOn:null,activeDays:['mon','tue','wed','thu','fri'],eventDates:[],archived:false,order:5},
  {id:'t7',name:'Ruta Nuzlocke en Cobblemon',category:'personal',project:'Gaming',notes:'',timeCondition:null,dependsOn:null,activeDays:['sat','sun'],eventDates:[],archived:false,order:6},
  {id:'t8',name:'Reunión equipo Mutún',category:'event',project:'Mutún Mining',notes:'Sala 3B',timeCondition:{time:'10:00',labelBefore:null,labelAfter:null},dependsOn:null,activeDays:[],eventDates:[getISO()],archived:false,order:7},
];

const CAT={
  core:{bg:'rgba(251,191,36,0.12)',border:'#f59e0b',text:'#fbbf24',label:'Core'},
  event:{bg:'rgba(244,63,94,0.12)',border:'#f43f5e',text:'#fb7185',label:'Event'},
  work:{bg:'rgba(59,130,246,0.12)',border:'#3b82f6',text:'#60a5fa',label:'Work'},
  personal:{bg:'rgba(168,85,247,0.12)',border:'#a855f7',text:'#c084fc',label:'Personal'},
};

const h=React.createElement;
const{useState,useEffect,useCallback,useRef}=React;

// ═══ SVG ICONS ═══
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
};

// ═══ STYLES ═══
const F="'SF Pro Display',-apple-system,'Segoe UI',sans-serif";
const ss=(bg,clr,extra)=>Object.assign({fontFamily:F,background:bg||'transparent',color:clr||'#e2e8f0'},extra||{});


// ═══════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════
function App(){
  const[tasks,setTasks]=useState([]);
  const[comp,setComp]=useState({});
  const[skip,setSkip]=useState({});
  const[tab,setTab]=useState('day');
  const[mode,setMode]=useState('work');
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
  const ntfSet=useRef(new Set());
  const initDone=useRef(false);
  const skipFB=useRef(false);

  // ═══ INIT ═══
  useEffect(()=>{
    if(initDone.current)return;initDone.current=true;
    // 1) Load local immediately
    const local=lL();
    if(local&&local.tasks&&local.tasks.length>0){
      setTasks(autoArc(local.tasks));setComp(local.completed||{});setSkip(local.skipped||{});
      if(local.notified)ntfSet.current=new Set(local.notified);
    }else{
      setTasks(SEED);const d={tasks:SEED,completed:{},skipped:{},notified:[]};sL(d);
      try{dataRef.set(d)}catch(e){}
    }
    setLoading(false);
    // 2) Firebase listener
    try{dataRef.on('value',snap=>{
      const v=snap.val();if(!v||!v.tasks)return;
      if(skipFB.current){skipFB.current=false;return}
      setTasks(autoArc(v.tasks));setComp(v.completed||{});setSkip(v.skipped||{});
      if(v.notified)ntfSet.current=new Set(v.notified);
      sL(v);setSynced(true);
    })}catch(e){}
    try{db.ref('.info/connected').on('value',s=>{setSynced(!!s.val())})}catch(e){}
    if('Notification' in window&&Notification.permission==='granted')setNOn(true);
  },[]);

  // ═══ SAVE ═══
  useEffect(()=>{
    if(loading||tasks.length===0)return;
    const d={tasks,completed:comp,skipped:skip,notified:[...ntfSet.current],ts:Date.now()};
    sL(d);skipFB.current=true;try{dataRef.set(d)}catch(e){}
  },[tasks,comp,skip,loading]);

  // ═══ CLOCK + NOTIFS ═══
  useEffect(()=>{
    const tick=()=>{
      const t=getHM();setCt(t);if(!nOn)return;
      const nm=toM(t),td=getISO();
      tasks.forEach(tk=>{
        if(tk.category!=='core'&&tk.category!=='event')return;
        if(!tk.timeCondition||ntfSet.current.has(tk.id))return;
        if(comp[tk.id]||skip[tk.id]||tk.archived)return;
        if(tk.category==='core'&&!(tk.activeDays||[]).includes(getDow()))return;
        if(tk.category==='event'&&!(tk.eventDates||[]).includes(td))return;
        const tMin=toM(tk.timeCondition.time);
        if(nm>=tMin&&nm<=tMin+1){
          const dn=tk.timeCondition.labelAfter||tk.name;
          ntfy(tk.category==='event'?'📅 Event':'⏰ Core',dn+' — Go!',tk.id);
          setBanner(dn);setTimeout(()=>setBanner(null),5000);
          ntfSet.current.add(tk.id);
        }
      });
    };
    tick();const iv=setInterval(tick,15000);return()=>clearInterval(iv);
  },[tasks,comp,skip,nOn]);

  const rqN=async()=>{
    if(!('Notification' in window)){setBanner('Not supported');setTimeout(()=>setBanner(null),3000);return}
    const p=await Notification.requestPermission();
    if(p==='granted'){setNOn(true);ntfy('🔔','Notifications on')}
    else{setBanner('Permission denied');setTimeout(()=>setBanner(null),3000)}
  };

  // ═══ LOGIC ═══
  const res=useCallback(id=>!!comp[id]||!!skip[id],[comp,skip]);
  const td=getISO(),dw=getDow();
  const isAct=useCallback(t=>{if(t.archived)return false;if(t.category==='event')return(t.eventDates||[]).includes(td);return(t.activeDays||ALL_DAYS).includes(dw)},[td,dw]);
  const ceT=tasks.filter(t=>(t.category==='core'||t.category==='event')&&isAct(t));
  const tOk=useCallback(t=>!t.timeCondition||toM(ct)>=toM(t.timeCondition.time),[ct]);
  const dOk=useCallback(tk=>{
    if(tk.dependsOn&&!res(tk.dependsOn))return false;
    if(tk.category==='work'||tk.category==='personal')if(ceT.filter(c=>tOk(c)&&!res(c.id)).length>0)return false;
    return true;
  },[res,ceT,tOk]);
  const isUL=useCallback(t=>tOk(t)&&dOk(t),[tOk,dOk]);
  const dN=useCallback(t=>{if(t.timeCondition){const p=toM(ct)>=toM(t.timeCondition.time);if(t.timeCondition.labelBefore&&!p)return t.timeCondition.labelBefore;if(t.timeCondition.labelAfter&&p)return t.timeCondition.labelAfter}return t.name},[ct]);
  const bW=useCallback(tk=>{
    const r=[];if(tk.timeCondition&&!tOk(tk))r.push('At '+tk.timeCondition.time);
    if(tk.dependsOn&&!res(tk.dependsOn)){const p=tasks.find(x=>x.id===tk.dependsOn);if(p)r.push('After: '+p.name)}
    if(tk.category==='work'||tk.category==='personal'){const pn=ceT.filter(c=>tOk(c)&&!res(c.id));if(pn.length)r.push('Pending: '+pn.map(c=>c.name).join(', '))}
    return r;
  },[tOk,res,tasks,ceT]);

  // Actions
  const doC=id=>{setComp(p=>{const n={...p};n[id]?delete n[id]:(n[id]=true);return n});setSkip(p=>{const n={...p};delete n[id];return n})};
  const doS=id=>{setSkip(p=>{const n={...p};n[id]?delete n[id]:(n[id]=true);return n});setComp(p=>{const n={...p};delete n[id];return n})};
  const endD=()=>{setComp({});setSkip({});setCEnd(false);ntfSet.current.clear()};
  const delT=id=>{setTasks(p=>p.filter(t=>t.id!==id).map(t=>t.dependsOn===id?{...t,dependsOn:null}:t));setComp(p=>{const n={...p};delete n[id];return n});setSkip(p=>{const n={...p};delete n[id];return n});setCDel(null)};
  const svT=td=>{if(td.id)setTasks(p=>p.map(t=>t.id===td.id?td:t));else setTasks(p=>[...p,{...td,id:gid(),order:p.length}]);setEditing(null)};
  const uN=(id,notes)=>setTasks(p=>p.map(t=>t.id===id?{...t,notes}:t));
  const arT=id=>setTasks(p=>p.map(t=>t.id===id?{...t,archived:true}:t));
  const unT=id=>setTasks(p=>p.map(t=>t.id===id?{...t,archived:false}:t));
  const mvT=(id,dir)=>{setTasks(p=>{const i=p.findIndex(t=>t.id===id);if(i<0)return p;const j=dir==='up'?i-1:i+1;if(j<0||j>=p.length)return p;const n=[...p];const tmp=n[i].order;n[i]={...n[i],order:n[j].order};n[j]={...n[j],order:tmp};[n[i],n[j]]=[n[j],n[i]];return n})};

  // Computed
  const dayT=tasks.filter(t=>!t.archived&&isAct(t)&&(t.category==='core'||t.category==='event'||t.category===mode))
    .sort((a,b)=>{const at=a.timeCondition?toM(a.timeCondition.time):9999,bt=b.timeCondition?toM(b.timeCondition.time):9999;return at!==bt?at-bt:a.order-b.order});
  const nxt=dayT.find(t=>!res(t.id)&&isUL(t));
  const rest=nxt?dayT.filter(t=>t.id!==nxt.id):dayT;
  const rCnt=dayT.filter(t=>res(t.id)).length;
  const pct=dayT.length?rCnt/dayT.length:0;
  const actTasks=tasks.filter(t=>!t.archived),arcTasks=tasks.filter(t=>t.archived);
  const grp={core:[],event:[],work:[],personal:[]};actTasks.forEach(t=>{if(grp[t.category])grp[t.category].push(t)});

  if(loading)return h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',background:'#0c0f1a'}},h('p',{style:{color:'#94a3b8'}},'Loading...'));

  // ═══ RENDER TASK CARD ═══
  const rCard=task=>{
    const done=!!comp[task.id],isSk=!!skip[task.id],rs=done||isSk,u=isUL(task);
    const reasons=bW(task),name=dN(task),c=CAT[task.category];
    const canSk=(task.category==='core'||task.category==='event')&&u&&!rs;
    return h('div',{key:task.id,style:{display:'flex',alignItems:'flex-start',gap:12,padding:'12px 14px',background:'#111827',borderRadius:12,borderLeft:'3px solid '+c.border,cursor:'pointer',opacity:rs?0.45:(!u&&!rs?0.4:1)},onClick:()=>setViewing(task)},
      h('button',{style:{width:32,height:32,borderRadius:9,border:done?'2px solid #10b981':isSk?'2px solid #475569':!u&&!rs?'2px solid #1e293b':'2px solid #334155',background:done?'linear-gradient(135deg,#10b981,#059669)':isSk?'rgba(100,116,139,0.3)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:!u&&!rs?'not-allowed':'pointer',flexShrink:0,color:done?'#fff':isSk?'#94a3b8':'transparent'},onClick:e=>{e.stopPropagation();(u||rs)&&doC(task.id)},disabled:!u&&!rs},
        done&&h(IC.Check),isSk&&h(IC.X),!u&&!rs&&h(IC.Lock)),
      h('div',{style:{flex:1,minWidth:0}},
        h('div',{style:{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}},
          h('span',{style:{fontSize:14,fontWeight:600,color:done||isSk?'#64748b':!u&&!rs?'#475569':'#e2e8f0',textDecoration:done||isSk?'line-through':'none',fontStyle:isSk?'italic':'normal'}},name),
          h('span',{style:{fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:5,border:'1px solid '+c.border,background:c.bg,color:c.text,textTransform:'uppercase'}},c.label),
          task.notes&&h('span',{style:{color:'#475569',display:'flex'}},h(IC.Note))),
        task.project&&h('div',{style:{fontSize:11,color:'#64748b',marginTop:2}},task.project),
        !u&&!rs&&reasons.length>0&&h('div',{style:{display:'flex',flexDirection:'column',gap:2,marginTop:4}},reasons.map((r,i)=>h('span',{key:i,style:{display:'flex',alignItems:'center',gap:4,fontSize:10,color:'#64748b'}},h(IC.Clock),' ',r))),
        isSk&&h('span',{style:{display:'inline-block',marginTop:3,fontSize:10,fontWeight:600,color:'#64748b',fontStyle:'italic'}},'Skipped')),
      canSk&&h('button',{style:{width:30,height:30,borderRadius:7,border:'1px solid rgba(100,116,139,0.3)',background:'rgba(100,116,139,0.1)',color:'#64748b',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0},onClick:e=>{e.stopPropagation();doS(task.id)}},h(IC.X)));
  };

  // ═══ RENDER ═══
  return h('div',{style:{fontFamily:F,background:'#0c0f1a',minHeight:'100vh',maxWidth:480,margin:'0 auto',position:'relative',color:'#e2e8f0'}},
    // Banner
    banner&&h('div',{style:{position:'fixed',top:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,background:'linear-gradient(135deg,#f59e0b,#d97706)',color:'#0c0f1a',padding:'14px 16px',display:'flex',alignItems:'center',gap:10,zIndex:300,paddingTop:'calc(14px + env(safe-area-inset-top))'}},
      h('span',{style:{fontSize:16}},'⏰'),h('span',{style:{flex:1,fontSize:14,fontWeight:700}},banner),h('button',{style:{background:'none',border:'none',color:'#0c0f1a',cursor:'pointer',padding:4,display:'flex'},onClick:()=>setBanner(null)},h(IC.X))),
    // Header
    h('div',{style:{padding:'16px 20px 12px',background:'linear-gradient(180deg,#0c0f1a,rgba(12,15,26,0.95))',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(148,163,184,0.06)',display:'flex',alignItems:'center',gap:12}},
      h('div',{style:{display:'flex',alignItems:'center',gap:12,flex:1}},
        h('span',{style:{fontSize:22,fontWeight:700,color:'#f8fafc'}},tab==='day'?'My Day':'Manage'),
        h('span',{style:{fontSize:14,color:'#64748b',fontVariantNumeric:'tabular-nums'}},ct),
        h('span',{className:'sd '+(synced?'sd-on':'sd-off')})),
      h('button',{style:{background:'none',border:'none',cursor:'pointer',padding:6,display:'flex',color:nOn?'#f59e0b':'#475569'},onClick:nOn?()=>setNOn(false):rqN},nOn?h(IC.Bell):h(IC.BellOff))),
    // Content
    h('div',{style:{padding:'12px 16px',paddingBottom:90}},
      tab==='day'?
      // ═══ DAY VIEW ═══
      h('div',{style:{paddingBottom:80}},
        // Toggle
        h('div',{style:{marginBottom:16}},h('div',{style:{display:'flex',position:'relative',background:'#1e293b',borderRadius:14,padding:4,height:48}},
          h('div',{style:{position:'absolute',top:4,left:4,width:'calc(50% - 4px)',height:40,borderRadius:11,transition:'all .3s',zIndex:0,transform:mode==='work'?'translateX(100%)':'translateX(0%)',background:mode==='personal'?'linear-gradient(135deg,#a855f7,#7c3aed)':'linear-gradient(135deg,#3b82f6,#2563eb)'}}),
          h('button',{style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer',zIndex:1,position:'relative',fontFamily:F,color:mode==='personal'?'#fff':'#94a3b8'},onClick:()=>setMode('personal')},h(IC.Sun),' Personal'),
          h('button',{style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer',zIndex:1,position:'relative',fontFamily:F,color:mode==='work'?'#fff':'#94a3b8'},onClick:()=>setMode('work')},h(IC.Brief),' Work'))),
        // Progress
        h('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:16}},
          h('div',{style:{flex:1,height:6,background:'#1e293b',borderRadius:3,overflow:'hidden'}},
            h('div',{style:{height:'100%',borderRadius:3,transition:'width .5s',width:pct*100+'%',background:pct===1?'linear-gradient(90deg,#10b981,#34d399)':'linear-gradient(90deg,#f59e0b,#fbbf24)'}})),
          h('span',{style:{fontSize:13,fontWeight:600,color:'#94a3b8',minWidth:32,textAlign:'right'}},rCnt+'/'+dayT.length)),
        // Hero
        nxt&&h('div',{style:{background:'linear-gradient(135deg,rgba(251,191,36,0.06),rgba(251,191,36,0.02))',border:'1px solid rgba(251,191,36,0.18)',borderRadius:20,padding:'24px 20px',marginBottom:8,boxShadow:'0 0 40px rgba(251,191,36,0.06),0 8px 32px rgba(0,0,0,0.3)',cursor:'pointer'},onClick:()=>setViewing(nxt)},
          h('div',{style:{display:'flex',alignItems:'center',gap:8,color:'#f59e0b',marginBottom:12}},h(IC.Focus),h('span',{style:{fontSize:12,fontWeight:800,letterSpacing:'0.1em'}},'FOCUS NOW')),
          h('div',{style:{fontSize:26,fontWeight:800,color:'#fef3c7',lineHeight:1.2,marginBottom:10}},dN(nxt)),
          h('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:18,flexWrap:'wrap'}},
            h('span',{style:{fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:5,border:'1px solid '+CAT[nxt.category].border,background:CAT[nxt.category].bg,color:CAT[nxt.category].text,textTransform:'uppercase'}},CAT[nxt.category].label),
            nxt.project&&h('span',{style:{fontSize:12,fontWeight:600,color:'#94a3b8',background:'rgba(148,163,184,0.1)',padding:'3px 10px',borderRadius:6}},nxt.project),
            nxt.notes&&h('span',{style:{color:'#64748b',display:'flex',gap:3}},h(IC.Note))),
          h('div',{style:{display:'flex',gap:10},onClick:e=>e.stopPropagation()},
            h('button',{style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px 20px',background:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:14,color:'#fff',fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:()=>doC(nxt.id)},h(IC.CheckBig),' Done'),
            (nxt.category==='core'||nxt.category==='event')&&h('button',{style:{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'14px 20px',background:'rgba(100,116,139,0.15)',border:'1px solid rgba(100,116,139,0.3)',borderRadius:14,color:'#94a3b8',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:()=>doS(nxt.id)},h(IC.X),' Skip'))),
        pct===1&&h('div',{style:{background:'linear-gradient(135deg,rgba(16,185,129,0.06),rgba(16,185,129,0.02))',border:'1px solid rgba(16,185,129,0.18)',borderRadius:20,padding:'24px 20px',marginBottom:8,textAlign:'center'}},
          h('span',{style:{fontSize:28}},'🎉'),h('div',{style:{fontSize:22,fontWeight:800,color:'#34d399',marginTop:8}},'All done!')),
        // Rest
        rest.length>0&&h('div',{style:{marginTop:12}},
          h('div',{style:{fontSize:11,fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8,padding:'0 4px'}},'Up ahead'),
          h('div',{style:{display:'flex',flexDirection:'column',gap:6}},rest.map(rCard))),
        rCnt>0&&h('button',{style:{display:'flex',alignItems:'center',justifyContent:'center',gap:10,width:'100%',padding:14,marginTop:24,background:'linear-gradient(135deg,#1e293b,#0f172a)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:14,color:'#fbbf24',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:()=>setCEnd(true)},h(IC.Moon),' End Day'))
      :
      // ═══ ADMIN VIEW ═══
      h('div',{style:{paddingBottom:100}},
        ['core','event','work','personal'].map(cat=>{
          const list=grp[cat];if(!list||!list.length)return null;const c=CAT[cat];
          return h('div',{key:cat,style:{marginBottom:24}},
            h('div',{style:{display:'flex',alignItems:'center',gap:8,fontSize:13,fontWeight:700,textTransform:'uppercase',color:c.text,marginBottom:10,padding:'0 4px'}},
              h('span',{style:{width:8,height:8,borderRadius:4,background:c.border,display:'inline-block'}}),c.label+' ('+list.length+')',
              (cat==='work'||cat==='personal')&&h('span',{style:{fontSize:10,fontWeight:500,color:'#475569',fontStyle:'italic',textTransform:'none',marginLeft:6}},'→ after Core/Events')),
            list.map((task,idx)=>h('div',{key:task.id,style:{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:'#111827',borderRadius:12,borderLeft:'3px solid '+c.border,marginBottom:6}},
              h('div',{style:{flex:1,minWidth:0}},
                h('div',{style:{fontSize:14,fontWeight:600,color:'#e2e8f0'}},task.name),
                task.project&&h('div',{style:{fontSize:11,color:'#64748b',marginTop:2}},'📁 '+task.project),
                h('div',{style:{display:'flex',flexWrap:'wrap',gap:6,marginTop:4}},
                  task.timeCondition&&h('span',{style:{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'#64748b'}},h(IC.Clock),' '+task.timeCondition.time),
                  task.category==='event'&&(task.eventDates||[]).length>0&&h('span',{style:{fontSize:11,color:'#64748b'}},'📅 '+task.eventDates.join(', ')),
                  (task.activeDays||[]).length>0&&(task.activeDays||[]).length<7&&h('span',{style:{fontSize:11,color:'#64748b'}},(task.activeDays||[]).map(d=>DF[d]).join(', ')),
                  task.notes&&h('span',{style:{fontSize:11,color:'#475569',display:'flex',alignItems:'center',gap:4}},h(IC.Note),' notes'))),
              h('div',{style:{display:'flex',gap:3,flexShrink:0,flexWrap:'wrap',justifyContent:'flex-end',maxWidth:76}},
                h('button',{style:{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:8,color:'#94a3b8',cursor:'pointer'},onClick:()=>mvT(task.id,'up'),disabled:idx===0},h(IC.Up)),
                h('button',{style:{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:8,color:'#94a3b8',cursor:'pointer'},onClick:()=>mvT(task.id,'down'),disabled:idx===list.length-1},h(IC.Down)),
                h('button',{style:{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:8,color:'#60a5fa',cursor:'pointer'},onClick:()=>setEditing(task)},h(IC.Edit)),
                task.category==='event'?
                  h('button',{style:{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:8,color:'#94a3b8',cursor:'pointer'},onClick:()=>arT(task.id)},h(IC.Archive)):
                  h('button',{style:{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',background:'#1e293b',border:'none',borderRadius:8,color:'#f87171',cursor:'pointer'},onClick:()=>setCDel(task.id)},h(IC.Trash))))))
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
    editing!==null&&h(TaskForm,{task:editing==='new'?null:editing,allTasks:tasks,onSave:svT,onClose:()=>setEditing(null)}),
    viewing!==null&&h(DetailSheet,{task:viewing,dispName:dN(viewing),onClose:()=>setViewing(null),onUpdateNotes:n=>{uN(viewing.id,n);setViewing({...viewing,notes:n})}}),
    cEnd&&h(Confirm,{title:'End Day',msg:'Reset all progress?',onOk:endD,onNo:()=>setCEnd(false),okLbl:'Reset',okClr:'#f59e0b'}),
    cDel&&h(Confirm,{title:'Delete',msg:'Delete "'+(tasks.find(t=>t.id===cDel)?.name||'')+'"?',onOk:()=>delT(cDel),onNo:()=>setCDel(null),okLbl:'Delete',okClr:'#ef4444'})
  );
}

// ═══ DETAIL SHEET ═══
function DetailSheet({task,dispName,onClose,onUpdateNotes}){
  const[notes,setNotes]=useState(task.notes||'');const[dirty,setDirty]=useState(false);const c=CAT[task.category];
  return h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16},onClick:onClose},
    h('div',{style:{width:'100%',maxWidth:440,background:'#1e293b',borderRadius:20,padding:'24px 20px',maxHeight:'85vh',overflow:'auto'},onClick:e=>e.stopPropagation()},
      h('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:4}},
        h('span',{style:{fontSize:10,fontWeight:700,padding:'2px 6px',borderRadius:5,border:'1px solid '+c.border,background:c.bg,color:c.text,textTransform:'uppercase'}},c.label),
        task.project&&h('span',{style:{fontSize:12,color:'#64748b'}},task.project)),
      h('h2',{style:{fontSize:18,fontWeight:700,color:'#f8fafc',margin:'8px 0 20px'}},dispName),
      task.timeCondition&&h('div',{style:{display:'flex',alignItems:'center',gap:6,marginBottom:8,color:'#64748b',fontSize:12}},h(IC.Clock),' '+task.timeCondition.time),
      task.category==='event'&&(task.eventDates||[]).length>0&&h('div',{style:{fontSize:12,color:'#fb7185',marginBottom:8}},'📅 '+task.eventDates.join(', ')),
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
  const isE=!!task;
  const[name,setName]=useState(task?.name||'');const[category,setCat]=useState(task?.category||'core');
  const[project,setProj]=useState(task?.project||'');const[notes,setNotes]=useState(task?.notes||'');
  const[hasTime,setHT]=useState(!!task?.timeCondition);const[time,setTime]=useState(task?.timeCondition?.time||'08:00');
  const[lb,setLb]=useState(task?.timeCondition?.labelBefore||'');const[la,setLa]=useState(task?.timeCondition?.labelAfter||'');
  const[dep,setDep]=useState(task?.dependsOn||'');const[activeDays,setAD]=useState(task?.activeDays||[...ALL_DAYS]);
  const[eventDates,setED]=useState(task?.eventDates||[]);const[newDate,setNewDate]=useState('');
  const togD=d=>setAD(p=>p.includes(d)?p.filter(x=>x!==d):[...p,d]);
  const addD=()=>{if(newDate&&!eventDates.includes(newDate)){setED(p=>[...p,newDate].sort());setNewDate('')}};
  const submit=()=>{if(!name.trim())return;onSave({...(isE?task:{}),name:name.trim(),category,project:project.trim(),notes:notes.trim(),
    timeCondition:hasTime?{time,labelBefore:lb.trim()||null,labelAfter:la.trim()||null}:null,
    dependsOn:dep||null,activeDays:category==='event'?[]:activeDays,eventDates:category==='event'?eventDates:[],archived:task?.archived||false})};
  const projects=[...new Set(allTasks.map(t=>t.project).filter(Boolean))];
  const inp={width:'100%',padding:'12px 14px',background:'#0f172a',border:'1px solid #334155',borderRadius:10,color:'#e2e8f0',fontSize:14,fontFamily:F,outline:'none',boxSizing:'border-box'};
  const lbl={display:'block',fontSize:12,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6,marginTop:16};
  return h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16},onClick:onClose},
    h('div',{style:{width:'100%',maxWidth:440,background:'#1e293b',borderRadius:20,padding:'24px 20px',maxHeight:'85vh',overflow:'auto'},onClick:e=>e.stopPropagation()},
      h('h2',{style:{fontSize:18,fontWeight:700,color:'#f8fafc',margin:'0 0 20px'}},isE?'Edit Task':'New Task'),
      h('label',{style:lbl},'Name'),h('input',{style:inp,value:name,onChange:e=>setName(e.target.value),placeholder:'Task name',autoFocus:true}),
      h('label',{style:lbl},'Category'),h('select',{style:{...inp,WebkitAppearance:'none'},value:category,onChange:e=>setCat(e.target.value)},
        h('option',{value:'core'},'Core'),h('option',{value:'event'},'Event'),h('option',{value:'work'},'Work'),h('option',{value:'personal'},'Personal')),
      h('label',{style:lbl},'Project'),h('input',{style:inp,value:project,onChange:e=>setProj(e.target.value),placeholder:'Project',list:'pl'}),
      h('datalist',{id:'pl'},projects.map(p=>h('option',{key:p,value:p}))),
      h('label',{style:lbl},'Notes'),h('textarea',{style:{...inp,minHeight:50,resize:'vertical'},value:notes,onChange:e=>setNotes(e.target.value),placeholder:'Context...'}),
      category!=='event'&&h('div',null,h('label',{style:lbl},'Active Days'),
        h('div',{style:{display:'flex',gap:4,flexWrap:'wrap'}},DAYS.map(d=>h('button',{key:d,onClick:()=>togD(d),style:{padding:'8px 12px',borderRadius:8,fontSize:12,fontWeight:700,fontFamily:F,cursor:'pointer',border:activeDays.includes(d)?'2px solid #f59e0b':'2px solid #1e293b',background:activeDays.includes(d)?'rgba(251,191,36,0.15)':'#0f172a',color:activeDays.includes(d)?'#fbbf24':'#475569'}},DF[d])))),
      category==='event'&&h('div',null,h('label',{style:lbl},'Dates'),
        h('div',{style:{display:'flex',gap:8,marginBottom:8}},h('input',{type:'date',style:{...inp,flex:1},value:newDate,onChange:e=>setNewDate(e.target.value)}),
          h('button',{style:{padding:'10px 16px',background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',borderRadius:12,color:'#0c0f1a',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:addD},'Add')),
        h('div',{style:{display:'flex',flexWrap:'wrap',gap:6}},eventDates.map(d=>h('span',{key:d,style:{display:'flex',alignItems:'center',gap:4,fontSize:12,background:'rgba(244,63,94,0.15)',color:'#fb7185',padding:'4px 10px',borderRadius:8,fontWeight:600}},
          d,h('button',{onClick:()=>setED(p=>p.filter(x=>x!==d)),style:{background:'none',border:'none',color:'#fb7185',cursor:'pointer',padding:0,display:'flex'}},h(IC.X)))),
          eventDates.length===0&&h('span',{style:{fontSize:12,color:'#475569',fontStyle:'italic'}},'No dates'))),
      h('label',{style:lbl},'Depends On'),h('select',{style:{...inp,WebkitAppearance:'none'},value:dep,onChange:e=>setDep(e.target.value)},
        h('option',{value:''},'None'),allTasks.filter(t=>t.id!==task?.id).map(t=>h('option',{key:t.id,value:t.id},t.name+' ('+CAT[t.category]?.label+')'))),
      (category==='work'||category==='personal')&&h('p',{style:{fontSize:11,color:'#64748b',marginTop:6,fontStyle:'italic'}},'ℹ️ Auto-waits for Core & Events.'),
      h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:16}},
        h('label',{style:{...lbl,marginTop:0}},'Time'),
        h('button',{style:{width:44,height:24,borderRadius:12,border:'none',cursor:'pointer',position:'relative',padding:0,background:hasTime?'#f59e0b':'#334155'},onClick:()=>setHT(!hasTime)},
          h('div',{style:{width:20,height:20,borderRadius:10,background:'#fff',position:'absolute',top:2,transition:'transform .2s',transform:hasTime?'translateX(20px)':'translateX(2px)'}}))),
      hasTime&&h('div',{style:{background:'#0f172a',borderRadius:12,padding:'8px 14px 14px',marginTop:8}},
        h('label',{style:{display:'block',fontSize:11,fontWeight:600,color:'#64748b',marginBottom:4,marginTop:10}},'At'),h('input',{type:'time',style:inp,value:time,onChange:e=>setTime(e.target.value)}),
        h('label',{style:{display:'block',fontSize:11,fontWeight:600,color:'#64748b',marginBottom:4,marginTop:10}},'Before'),h('input',{style:inp,value:lb,onChange:e=>setLb(e.target.value),placeholder:'Optional'}),
        h('label',{style:{display:'block',fontSize:11,fontWeight:600,color:'#64748b',marginBottom:4,marginTop:10}},'After'),h('input',{style:inp,value:la,onChange:e=>setLa(e.target.value),placeholder:'Optional'})),
      h('div',{style:{display:'flex',gap:10,marginTop:24}},
        h('button',{style:{flex:1,padding:14,background:'#0f172a',border:'1px solid #334155',borderRadius:12,color:'#94a3b8',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:onClose},'Cancel'),
        h('button',{style:{flex:1,padding:14,background:'linear-gradient(135deg,#f59e0b,#d97706)',border:'none',borderRadius:12,color:'#0c0f1a',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:submit,disabled:!name.trim()},isE?'Save':'Add'))));
}

// ═══ CONFIRM ═══
function Confirm({title,msg,onOk,onNo,okLbl,okClr}){
  return h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16},onClick:onNo},
    h('div',{style:{width:'100%',maxWidth:340,background:'#1e293b',borderRadius:20,padding:'24px 20px'},onClick:e=>e.stopPropagation()},
      h('h2',{style:{fontSize:18,fontWeight:700,color:'#f8fafc',margin:'0 0 20px'}},title),
      h('p',{style:{fontSize:14,color:'#94a3b8',lineHeight:1.5,margin:'0 0 20px'}},msg),
      h('div',{style:{display:'flex',gap:10}},
        h('button',{style:{flex:1,padding:14,background:'#0f172a',border:'1px solid #334155',borderRadius:12,color:'#94a3b8',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:F},onClick:onNo},'Cancel'),
        h('button',{style:{flex:1,padding:14,background:okClr,border:'none',borderRadius:12,color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:F},onClick:onOk},okLbl))));
}

// ═══ MOUNT ═══
ReactDOM.createRoot(document.getElementById('root')).render(h(App));
