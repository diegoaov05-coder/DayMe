// ═══ FIREBASE + SW ═══
firebase.initializeApp({apiKey:"AIzaSyAfMcI-3cIwWz1AlrkmisqNuZvcJ7wUfP4",authDomain:"dayone-14927.firebaseapp.com",databaseURL:"https://dayone-14927-default-rtdb.firebaseio.com",projectId:"dayone-14927",storageBucket:"dayone-14927.firebasestorage.app",messagingSenderId:"775317638738",appId:"1:775317638738:web:46bd112241356da613198b"});
const db=firebase.database(),dataRef=db.ref('routineApp');
let swReg=null;if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').then(r=>{swReg=r}).catch(()=>{});
function ntfy(t,b,g){if(swReg)try{swReg.showNotification(t,{body:b,tag:g||'md',renotify:true,vibrate:[200,100,200],requireInteraction:true})}catch(e){}else if('Notification' in window&&Notification.permission==='granted')try{new Notification(t,{body:b,tag:g||'md'})}catch(e){}}

// BUILD: 2026-03-10 v11-minimal
const LK='routine-sync-v6',DAYS=['sun','mon','tue','wed','thu','fri','sat'],
  DF={sun:'Sun',mon:'Mon',tue:'Tue',wed:'Wed',thu:'Thu',fri:'Fri',sat:'Sat'},
  DL={sun:'S',mon:'M',tue:'T',wed:'W',thu:'T',fri:'F',sat:'S'},ALL_DAYS=[...DAYS];
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

// ─── DESIGN TOKENS ───────────────────────────────────────────────
// One warm accent, everything else whispers
const ACCENT   = '#E8956D';  // terracotta pastel — the only loud voice
const ACCENT2  = '#6DB5C8';  // sky blue — secondary accent
const SUCCESS  = '#7DC8A0';  // mint green
const BG       = '#FAFAF8';  // warm near-white
const CARD     = '#FFFFFF';
const BORDER   = '#EEE9E3';
const TEXT1    = '#2C2825';  // near-black, warm
const TEXT2    = '#7A726A';  // medium warm gray
const TEXT3    = '#B5ADA6';  // light warm gray

// Category: subtle tints, no heavy borders
const CAT={
  core:    {bg:'rgba(232,149,109,0.08)',border:'rgba(232,149,109,0.3)', text:ACCENT,  dot:'#FFBF9E', label:'Core'},
  event:   {bg:'rgba(109,181,200,0.08)',border:'rgba(109,181,200,0.3)', text:ACCENT2, dot:'#A8D9E8', label:'Event'},
  work:    {bg:'rgba(125,157,200,0.08)',border:'rgba(125,157,200,0.3)', text:'#5A82B4',dot:'#A8C0E0', label:'Work'},
  personal:{bg:'rgba(160,130,200,0.08)',border:'rgba(160,130,200,0.3)', text:'#8060B4',dot:'#C4A8E8', label:'Personal'}
};

// ─── FONTS & CSS ─────────────────────────────────────────────────
if(!document.getElementById('cFont')){
  const lk=document.createElement('link');lk.id='cFont';lk.rel='stylesheet';
  lk.href='https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=Instrument+Serif:ital@0;1&display=swap';
  document.head.appendChild(lk);
}
if(!document.getElementById('cCSS')){
  const s=document.createElement('style');s.id='cCSS';
  s.textContent=`
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{background:#FAFAF8;margin:0;font-family:"DM Sans",system-ui,sans-serif;color:#2C2825;-webkit-font-smoothing:antialiased}
::selection{background:rgba(232,149,109,0.18)}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#E4DDD6;border-radius:99px}
input,textarea,select,button{font-family:"DM Sans",system-ui,sans-serif}
@keyframes popIn{0%{transform:scale(0.7);opacity:0}70%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
@keyframes cbPulse{0%{transform:scale(1)}40%{transform:scale(1.22)}100%{transform:scale(1)}}
@keyframes confetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-130px) rotate(720deg);opacity:0}}
@keyframes fadeSlideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes heroBreath{0%,100%{box-shadow:0 4px 28px rgba(232,149,109,0.15),0 1px 4px rgba(0,0,0,0.04)}50%{box-shadow:0 8px 44px rgba(232,149,109,0.24),0 1px 4px rgba(0,0,0,0.04)}}
.cb-pulse{animation:cbPulse .28s ease-out}
.fade-up{animation:fadeSlideUp .35s cubic-bezier(.22,1,.36,1) both}
.hero-card{animation:heroBreath 4s ease-in-out infinite}
.sd{display:inline-block;width:5px;height:5px;border-radius:50%}
.sd-on{background:#A8D5B5}.sd-off{background:#E4DDD6}
`;
  document.head.appendChild(s);
}

const F="'DM Sans',system-ui,sans-serif";
const SERIF="'Instrument Serif',Georgia,serif";

const h=React.createElement;
const{useState,useEffect,useCallback,useRef}=React;

// ─── ICONS ───────────────────────────────────────────────────────
function icon(ps,w){w=w||16;return()=>h('svg',{width:w,height:w,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'},...ps.map(p=>typeof p==='string'?h('path',{d:p}):h(p[0],p[1])))}
const IC={
  Sun:icon([['circle',{cx:12,cy:12,r:5}],['line',{x1:12,y1:1,x2:12,y2:3}],['line',{x1:12,y1:21,x2:12,y2:23}],['line',{x1:4.22,y1:4.22,x2:5.64,y2:5.64}],['line',{x1:18.36,y1:18.36,x2:19.78,y2:19.78}],['line',{x1:1,y1:12,x2:3,y2:12}],['line',{x1:21,y1:12,x2:23,y2:12}],['line',{x1:4.22,y1:19.78,x2:5.64,y2:18.36}],['line',{x1:18.36,y1:5.64,x2:19.78,y2:4.22}]],20),
  Brief:icon([['rect',{x:2,y:7,width:20,height:14,rx:2}],'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],20),
  Cal:icon([['rect',{x:3,y:4,width:18,height:18,rx:2}],['line',{x1:16,y1:2,x2:16,y2:6}],['line',{x1:8,y1:2,x2:8,y2:6}],['line',{x1:3,y1:10,x2:21,y2:10}]],20),
  Gear:icon([['circle',{cx:12,cy:12,r:3}],'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'],20),
  Plus:()=>h('svg',{width:22,height:22,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'},h('line',{x1:12,y1:5,x2:12,y2:19}),h('line',{x1:5,y1:12,x2:19,y2:12})),
  Edit:icon(['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z']),
  Trash:icon([['polyline',{points:'3 6 5 6 21 6'}],'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2']),
  Lock:icon([['rect',{x:3,y:11,width:18,height:11,rx:2}],'M7 11V7a5 5 0 0 1 10 0v4'],14),
  Check:()=>h('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.5,strokeLinecap:'round',strokeLinejoin:'round'},h('polyline',{points:'20 6 9 17 4 12'})),
  CheckBig:()=>h('svg',{width:22,height:22,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.5,strokeLinecap:'round',strokeLinejoin:'round'},h('polyline',{points:'20 6 9 17 4 12'})),
  X:()=>h('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.5,strokeLinecap:'round'},h('line',{x1:18,y1:6,x2:6,y2:18}),h('line',{x1:6,y1:6,x2:18,y2:18})),
  Moon:icon(['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'],18),
  Focus:()=>h('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'},h('circle',{cx:12,cy:12,r:10}),h('circle',{cx:12,cy:12,r:6}),h('circle',{cx:12,cy:12,r:2})),
  Bell:icon(['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0']),
  BellOff:icon(['M13.73 21a2 2 0 0 1-3.46 0','M18.63 13A17.89 17.89 0 0 1 18 8','M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14',['line',{x1:1,y1:1,x2:23,y2:23}]]),
  Note:icon(['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',['polyline',{points:'14 2 14 8 20 8'}],['line',{x1:16,y1:13,x2:8,y2:13}],['line',{x1:16,y1:17,x2:8,y2:17}]],14),
  Archive:icon([['polyline',{points:'21 8 21 21 3 21 3 8'}],['rect',{x:1,y:3,width:22,height:5}],['line',{x1:10,y1:12,x2:14,y2:12}]],14),
  Copy:icon([['rect',{x:9,y:9,width:13,height:13,rx:2}],'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1']),
  Pause:icon([['rect',{x:6,y:4,width:4,height:16}],['rect',{x:14,y:4,width:4,height:16}]]),
  Play:icon([['polygon',{points:'5 3 19 12 5 21 5 3'}]]),
  Grip:()=>h('svg',{width:12,height:12,viewBox:'0 0 24 24',fill:'currentColor',stroke:'none'},h('circle',{cx:8,cy:4,r:2}),h('circle',{cx:16,cy:4,r:2}),h('circle',{cx:8,cy:12,r:2}),h('circle',{cx:16,cy:12,r:2}),h('circle',{cx:8,cy:20,r:2}),h('circle',{cx:16,cy:20,r:2})),
  Zap:icon(['M13 2L3 14h9l-1 10 10-12h-9l1-10'],16),
  Gift:icon([['polyline',{points:'20 12 20 22 4 22 4 12'}],['rect',{x:2,y:7,width:20,height:5}],['line',{x1:12,y1:22,x2:12,y2:7}],'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z','M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'],16)
};

// ─── CELEBRATION ─────────────────────────────────────────────────
function Celebration({text,big,onDone}){
  const[op,setOp]=useState(0);
  useEffect(()=>{
    setOp(1);
    const t=setTimeout(()=>{setOp(0);setTimeout(onDone,500)},big?4500:1400);
    return()=>clearTimeout(t);
  },[]);
  const cf=big?Array.from({length:24},(_,i)=>({
    l:5+Math.random()*90,d:1.2+Math.random()*2,
    c:['#FFD4BA','#BAE0FF','#D4BAFF','#BAFFDA','#FFE4BA','#FFBACC'][i%6],
    sz:4+Math.random()*8
  })):[];
  return h('div',{style:{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:999,pointerEvents:'none',transition:'opacity .5s',opacity:op}},
    cf.map((c,i)=>h('div',{key:i,style:{position:'absolute',left:c.l+'%',bottom:'25%',width:c.sz,height:c.sz,borderRadius:c.sz>6?'50%':'2px',background:c.c,animation:`confetti ${c.d}s ease-out ${i*50}ms both`}})),
    h('div',{style:{textAlign:'center'}},
      h('div',{style:{fontSize:big?80:44,animation:'popIn .45s cubic-bezier(.175,.885,.32,1.275) forwards'}},big?'🏆':'✅'),
      big&&h('div',{style:{fontSize:18,marginTop:4,animation:'popIn .45s .2s both'}},'🎉🎉🎉'),
      h('div',{style:{
        fontSize:big?28:17,fontWeight:700,
        color:big?ACCENT:SUCCESS,
        fontFamily:big?SERIF:F,
        fontStyle:big?'italic':'normal',
        textShadow:big?`0 0 40px rgba(232,149,109,0.5)`:`0 0 20px rgba(125,200,160,0.5)`,
        animation:`popIn .45s ${big?'.3s':'.12s'} cubic-bezier(.175,.885,.32,1.275) both`,
        marginTop:big?14:8
      }},text),
      big&&h('div',{style:{fontSize:13,color:TEXT3,marginTop:10,animation:'popIn .45s .5s both'}},
        '¡Lo lograste!')));
}

// ─── LOG VIEW ────────────────────────────────────────────────────
function LogView({dailyLogs,lifeGoals,setLifeGoals,timeline,setTimeline,markDirty}){
  const[openDay,setOpenDay]=useState(null);
  const[logTab,setLogTab]=useState('summary');
  const[addGoal,setAddGoal]=useState(false);
  const[addTL,setAddTL]=useState(false);
  const[gName,setGName]=useState('');const[gDesc,setGDesc]=useState('');
  const[gS,setGS]=useState('');const[gM,setGM]=useState('');const[gA,setGA]=useState('');const[gR,setGR]=useState('');const[gT,setGT]=useState('');
  const[tlDate,setTlDate]=useState('');const[tlTitle,setTlTitle]=useState('');const[tlDesc,setTlDesc]=useState('');const[tlEmoji,setTlEmoji]=useState('⭐');
  const[expandGoal,setExpandGoal]=useState(null);
  const cats=['core','event','work','personal'];
  const catColor={core:ACCENT,event:ACCENT2,work:'#5A82B4',personal:'#8060B4'};
  const catEmoji={core:'🔵',event:'📅',work:'💼',personal:'🟢'};
  const fmtDate=d=>{if(!d)return'';const p=d.split('-');const dt=new Date(p[0],p[1]-1,p[2]);return dt.toLocaleDateString('en',{weekday:'short',month:'short',day:'numeric'})};
  const fmtMonth=d=>{if(!d)return'';const p=d.split('-');const dt=new Date(p[0],p[1]-1,p[2]);return dt.toLocaleDateString('en',{month:'long',year:'numeric'})};

  const saveGoal=()=>{if(!gName.trim())return;markDirty();
    setLifeGoals(p=>[{id:Date.now().toString(),name:gName.trim(),description:gDesc.trim(),smart:{s:gS.trim(),m:gM.trim(),a:gA.trim(),r:gR.trim(),t:gT.trim()},done:false,createdAt:getISO()},...p]);
    setGName('');setGDesc('');setGS('');setGM('');setGA('');setGR('');setGT('');setAddGoal(false)};
  const toggleGoalDone=id=>{markDirty();setLifeGoals(p=>p.map(g=>g.id===id?{...g,done:!g.done}:g))};
  const delGoal=id=>{markDirty();setLifeGoals(p=>p.filter(g=>g.id!==id))};
  const saveTL=()=>{if(!tlTitle.trim()||!tlDate)return;markDirty();
    setTimeline(p=>[...p,{id:Date.now().toString(),date:tlDate,title:tlTitle.trim(),description:tlDesc.trim(),emoji:tlEmoji||'⭐'}].sort((a,b)=>b.date.localeCompare(a.date)));
    setTlDate('');setTlTitle('');setTlDesc('');setTlEmoji('⭐');setAddTL(false)};
  const delTL=id=>{markDirty();setTimeline(p=>p.filter(t=>t.id!==id))};

  // shared input style
  const inp={width:'100%',padding:'10px 13px',background:BG,border:`1.5px solid ${BORDER}`,borderRadius:10,color:TEXT1,fontSize:13,fontFamily:F,outline:'none',boxSizing:'border-box'};
  const lbl={display:'block',fontSize:10,fontWeight:600,color:TEXT3,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:4,marginTop:12};

  const tabBtn=(id,label,activeColor)=>h('button',{key:id,onClick:()=>setLogTab(id),style:{
    flex:1,padding:'8px 4px',border:'none',background:logTab===id?activeColor:'transparent',
    borderRadius:9,fontSize:10,fontWeight:700,cursor:'pointer',fontFamily:F,
    color:logTab===id?'#fff':TEXT3,transition:'all .18s'
  }},label);

  return h('div',{style:{paddingBottom:100}},
    // Tab bar
    h('div',{style:{display:'flex',gap:3,marginBottom:16,background:'#F2EDE8',borderRadius:13,padding:3}},
      tabBtn('summary','📊 Days',ACCENT),
      tabBtn('notes','📝 Notes','#8060B4'),
      tabBtn('goals','🎯 Goals',ACCENT2),
      tabBtn('timeline','🏆 Timeline',SUCCESS)),

    // ── GOALS ──
    logTab==='goals'&&h('div',null,
      !addGoal&&h('button',{onClick:()=>setAddGoal(true),style:{
        width:'100%',padding:'12px 16px',marginBottom:12,
        background:'transparent',border:`1.5px dashed ${BORDER}`,
        borderRadius:14,color:TEXT3,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F
      }},'+ New goal'),
      addGoal&&h('div',{style:{background:CARD,borderRadius:16,padding:16,marginBottom:12,boxShadow:`0 2px 12px rgba(0,0,0,0.06)`}},
        h('input',{style:{...inp,fontSize:15,fontWeight:600,marginBottom:8},value:gName,onChange:e=>setGName(e.target.value),placeholder:'Goal name'}),
        h('textarea',{style:{...inp,minHeight:50,resize:'vertical',marginBottom:10},value:gDesc,onChange:e=>setGDesc(e.target.value),placeholder:'Why this matters...'}),
        h('div',{style:{fontSize:10,fontWeight:700,color:SUCCESS,marginBottom:6,letterSpacing:'0.08em'}},'SMART'),
        [{k:'s',l:'Specific',v:gS,f:setGS,p:'What exactly?'},{k:'m',l:'Measurable',v:gM,f:setGM,p:'How will you measure?'},{k:'a',l:'Achievable',v:gA,f:setGA,p:'Steps?'},{k:'r',l:'Relevant',v:gR,f:setGR,p:'Why now?'},{k:'t',l:'Time-bound',v:gT,f:setGT,p:'By when?'}]
          .map(x=>h('div',{key:x.k,style:{marginBottom:5}},
            h('div',{style:{fontSize:9,fontWeight:700,color:TEXT3,marginBottom:2}},x.l.charAt(0)),
            h('input',{style:{...inp,padding:'7px 10px',fontSize:11},value:x.v,onChange:e=>x.f(e.target.value),placeholder:x.p}))),
        h('div',{style:{display:'flex',gap:8,marginTop:10}},
          h('button',{onClick:()=>setAddGoal(false),style:{flex:1,padding:10,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:10,color:TEXT2,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:F}},'Cancel'),
          h('button',{onClick:saveGoal,style:{flex:1,padding:10,background:SUCCESS,border:'none',borderRadius:10,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:F}},'Save'))),
      (!lifeGoals||lifeGoals.length===0)&&!addGoal&&h('div',{style:{textAlign:'center',padding:'48px 20px'}},h('div',{style:{fontSize:36,marginBottom:8}},'🎯'),h('div',{style:{fontSize:13,color:TEXT3}},'Set your first goal')),
      (lifeGoals||[]).map(g=>{
        const isExp=expandGoal===g.id;const sm=g.smart||{};const hasSmart=sm.s||sm.m||sm.a||sm.r||sm.t;
        return h('div',{key:g.id,onClick:()=>setExpandGoal(isExp?null:g.id),style:{
          background:CARD,borderRadius:14,padding:'13px 15px',marginBottom:7,
          boxShadow:`0 1px 6px rgba(0,0,0,0.05)`,cursor:'pointer',
          borderLeft:`3px solid ${g.done?SUCCESS:BORDER}`
        }},
          h('div',{style:{display:'flex',alignItems:'center',gap:10}},
            h('button',{onClick:e=>{e.stopPropagation();toggleGoalDone(g.id)},style:{
              width:22,height:22,borderRadius:11,border:`2px solid ${g.done?SUCCESS:'#E0D8D0'}`,
              background:g.done?SUCCESS:'transparent',display:'flex',alignItems:'center',justifyContent:'center',
              cursor:'pointer',flexShrink:0,color:'#fff',fontSize:11
            }},g.done?'✓':''),
            h('div',{style:{flex:1}},
              h('div',{style:{fontSize:14,fontWeight:600,color:g.done?TEXT3:TEXT1,textDecoration:g.done?'line-through':'none'}},(g.name)),
              g.description&&h('div',{style:{fontSize:11,color:TEXT3,marginTop:2,lineHeight:1.4}},g.description)),
            h('span',{style:{fontSize:10,color:TEXT3,transform:isExp?'rotate(0)':'rotate(-90deg)',transition:'transform .2s'}},'▾')),
          isExp&&h('div',{style:{marginTop:10}},
            hasSmart&&h('div',null,
              [{k:'s',l:'Specific',c:ACCENT},{k:'m',l:'Measurable',c:ACCENT2},{k:'a',l:'Achievable',c:SUCCESS},{k:'r',l:'Relevant',c:'#8060B4'},{k:'t',l:'Time-bound',c:'#5A82B4'}]
                .map(x=>sm[x.k]?h('div',{key:x.k,style:{display:'flex',gap:8,alignItems:'flex-start',marginBottom:5}},
                  h('span',{style:{fontSize:10,fontWeight:800,color:x.c,minWidth:12}},x.l[0]),
                  h('span',{style:{fontSize:12,color:TEXT2,lineHeight:1.4}},sm[x.k])):null)),
            h('div',{style:{display:'flex',justifyContent:'flex-end',marginTop:8}},
              h('button',{onClick:e=>{e.stopPropagation();delGoal(g.id)},style:{fontSize:10,padding:'3px 9px',background:'rgba(200,100,100,0.08)',border:'1px solid rgba(200,100,100,0.15)',borderRadius:6,color:'#C06060',cursor:'pointer',fontFamily:F}},'Delete'))))})),

    // ── TIMELINE ──
    logTab==='timeline'&&h('div',null,
      !addTL&&h('button',{onClick:()=>setAddTL(true),style:{width:'100%',padding:'12px 16px',marginBottom:12,background:'transparent',border:`1.5px dashed ${BORDER}`,borderRadius:14,color:TEXT3,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F}},'+ New milestone'),
      addTL&&h('div',{style:{background:CARD,borderRadius:16,padding:16,marginBottom:12,boxShadow:`0 2px 12px rgba(0,0,0,0.06)`}},
        h('div',{style:{display:'flex',gap:8,marginBottom:8}},
          h('input',{style:{...inp,width:48,textAlign:'center',fontSize:18,padding:'8px 4px'},value:tlEmoji,onChange:e=>setTlEmoji(e.target.value)}),
          h('input',{type:'date',style:{...inp,flex:1},value:tlDate,onChange:e=>setTlDate(e.target.value)})),
        h('input',{style:{...inp,fontSize:14,fontWeight:600,marginBottom:8},value:tlTitle,onChange:e=>setTlTitle(e.target.value),placeholder:'What happened?'}),
        h('textarea',{style:{...inp,minHeight:50,resize:'vertical',marginBottom:10},value:tlDesc,onChange:e=>setTlDesc(e.target.value),placeholder:'The story...'}),
        h('div',{style:{display:'flex',gap:8}},
          h('button',{onClick:()=>setAddTL(false),style:{flex:1,padding:10,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:10,color:TEXT2,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:F}},'Cancel'),
          h('button',{onClick:saveTL,style:{flex:1,padding:10,background:ACCENT2,border:'none',borderRadius:10,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:F}},'Add'))),
      (!timeline||timeline.length===0)&&!addTL&&h('div',{style:{textAlign:'center',padding:'48px 20px'}},h('div',{style:{fontSize:36,marginBottom:8}},'🏆'),h('div',{style:{fontSize:13,color:TEXT3}},'Your journey starts here')),
      (timeline||[]).length>0&&h('div',{style:{position:'relative',paddingLeft:22}},
        h('div',{style:{position:'absolute',left:8,top:4,bottom:4,width:1.5,background:`linear-gradient(180deg,${ACCENT2},${BORDER})`}}),
        (timeline||[]).map((t,i)=>{
          const prevMonth=i>0?fmtMonth(timeline[i-1].date):'';const thisMonth=fmtMonth(t.date);
          return h('div',{key:t.id},
            thisMonth!==prevMonth&&h('div',{style:{fontSize:10,fontWeight:700,color:ACCENT2,marginBottom:8,marginLeft:14,letterSpacing:'0.06em',textTransform:'uppercase'}},thisMonth),
            h('div',{style:{position:'relative',marginBottom:10}},
              h('div',{style:{position:'absolute',left:-16,top:8,width:16,height:16,borderRadius:8,background:BG,border:`2px solid ${ACCENT2}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9}},t.emoji||'⭐'),
              h('div',{style:{marginLeft:12,background:CARD,borderRadius:12,padding:'10px 13px',boxShadow:`0 1px 6px rgba(0,0,0,0.05)`}},
                h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:3}},
                  h('span',{style:{fontSize:13,fontWeight:600,color:TEXT1}},t.title),
                  h('span',{style:{fontSize:10,color:TEXT3}},fmtDate(t.date))),
                t.description&&h('div',{style:{fontSize:12,color:TEXT2,lineHeight:1.5}},t.description),
                h('button',{onClick:()=>delTL(t.id),style:{marginTop:5,fontSize:9,padding:'2px 6px',background:'none',border:`1px solid rgba(200,100,100,0.15)`,borderRadius:4,color:'#C06060',cursor:'pointer',fontFamily:F,opacity:0.5}},'×'))))}))),

    // ── SUMMARIES ──
    logTab==='summary'&&((!dailyLogs||dailyLogs.length===0)?h('div',{style:{textAlign:'center',padding:'48px 20px'}},
      h('div',{style:{fontSize:36,marginBottom:8}},'📊'),h('div',{style:{fontSize:13,color:TEXT3}},'Complete an End Day to see your first log')):
    dailyLogs.map((log,i)=>{
      const isOpen=openDay===i;const d=log.date;const s=log.stats||{};
      return h('div',{key:i,style:{background:CARD,borderRadius:14,padding:'13px 15px',marginBottom:8,boxShadow:`0 1px 6px rgba(0,0,0,0.05)`}},
        h('div',{onClick:()=>setOpenDay(isOpen?null:i),style:{display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}},
          h('div',{style:{display:'flex',alignItems:'center',gap:8}},
            h('span',{style:{fontSize:14,fontWeight:600,color:TEXT1}},fmtDate(d)),
            h('span',{style:{fontSize:11,color:SUCCESS,fontWeight:600}},'✓ '+(s.completed||0)),
            (s.skipped||0)>0&&h('span',{style:{fontSize:11,color:TEXT3}},'⏭ '+s.skipped)),
          h('span',{style:{color:TEXT3,fontSize:10,transform:isOpen?'rotate(0)':'rotate(-90deg)',transition:'transform .2s'}},'▾')),
        h('div',{style:{height:3,borderRadius:99,background:BG,marginTop:8,overflow:'hidden'}},
          h('div',{style:{height:'100%',borderRadius:99,background:`linear-gradient(90deg,${SUCCESS},#A8E8C4)`,width:((s.completed||0)/Math.max(s.total||1,1)*100)+'%',transition:'width .4s'}})),
        isOpen&&h('div',{style:{marginTop:12}},
          cats.map(cat=>{const items=log[cat]||[];if(!items.length)return null;
            return h('div',{key:cat,style:{marginBottom:9}},
              h('div',{style:{display:'flex',alignItems:'center',gap:5,marginBottom:5}},
                h('span',{style:{fontSize:11}},catEmoji[cat]),
                h('div',{style:{fontSize:10,fontWeight:700,color:catColor[cat],textTransform:'uppercase',letterSpacing:'0.06em'}},(cat))),
              items.map((t,j)=>h('div',{key:j,style:{display:'flex',alignItems:'center',gap:6,padding:'3px 0'}},
                h('span',{style:{fontSize:10}},t.done?'✅':t.skipped?'⏭':''),
                h('span',{style:{fontSize:12,color:t.done?TEXT1:TEXT3,textDecoration:t.skipped?'line-through':'none'}},t.name),
                t.project&&h('span',{style:{fontSize:9,color:TEXT3,marginLeft:3}},t.project),
                t.time&&h('span',{style:{fontSize:9,color:TEXT3,marginLeft:3}},t.time))))}),
          h('button',{style:{width:'100%',padding:8,marginTop:6,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:9,color:TEXT2,fontSize:10,fontWeight:700,cursor:'pointer',fontFamily:F},
            onClick:()=>{const lines=['📊 '+d,''];cats.forEach(cat=>{const items=log[cat]||[];if(!items.length)return;lines.push(catEmoji[cat]+' '+cat.toUpperCase());items.forEach(t=>lines.push((t.done?'  ✅ ':'  ⏭ ')+t.name+(t.project?' ['+t.project+']':'')+(t.time?' '+t.time:'')));lines.push('')});lines.push('Total: '+(s.completed||0)+' done, '+(s.skipped||0)+' skipped');navigator.clipboard.writeText(lines.join('\n')).catch(()=>{})}},
            '📋 Copy Summary')))})),

    // ── NOTES ──
    logTab==='notes'&&((!dailyLogs||dailyLogs.length===0)?h('div',{style:{textAlign:'center',padding:'48px 20px'}},h('div',{style:{fontSize:36,marginBottom:8}},'📝'),h('div',{style:{fontSize:13,color:TEXT3}},'No notes yet')):
    dailyLogs.map((log,i)=>{
      const isOpen=openDay===i;const d=log.date;const notes=log.notes||[];
      if(!notes.length)return h('div',{key:i,style:{background:CARD,borderRadius:14,padding:'11px 14px',marginBottom:6,boxShadow:`0 1px 4px rgba(0,0,0,0.04)`}},
        h('div',{style:{fontSize:12,fontWeight:600,color:TEXT2}},fmtDate(d)),
        h('div',{style:{fontSize:11,color:TEXT3,fontStyle:'italic',marginTop:3}},'No notes'));
      return h('div',{key:i,style:{background:CARD,borderRadius:14,padding:'13px 15px',marginBottom:8,boxShadow:`0 1px 6px rgba(0,0,0,0.05)`}},
        h('div',{onClick:()=>setOpenDay(isOpen?null:i),style:{display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}},
          h('div',{style:{display:'flex',alignItems:'center',gap:8}},
            h('span',{style:{fontSize:14,fontWeight:600,color:TEXT1}},fmtDate(d)),
            h('span',{style:{fontSize:10,color:'#8060B4',background:'rgba(160,130,200,0.1)',padding:'2px 7px',borderRadius:99,fontWeight:700}},notes.length+' note'+(notes.length!==1?'s':''))),
          h('span',{style:{color:TEXT3,fontSize:10,transform:isOpen?'rotate(0)':'rotate(-90deg)',transition:'transform .2s'}},'▾')),
        isOpen&&h('div',{style:{marginTop:10}},
          notes.map((n,j)=>h('div',{key:j,style:{background:BG,borderRadius:9,padding:'9px 11px',marginBottom:5,borderLeft:`3px solid ${catColor[n.category]||ACCENT}`}},
            h('div',{style:{display:'flex',alignItems:'center',gap:5,marginBottom:3}},
              h('span',{style:{fontSize:10}},catEmoji[n.category]||''),
              h('span',{style:{fontSize:11,fontWeight:600,color:catColor[n.category]||ACCENT}},(n.name))),
            h('div',{style:{fontSize:12,color:TEXT2,whiteSpace:'pre-wrap',lineHeight:1.5}},n.text))),
          h('button',{style:{width:'100%',padding:8,marginTop:4,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:9,color:TEXT2,fontSize:10,fontWeight:700,cursor:'pointer',fontFamily:F},
            onClick:()=>{const txt='📝 '+d+'\n\n'+notes.map(n=>(catEmoji[n.category]||'')+' '+n.name+'\n'+n.text).join('\n\n');navigator.clipboard.writeText(txt).catch(()=>{})}},
            '📋 Copy Notes')))})));
}

// ─── HERO CARD (Focus Now) ────────────────────────────────────────
function HeroCard({task,dN,doC,doS,doHold,setViewing,uN,ct}){
  const[showNotes,setShowNotes]=useState(false);
  const[notes,setNotes]=useState(task.notes||'');
  useEffect(()=>{setNotes(task.notes||'');setShowNotes(false)},[task.id]);
  const save=()=>uN(task.id,notes);
  const c=CAT[task.category];
  const name=dN(task);

  return h('div',{className:'hero-card',style:{
    background:CARD,
    borderRadius:22,
    padding:'22px 20px 18px',
    marginBottom:12,
    position:'relative',
    overflow:'hidden'
  }},
    // Subtle tint blob in corner
    h('div',{style:{
      position:'absolute',top:-30,right:-30,width:120,height:120,
      borderRadius:'50%',
      background:`radial-gradient(circle, ${c.bg.replace('0.08','0.35')} 0%, transparent 70%)`,
      pointerEvents:'none'
    }}),
    // Focus label
    h('div',{style:{display:'flex',alignItems:'center',gap:5,marginBottom:14}},
      h(IC.Focus),
      h('span',{style:{fontSize:10,fontWeight:700,letterSpacing:'0.12em',color:TEXT3,textTransform:'uppercase'}},
        'Focus now')),
    // Task name — big serif
    h('div',{style:{
      fontSize:26,fontFamily:SERIF,fontStyle:'italic',
      color:TEXT1,lineHeight:1.2,marginBottom:6,
      fontWeight:400,letterSpacing:'-0.01em'
    }},name),
    // Meta row
    h('div',{style:{display:'flex',alignItems:'center',gap:7,marginBottom:16,flexWrap:'wrap'}},
      h('span',{style:{
        fontSize:10,fontWeight:600,padding:'3px 9px',borderRadius:99,
        background:c.bg,color:c.text,letterSpacing:'0.04em'
      }},c.label.toUpperCase()),
      task.project&&h('span',{style:{fontSize:11,color:TEXT3}},task.project),
      task.isGoal&&h('span',{style:{fontSize:10,fontWeight:700,color:ACCENT,background:'rgba(232,149,109,0.1)',padding:'2px 8px',borderRadius:99}},'🎯 Goal'),
      h('button',{
        onClick:()=>setShowNotes(!showNotes),
        style:{marginLeft:'auto',fontSize:11,padding:'3px 9px',borderRadius:99,background:showNotes?'rgba(232,149,109,0.1)':'transparent',border:`1px solid ${showNotes?c.border:BORDER}`,color:showNotes?ACCENT:TEXT3,cursor:'pointer',fontFamily:F,fontWeight:600}
      },'📝 Notes')),
    // Notes textarea
    showNotes&&h('div',{style:{marginBottom:14}},
      h('textarea',{style:{
        width:'100%',padding:'10px 13px',
        background:BG,border:`1.5px solid ${BORDER}`,
        borderRadius:12,color:TEXT1,fontSize:13,
        fontFamily:F,outline:'none',boxSizing:'border-box',
        minHeight:72,resize:'vertical',lineHeight:1.5
      },value:notes,onChange:e=>setNotes(e.target.value),onBlur:save,placeholder:'Notes...'})),
    // Actions
    h('div',{style:{display:'flex',gap:8}},
      // Done — the star of the show
      h('button',{onClick:()=>doC(task.id),style:{
        flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,
        padding:'14px 20px',
        background:`linear-gradient(135deg,${ACCENT},#D4784A)`,
        border:'none',borderRadius:14,color:'#fff',
        fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:F,
        boxShadow:`0 4px 20px rgba(232,149,109,0.35)`,
        letterSpacing:'0.01em'
      }},h(IC.CheckBig),'Done'),
      // Skip
      h('button',{onClick:()=>doS(task.id),style:{
        padding:'14px 14px',
        background:BG,border:`1.5px solid ${BORDER}`,
        borderRadius:14,color:TEXT3,fontSize:13,
        fontWeight:600,cursor:'pointer',fontFamily:F
      }},'Skip'),
      // Hold
      h('button',{onClick:()=>doHold(task.id,60),style:{
        padding:'14px 14px',
        background:BG,border:`1.5px solid ${BORDER}`,
        borderRadius:14,color:TEXT3,fontSize:13,
        cursor:'pointer',fontFamily:F
      }},'⏸')));
}

// ═══ MAIN APP ════════════════════════════════════════════════════
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
  const[celeb,setCeleb]=useState(null);
  const[celebBig,setCelebBig]=useState(false);
  const[collCats,setCollCats]=useState({});
  const[justDone,setJustDone]=useState(null);
  const[focusProj,setFocusProj]=useState(null);
  const[showFocus,setShowFocus]=useState(false);
  const[dragId,setDragId]=useState(null);
  const[dragOverId,setDragOverId]=useState(null);
  const[reorderOn,setReorderOn]=useState(false);
  const[planTmrw,setPlanTmrw]=useState(false);
  const todaySnap=useRef(null);
  const[showCompleted,setShowCompleted]=useState(true);
  const[showBlocked,setShowBlocked]=useState(true);
  const[showAhead,setShowAhead]=useState(true);
  const[nextDayOrder,setNextDayOrder]=useState(null);
  const[collSubs,setCollSubs]=useState(()=>{try{const s=localStorage.getItem('myday-collsubs');return s?JSON.parse(s):{}}catch(e){return{}}});
  const[rewards,setRewards]=useState([]);
  const[inventory,setInventory]=useState([]);
  const[showInv,setShowInv]=useState(false);
  const[showRewardEdit,setShowRewardEdit]=useState(false);
  const[showImport,setShowImport]=useState(false);
  const[rewardCeleb,setRewardCeleb]=useState(null);
  const[dailyLogs,setDailyLogs]=useState([]);
  const[lifeGoals,setLifeGoals]=useState([]);
  const[timeline,setTimeline]=useState([]);
  const[postEnd,setPostEnd]=useState(null);

  const ntfSet=useRef(new Set());const remSet=useRef(new Set());
  const initDone=useRef(false);const skipFB=useRef(false);
  const isResolving=useRef(true);const isDirty=useRef(false);
  const markDirty=()=>{isDirty.current=true};
  useEffect(()=>{localStorage.setItem('myday-mode',mode)},[mode]);
  useEffect(()=>{try{localStorage.setItem('myday-collsubs',JSON.stringify(collSubs))}catch(e){}},[collSubs]);

  const applyData=d=>{
    setTasks(autoArc(d.tasks||[]));setComp(d.completed||{});setSkip(d.skipped||{});
    if(d.hold)setHold(d.hold);
    const rw=toArr(d.rewards);if(rw.length>0)setRewards(rw);
    setInventory(toArr(d.inventory));
    if(d.dailyLogs){const logs=toArr(d.dailyLogs).map(l=>({...l,core:toArr(l.core),event:toArr(l.event),work:toArr(l.work),personal:toArr(l.personal),notes:toArr(l.notes)}));setDailyLogs(logs)}
    if(d.lifeGoals)setLifeGoals(toArr(d.lifeGoals));if(d.timeline)setTimeline(toArr(d.timeline));
    if(d.nextDayOrder)setNextDayOrder(d.nextDayOrder);
    if(d.notified)ntfSet.current=new Set(d.notified);sL(d);setLoading(false);
  };

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

  useEffect(()=>{
    if(loading||tasks.length===0||isResolving.current||!isDirty.current)return;isDirty.current=false;
    const d={tasks,completed:comp,skipped:skip,hold,rewards,inventory,dailyLogs,lifeGoals,timeline,nextDayOrder,notified:[...ntfSet.current],ts:Date.now()};
    sL(d);skipFB.current=true;try{dataRef.update(d)}catch(e){}
  },[tasks,comp,skip,hold,rewards,inventory,dailyLogs,lifeGoals,timeline,loading]);

  useEffect(()=>{const iv=setInterval(()=>{const now=Date.now();let ch=false;setHold(p=>{const n={...p};Object.keys(n).forEach(k=>{if(n[k]<=now){delete n[k];ch=true}});return ch?n:p});if(ch)markDirty()},10000);return()=>clearInterval(iv)},[]);

  useEffect(()=>{
    const tick=()=>{const t=getHM();setCt(t);if(!nOn)return;const nm=toM(t),td=getISO(),dw=getDow();
      tasks.forEach(tk=>{if(tk.archived||!tk.timeCondition||comp[tk.id]||skip[tk.id])return;const at=getActTime(tk,dw);if(!at)return;
        if(tk.category==='event'&&(tk.reminderMin||0)>0&&toArr(tk.eventDates).includes(td)){const tM=toM(at),rM=tM-(tk.reminderMin||0),rk=tk.id+'_r';if(nm>=rM&&nm<tM&&!remSet.current.has(rk)){ntfy('📅 '+tk.name+' en '+tk.reminderMin+'min',at,rk);setBanner(tk.name+' en '+tk.reminderMin+'min');setTimeout(()=>setBanner(null),5000);remSet.current.add(rk)}}
        if(tk.category!=='core'&&tk.category!=='event')return;if(ntfSet.current.has(tk.id))return;
        if(tk.category==='core'&&!toArr(tk.activeDays).includes(dw))return;if(tk.category==='event'&&!toArr(tk.eventDates).includes(td))return;
        const tM=toM(at);if(nm>=tM&&nm<=tM+2){ntfy(tk.category==='event'?'📅':'⏰',tk.name,tk.id);setBanner(tk.name);setTimeout(()=>setBanner(null),5000);ntfSet.current.add(tk.id)}})};
    tick();const iv=setInterval(tick,10000);const onV=()=>{if(!document.hidden)tick()};document.addEventListener('visibilitychange',onV);
    if(swReg&&nOn){try{const now=new Date(),td=getISO(),dw=getDow(),notifs=[];tasks.forEach(tk=>{if(tk.archived||!tk.timeCondition||comp[tk.id]||skip[tk.id])return;const at=getActTime(tk,dw);if(!at)return;if(tk.category==='core'&&!toArr(tk.activeDays).includes(dw))return;if(tk.category==='event'&&!toArr(tk.eventDates).includes(td))return;const[hh,mm]=at.split(':').map(Number);const fire=new Date(now);fire.setHours(hh,mm,0,0);if(fire>now)notifs.push({title:tk.category==='event'?'📅 Event':'⏰ '+tk.name,body:at,tag:tk.id,fireAt:fire.getTime()});if(tk.category==='event'&&(tk.reminderMin||0)>0){const rf=new Date(fire.getTime()-tk.reminderMin*60000);if(rf>now)notifs.push({title:'📅 '+tk.name+' en '+tk.reminderMin+'min',body:at,tag:tk.id+'_r',fireAt:rf.getTime()})}});if(notifs.length>0&&swReg.active)swReg.active.postMessage({type:'SCHEDULE_NOTIFS',notifs})}catch(e){}}
    return()=>{clearInterval(iv);document.removeEventListener('visibilitychange',onV)};
  },[tasks,comp,skip,nOn]);

  const rqN=async()=>{if(!('Notification' in window)){setBanner('Not supported');setTimeout(()=>setBanner(null),3000);return}const p=await Notification.requestPermission();if(p==='granted'){setNOn(true);ntfy('🔔','On')}else{setBanner('Denied');setTimeout(()=>setBanner(null),3000)}};

  // ─── LOGIC ───
  const childrenOf=useCallback(pid=>tasks.filter(t=>t.parentId===pid&&!t.archived),[tasks]);
  const parentHasGoal=useCallback(pid=>tasks.some(t=>t.parentId===pid&&!t.archived&&t.isGoal),[tasks]);
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
  const tOk=useCallback(t=>{
    const tc=t.timeCondition||(t.parentId?tasks.find(p=>p.id===t.parentId)?.timeCondition:null);
    if(!tc)return true;const at=tc.dayOverrides&&tc.dayOverrides[dw]?tc.dayOverrides[dw]:tc.time;
    return!at||toM(ct)>=toM(at);
  },[ct,dw,tasks]);
  const parentClear=useCallback(pid=>{
    const subs=tasks.filter(t=>t.parentId===pid&&!t.archived);
    if(subs.length===0)return false;
    return subs.every(s=>!!comp[s.id]||!!skip[s.id]||isHeld(s.id));
  },[tasks,comp,skip,isHeld]);
  const dOk=useCallback(tk=>{
    if(tk.dependsOn&&!resolved(tk.dependsOn))return false;
    if(tk.category==='work'||tk.category==='personal'){
      const pending=ceT.filter(c=>{if(!tOk(c))return false;if(resolved(c.id)||isHeld(c.id))return false;if(parentClear(c.id))return false;return true});
      if(pending.length>0)return false;
    }
    return true;
  },[resolved,ceT,tOk,isHeld,parentClear]);
  const isUL=useCallback(t=>{if(isHeld(t.id))return false;return tOk(t)&&dOk(t)},[tOk,dOk,isHeld]);
  const dN=useCallback(t=>{if(!t.timeCondition)return t.name;const tc=t.timeCondition;if(tc.labelSwitchTime&&tc.labelBefore&&tc.labelAfter)return toM(ct)>=toM(tc.labelSwitchTime)?tc.labelAfter:tc.labelBefore;return t.name},[ct]);
  const bW=useCallback(tk=>{
    const r=[];if(isHeld(tk.id)){const min=Math.ceil((hold[tk.id]-Date.now())/60000);r.push('⏸ '+min+'min');return r}
    const tc=tk.timeCondition||(tk.parentId?tasks.find(p=>p.id===tk.parentId)?.timeCondition:null);
    if(tc){const at=tc.dayOverrides&&tc.dayOverrides[dw]?tc.dayOverrides[dw]:tc.time;if(at&&toM(ct)<toM(at))r.push('🔓 '+at)}
    if(tk.dependsOn&&!resolved(tk.dependsOn)){const p=tasks.find(x=>x.id===tk.dependsOn);if(p)r.push('After: '+p.name)}
    if(tk.category==='work'||tk.category==='personal'){const pn=ceT.filter(c=>tOk(c)&&!resolved(c.id)&&!isHeld(c.id));if(pn.length)r.push(pn[0].name+' first')}
    return r;
  },[tOk,resolved,tasks,ceT,ct,dw,hold,isHeld]);

  // ─── REWARDS ───
  const giveReward=(instant)=>{if(rewards.length===0)return;const rw=rewards[Math.floor(Math.random()*rewards.length)];setInventory(p=>[...p,{name:rw.name,type:rw.type}]);markDirty();if(instant){setTimeout(()=>{setRewardCeleb(rw);setTimeout(()=>setRewardCeleb(null),3500)},100)}};
  const checkGoal=(taskId)=>{const goal=tasks.find(t=>t.isGoal&&!t.archived&&t.id===taskId);if(!goal)return false;setCelebBig(true);setCeleb('¡Meta cumplida!');setTimeout(()=>{if(mode==='work')giveReward(false);else giveReward(true)},4600);return true};
  const isGoalMet=(cat,extraId)=>{const catT=tasks.filter(t=>!t.archived&&isAct(t)&&t.category===cat);const goal=catT.find(t=>t.isGoal);if(!goal)return false;return!!comp[goal.id]||goal.id===extraId};

  // ─── ACTIONS ───
  const doC=id=>{markDirty();const was=!!comp[id];
    setComp(p=>{const n={...p};n[id]?delete n[id]:(n[id]=true);return n});setSkip(p=>{const n={...p};delete n[id];return n});
    if(!was){setJustDone(id);setTimeout(()=>setJustDone(null),400);const tk=tasks.find(t=>t.id===id);if(tk){const isGoalHit=checkGoal(id);if(!isGoalHit){setCeleb('Done!');setCelebBig(false);if((tk.category==='work'||tk.category==='personal')&&isGoalMet(tk.category,id))giveReward(true)}}}};
  const doS=id=>{markDirty();setSkip(p=>{const n={...p};n[id]?delete n[id]:(n[id]=true);return n});setComp(p=>{const n={...p};delete n[id];return n})};
  const doHold=(id,min)=>{markDirty();setHold(p=>({...p,[id]:Date.now()+min*60000}))};
  const doUnhold=id=>{markDirty();setHold(p=>{const n={...p};delete n[id];return n})};
  const endD=()=>{
    const doneIds=new Set([...Object.keys(comp),...Object.keys(skip)]);
    const doneTasks=tasks.filter(t=>doneIds.has(t.id));
    const log={date:getISO(),ts:Date.now(),
      core:doneTasks.filter(t=>t.category==='core').map(t=>({name:t.name,done:!!comp[t.id],skipped:!!skip[t.id]})),
      event:doneTasks.filter(t=>t.category==='event').map(t=>({name:t.name,time:getActTime(t,dw)||'',done:!!comp[t.id],skipped:!!skip[t.id]})),
      work:doneTasks.filter(t=>t.category==='work').map(t=>({name:t.name,project:t.project||'',done:!!comp[t.id],skipped:!!skip[t.id]})),
      personal:doneTasks.filter(t=>t.category==='personal').map(t=>({name:t.name,project:t.project||'',done:!!comp[t.id],skipped:!!skip[t.id]})),
      notes:doneTasks.filter(t=>t.notes&&t.notes.trim()).map(t=>({name:t.name,category:t.category,text:t.notes.trim()})),
      stats:{total:doneTasks.length,completed:Object.keys(comp).length,skipped:Object.keys(skip).length}};
    setDailyLogs(p=>[log,...p]);setPostEnd(doneIds);
    setComp({});setSkip({});setHold({});setInventory([]);setCEnd(false);ntfSet.current.clear();remSet.current.clear();
    if(nextDayOrder){setTasks(prev=>prev.map(t=>nextDayOrder[t.id]!=null?{...t,order:nextDayOrder[t.id]}:t));setNextDayOrder(null)}
    markDirty();
  };
  const delT=id=>{markDirty();const subs=tasks.filter(t=>t.parentId===id).map(t=>t.id);const all=[id,...subs];setTasks(p=>p.filter(t=>!all.includes(t.id)).map(t=>t.dependsOn&&all.includes(t.dependsOn)?{...t,dependsOn:null}:t));all.forEach(d=>{setComp(p=>{const n={...p};delete n[d];return n});setSkip(p=>{const n={...p};delete n[d];return n})});setCDel(null)};
  const svT=td=>{markDirty();if(td.id)setTasks(p=>p.map(t=>t.id===td.id?td:t));else setTasks(p=>[...p,{...td,id:gid(),order:p.length}]);setEditing(null)};
  const uN=(id,notes)=>{markDirty();setTasks(p=>p.map(t=>t.id===id?{...t,notes}:t))};
  const arT=id=>{markDirty();setTasks(p=>p.map(t=>t.id===id?{...t,archived:true}:t))};
  const unT=id=>{markDirty();setTasks(p=>p.map(t=>t.id===id?{...t,archived:false}:t))};
  const dupT=id=>{markDirty();setTasks(p=>{const t=p.find(x=>x.id===id);if(!t)return p;const newId=gid();const subs=p.filter(x=>x.parentId===id);const newSubs=subs.map(s=>({...s,id:gid(),parentId:newId,order:p.length+1}));return[...p,{...t,id:newId,name:t.name+' (copy)',order:p.length},...newSubs]})};

  const handleDrop=(targetId,cat)=>{if(!dragId||dragId===targetId){setDragId(null);setDragOverId(null);return}markDirty();
    const doReorder=prev=>{const ct=prev.filter(t=>t.category===cat&&!t.archived);const ot=prev.filter(t=>t.category!==cat||t.archived);const fi=ct.findIndex(t=>t.id===dragId);const ti=ct.findIndex(t=>t.id===targetId);if(fi<0||ti<0)return prev;const dt=ct[fi];let mv=[dragId];if(!dt.parentId)mv=[...mv,...ct.filter(t=>t.parentId===dragId).map(t=>t.id)];const moving=ct.filter(t=>mv.includes(t.id));const rest=ct.filter(t=>!mv.includes(t.id));const ins=rest.findIndex(t=>t.id===targetId);rest.splice(ins<0?rest.length:ins,0,...moving);return[...rest.map((t,i)=>({...t,order:i})),...ot]};
    if(planTmrw){setTasks(prev=>{const result=doReorder(prev);const newOrders={};result.filter(t=>t.category===cat&&!t.archived).forEach(t=>{newOrders[t.id]=t.order});setNextDayOrder(p=>({...(p||{}),...newOrders}));return result})}
    else setTasks(doReorder);
    setDragId(null);setDragOverId(null)};

  // ─── COMPUTED ───
  let dayT=tasks.filter(t=>{if(t.archived||!isAct(t))return false;if(tasks.some(c=>c.parentId===t.id&&!c.archived))return false;if(t.category==='core'||t.category==='event')return true;if(t.category!==mode)return false;if(focusProj&&t.project!==focusProj)return false;return true})
    .sort((a,b)=>{const catPri={core:0,event:1,work:2,personal:2};const aCat=catPri[a.category]??2,bCat=catPri[b.category]??2;if(aCat!==bCat)return aCat-bCat;const effOrd=t=>{if(t.parentId){const p=tasks.find(x=>x.id===t.parentId);return(p?p.order||0:0)+0.001+(t.order||0)*0.0001}return t.order||0};return effOrd(a)-effOrd(b)});

  const todayEv=dayT.filter(t=>t.category==='event');
  const nonEv=dayT.filter(t=>t.category!=='event');
  const catPri={core:0,event:1,work:2,personal:2};
  const effOrd=t=>{if(t.parentId){const p=tasks.find(x=>x.id===t.parentId);return(p?p.order||0:0)+0.001+(t.order||0)*0.0001}return t.order||0};
  const nxt=nonEv.filter(t=>!resolved(t.id)&&isUL(t)).sort((a,b)=>{const cp=(catPri[a.category]??2)-(catPri[b.category]??2);return cp!==0?cp:effOrd(a)-effOrd(b)})[0];
  const completedT=nonEv.filter(t=>resolved(t.id));
  const blockedT=nonEv.filter(t=>{if(resolved(t.id)||isUL(t)||isHeld(t.id))return false;const tc=t.timeCondition||(t.parentId?tasks.find(p=>p.id===t.parentId)?.timeCondition:null);if(tc){const at=tc.dayOverrides&&tc.dayOverrides[dw]?tc.dayOverrides[dw]:tc.time;if(at&&toM(ct)<toM(at))return true}return false});
  const aheadT=nonEv.filter(t=>!resolved(t.id)&&t.id!==(nxt?.id)&&!blockedT.find(b=>b.id===t.id));
  const rCnt=dayT.filter(t=>resolved(t.id)).length;
  const pct=dayT.length?rCnt/dayT.length:0;
  const actTasks=tasks.filter(t=>!t.archived),arcTasks=tasks.filter(t=>t.archived);
  const grp={core:[],event:[],work:[],personal:[]};actTasks.filter(t=>!t.parentId).forEach(t=>{if(grp[t.category])grp[t.category].push(t)});
  const projects=[...new Set(tasks.filter(t=>t.project&&(t.category==='work'||t.category==='personal')).map(t=>t.project))];

  if(loading)return h('div',{style:{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:BG}},
    h('p',{style:{color:TEXT3,fontSize:13}},'Loading...'));

  // ─── TASK CARD (list items) ───
  const rCard=(task,mini)=>{
    const done=!!comp[task.id],isSk=!!skip[task.id],rs=done||isSk,u=isUL(task),hld=isHeld(task.id);
    const reasons=bW(task),name=dN(task),c=CAT[task.category],isG=task.isGoal||parentHasGoal(task.id),pulsing=justDone===task.id;
    const parent=task.parentId?tasks.find(t=>t.id===task.parentId):null;
    const wasEnd=postEnd&&postEnd.has(task.id);

    return h('div',{key:task.id,onClick:()=>setViewing(task),style:{
      display:'flex',alignItems:'flex-start',gap:10,
      padding:task.parentId?'7px 12px 7px 28px':'9px 12px',
      background:CARD,borderRadius:11,
      cursor:'pointer',
      opacity:rs?0.45:(!u&&!rs?0.35:1),
      transition:'opacity .2s',
      borderLeft:`2.5px solid ${rs?BORDER:c.border}`,
    }},
      // Checkbox
      h('button',{className:pulsing?'cb-pulse':'',onClick:e=>{e.stopPropagation();if(hld)return;(u||rs)&&doC(task.id)},style:{
        width:24,height:24,borderRadius:7,flexShrink:0,
        border:`1.5px solid ${done?SUCCESS:isSk?BORDER:hld?ACCENT:'#D8D0C8'}`,
        background:done?SUCCESS:isSk?BG:hld?'rgba(232,149,109,0.1)':'transparent',
        display:'flex',alignItems:'center',justifyContent:'center',
        cursor:!u&&!hld?'not-allowed':'pointer',
        color:done?'#fff':isSk?TEXT3:'transparent',transition:'all .18s'
      }},done&&h(IC.Check),isSk&&h(IC.X),hld&&h(IC.Pause),!u&&!rs&&!hld&&h(IC.Lock)),
      // Content
      h('div',{style:{flex:1,minWidth:0}},
        parent&&h('div',{style:{fontSize:9,color:TEXT3,marginBottom:1}},'↳ '+parent.name),
        h('div',{style:{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}},
          h('span',{style:{
            fontSize:13,fontWeight:rs?400:500,
            color:done||isSk?TEXT3:hld?ACCENT:!u?'#C8BFB8':TEXT1,
            textDecoration:rs?'line-through':'none',
            fontStyle:isSk?'italic':'normal'
          }},name),
          isG&&h('span',{style:{fontSize:9,fontWeight:700,color:ACCENT,background:'rgba(232,149,109,0.1)',padding:'1px 6px',borderRadius:99}},'goal'),
          wasEnd&&h('span',{style:{fontSize:9,color:SUCCESS,fontWeight:600}},'done today')),
        !u&&!rs&&reasons.length>0&&h('div',{style:{marginTop:2}},
          reasons.map((r,i)=>h('span',{key:i,style:{fontSize:10,color:hld?ACCENT:TEXT3,marginRight:6}},r)))),
      // Actions
      h('div',{style:{display:'flex',gap:3,flexShrink:0}},
        u&&!rs&&h('button',{onClick:e=>{e.stopPropagation();doS(task.id)},style:{width:22,height:22,borderRadius:6,border:`1px solid ${BORDER}`,background:'transparent',color:TEXT3,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}},h(IC.X)),
        u&&!rs&&!hld&&h('button',{onClick:e=>{e.stopPropagation();doHold(task.id,60)},style:{width:22,height:22,borderRadius:6,border:`1px solid ${BORDER}`,background:'transparent',color:TEXT3,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}},h(IC.Pause)),
        hld&&h('button',{onClick:e=>{e.stopPropagation();doUnhold(task.id)},style:{width:22,height:22,borderRadius:6,border:`1px solid rgba(125,200,160,0.3)`,background:'rgba(125,200,160,0.1)',color:SUCCESS,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}},h(IC.Play))));
  };

  // ─── EVENT CARD ───
  const rEvent=task=>{
    const done=!!comp[task.id],isSk=!!skip[task.id],rs=done||isSk;const at=getActTime(task,dw);
    return h('div',{key:task.id,onClick:()=>setViewing(task),style:{
      display:'flex',alignItems:'center',gap:10,padding:'9px 12px',
      background:CARD,borderRadius:11,opacity:rs?0.45:1,cursor:'pointer',
      borderLeft:`2.5px solid ${ACCENT2}`
    }},
      h('div',{style:{fontSize:16,flexShrink:0}},'📅'),
      h('div',{style:{flex:1}},
        h('div',{style:{fontSize:13,fontWeight:500,color:rs?TEXT3:TEXT1,textDecoration:rs?'line-through':'none'}},task.name),
        h('div',{style:{display:'flex',gap:6,marginTop:1}},
          at&&h('span',{style:{fontSize:10,color:TEXT3}},at),
          task.reminderMin>0&&h('span',{style:{fontSize:9,color:TEXT3}},'⏰'+task.reminderMin+'m'))),
      h('button',{onClick:e=>{e.stopPropagation();doC(task.id)},style:{
        width:26,height:26,borderRadius:7,
        background:rs?BG:'rgba(109,181,200,0.1)',
        border:`1px solid ${rs?BORDER:'rgba(109,181,200,0.3)'}`,
        color:rs?TEXT3:ACCENT2,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'
      }},rs?h(IC.X):h(IC.Check)));
  };

  // Section header
  const secH=(label,count,show,setShow)=>h('button',{
    onClick:()=>setShow(!show),
    style:{display:'flex',alignItems:'center',gap:5,width:'100%',textAlign:'left',
      fontSize:10,fontWeight:700,color:TEXT3,textTransform:'uppercase',
      letterSpacing:'0.08em',marginBottom:show?6:0,marginTop:10,padding:'2px 0',
      background:'none',border:'none',cursor:'pointer',fontFamily:F}
  },
    h('span',{style:{display:'inline-block',transform:show?'rotate(0)':'rotate(-90deg)',transition:'transform .18s',fontSize:9}},'▾'),
    label+' ('+count+')');

  // ─── ADMIN ROW ───
  const aRow=(task,cat,isSub)=>{
    const done=resolved(task.id),isSk=!!skip[task.id],c=CAT[cat];
    const isDO=dragOverId===task.id;
    const subs=tasks.filter(t=>t.parentId===task.id&&!t.archived);
    const subsColl=!!collSubs[task.id];
    const dates=Array.isArray(task.eventDates)?task.eventDates:task.eventDates?Object.values(task.eventDates):[];
    const at=getActTime(task,dw);
    const wasEnd=postEnd&&postEnd.has(task.id);

    const chips=[];
    if(at)chips.push(h('span',{key:'time',style:{fontSize:9,color:TEXT3}},at));
    if(cat==='event')chips.push(h('span',{key:'dates',style:{fontSize:9,color:ACCENT2,fontWeight:600}},'📅 '+(dates.join(', ')||'no dates')));
    if(task.project)chips.push(h('span',{key:'proj',style:{fontSize:9,color:TEXT3}},task.project));
    const ad=toArr(task.activeDays);if(ad.length>0&&ad.length<7)chips.push(h('span',{key:'days',style:{fontSize:8,color:TEXT3,letterSpacing:1,background:BG,padding:'1px 4px',borderRadius:4}},ad.map(d=>DL[d]).join('')));

    const btns=[
      h('button',{key:'edit',onClick:()=>setEditing(task),style:{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',background:BG,border:`1px solid ${BORDER}`,borderRadius:6,color:ACCENT2,cursor:'pointer'}},h(IC.Edit)),
      h('button',{key:'dup',onClick:()=>dupT(task.id),style:{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',background:BG,border:`1px solid ${BORDER}`,borderRadius:6,color:TEXT3,cursor:'pointer'}},h(IC.Copy)),
    ];
    if(!isSub)btns.push(h('button',{key:'sub',onClick:()=>setEditing({_newSub:true,parentId:task.id,category:cat}),style:{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',background:BG,border:`1px solid ${BORDER}`,borderRadius:6,color:TEXT3,cursor:'pointer',fontSize:11}},'+'));
    if(cat==='event')btns.push(h('button',{key:'arc',onClick:()=>arT(task.id),style:{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',background:BG,border:`1px solid ${BORDER}`,borderRadius:6,color:TEXT3,cursor:'pointer'}},h(IC.Archive)));
    else btns.push(h('button',{key:'del',onClick:()=>setCDel(task.id),style:{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',background:BG,border:`1px solid ${BORDER}`,borderRadius:6,color:'#C06060',cursor:'pointer'}},h(IC.Trash)));

    const row=h('div',{'data-cat':cat,'data-tid':task.id,draggable:reorderOn,
      onDragStart:()=>{if(reorderOn)setDragId(task.id)},onDragOver:e=>{if(reorderOn){e.preventDefault();setDragOverId(task.id)}},onDrop:()=>{if(reorderOn)handleDrop(task.id,cat)},onDragEnd:()=>{setDragId(null);setDragOverId(null)},
      style:{display:'flex',alignItems:'center',gap:7,padding:isSub?'7px 8px 7px 26px':'9px 11px',
        background:isDO?BG:CARD,borderRadius:10,borderLeft:`2.5px solid ${c.border}`,marginBottom:3,
        opacity:dragId===task.id?0.4:1,borderTop:isDO?`2px solid ${ACCENT}`:'2px solid transparent',
        cursor:reorderOn?'grab':'default',touchAction:reorderOn?'none':'auto'}},
      reorderOn&&h('div',{style:{color:TEXT3,display:'flex',padding:'2px 0'}},h(IC.Grip)),
      h('div',{style:{width:7,height:7,borderRadius:99,flexShrink:0,background:done?SUCCESS:isSk?BORDER:c.dot}}),
      h('div',{style:{flex:1,minWidth:0}},
        h('div',{style:{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap'}},
          h('span',{style:{fontSize:12,fontWeight:500,color:done?TEXT3:TEXT1,textDecoration:done?'line-through':'none'}},task.name),
          (task.isGoal||parentHasGoal(task.id))&&h('span',{style:{fontSize:8,color:ACCENT}},'🎯'),
          wasEnd&&h('span',{style:{fontSize:8,color:SUCCESS,fontWeight:700}},'✨'),
          subs.length>0&&h('button',{onClick:e=>{e.stopPropagation();setCollSubs(p=>({...p,[task.id]:!p[task.id]}))},style:{fontSize:9,color:TEXT3,background:'none',border:'none',cursor:'pointer',padding:'0 4px'}},subsColl?'▸ '+subs.length:' ▾ '+subs.length)),
        chips.length>0&&h('div',{style:{display:'flex',gap:5,marginTop:2}},chips)),
      h('div',{style:{display:'flex',gap:2,flexShrink:0}},btns));

    const childRows=!subsColl?subs.sort((a,b)=>a.order-b.order).map(s=>aRow(s,cat,true)):[];
    return h('div',{key:task.id},row,...childRows);
  };

  // ─── RENDER ───
  return h('div',{style:{fontFamily:F,background:BG,minHeight:'100vh',maxWidth:480,margin:'0 auto',position:'relative',color:TEXT1}},
    // Celebration overlays
    celeb&&h(Celebration,{text:celeb,big:celebBig,onDone:()=>{setCeleb(null);setCelebBig(false)}}),
    rewardCeleb&&h('div',{style:{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:998,pointerEvents:'none'}},
      h('div',{style:{textAlign:'center',animation:'popIn .4s cubic-bezier(.175,.885,.32,1.275) forwards'}},
        h('div',{style:{fontSize:52}},'🎁'),
        h('div',{style:{fontSize:17,fontWeight:700,color:'#8060B4',marginTop:8,fontFamily:SERIF,fontStyle:'italic'}},rewardCeleb.name),
        h('div',{style:{fontSize:11,color:TEXT3,marginTop:3}},(rewardCeleb.type==='micro'?'⚡ Micro':'🌟 Macro')+' reward'))),
    // Banner
    banner&&h('div',{style:{position:'fixed',top:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,background:ACCENT,color:'#fff',padding:'12px 16px',display:'flex',alignItems:'center',gap:8,zIndex:300,paddingTop:'calc(12px + env(safe-area-inset-top))'}},
      h('span',{style:{fontSize:14}},'⏰'),h('span',{style:{flex:1,fontSize:13,fontWeight:600}},banner),h('button',{onClick:()=>setBanner(null),style:{background:'none',border:'none',color:'#fff',cursor:'pointer',display:'flex'}},h(IC.X))),

    // ─── HEADER ───
    h('div',{style:{padding:'14px 18px 10px',background:CARD,position:'sticky',top:0,zIndex:50,backdropFilter:'blur(16px)',borderBottom:`1px solid ${BORDER}`,display:'flex',alignItems:'center',gap:10}},
      h('div',{style:{flex:1,display:'flex',alignItems:'center',gap:8}},
        h('span',{style:{fontSize:17,fontWeight:600,color:TEXT1,fontFamily:SERIF,fontStyle:'italic'}},
          tab==='day'?'My Day':tab==='admin'?'Manage':'Log'),
        h('span',{className:'sd '+(synced?'sd-on':'sd-off')}),
        h('span',{style:{fontSize:12,color:TEXT3,marginLeft:2}},ct)),
      focusProj&&tab==='day'&&h('button',{onClick:()=>setFocusProj(null),style:{fontSize:10,padding:'4px 10px',borderRadius:99,background:'rgba(232,149,109,0.1)',border:`1px solid ${ACCENT}`,color:ACCENT,cursor:'pointer',fontFamily:F,fontWeight:600}},focusProj+' ✕'),
      tab==='day'&&projects.length>0&&h('button',{onClick:()=>setShowFocus(!showFocus),style:{background:'none',border:'none',cursor:'pointer',padding:4,display:'flex',color:focusProj?ACCENT:TEXT3}},h(IC.Zap)),
      h('button',{onClick:nOn?()=>setNOn(false):rqN,style:{background:'none',border:'none',cursor:'pointer',padding:4,display:'flex',color:nOn?ACCENT:TEXT3}},nOn?h(IC.Bell):h(IC.BellOff))),
    // Focus filter dropdown
    showFocus&&h('div',{style:{position:'absolute',top:56,right:16,background:CARD,borderRadius:12,padding:6,zIndex:60,boxShadow:`0 8px 32px rgba(0,0,0,0.12)`,minWidth:130,border:`1px solid ${BORDER}`}},
      h('button',{onClick:()=>{setFocusProj(null);setShowFocus(false)},style:{width:'100%',textAlign:'left',padding:'6px 10px',background:!focusProj?'rgba(232,149,109,0.08)':'none',border:'none',borderRadius:7,color:!focusProj?ACCENT:TEXT2,cursor:'pointer',fontSize:11,fontFamily:F,fontWeight:600}},'All'),
      projects.map(p=>h('button',{key:p,onClick:()=>{setFocusProj(p);setShowFocus(false)},style:{width:'100%',textAlign:'left',padding:'6px 10px',background:focusProj===p?'rgba(232,149,109,0.08)':'none',border:'none',borderRadius:7,color:focusProj===p?ACCENT:TEXT2,cursor:'pointer',fontSize:11,fontFamily:F,fontWeight:600,marginTop:1}},p))),

    // ─── CONTENT ───
    h('div',{style:{padding:'12px 14px',paddingBottom:90,overflowY:'auto',height:'calc(100vh - 55px - 60px)',WebkitOverflowScrolling:'touch'}},

    // ═══ DAY VIEW ═══
    tab==='day'&&h('div',{style:{paddingBottom:80}},
      // Inventory pill
      h('button',{onClick:()=>setShowInv(true),style:{
        position:'fixed',top:60,right:'calc(50% - 225px)',zIndex:55,
        fontSize:12,padding:'5px 12px',borderRadius:99,
        background:inventory.length>0?'rgba(232,149,109,0.1)':CARD,
        border:`1px solid ${inventory.length>0?ACCENT:BORDER}`,
        color:inventory.length>0?ACCENT:TEXT3,
        cursor:'pointer',fontFamily:F,fontWeight:600,
        boxShadow:`0 2px 10px rgba(0,0,0,0.06)`,backdropFilter:'blur(8px)'
      }},'🎁 '+inventory.length),

      postEnd&&h('button',{onClick:()=>setPostEnd(null),style:{display:'flex',alignItems:'center',justifyContent:'center',gap:5,width:'100%',padding:9,marginBottom:10,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:10,color:TEXT3,fontSize:10,fontWeight:600,cursor:'pointer',fontFamily:F}},'✨ Clear done markers'),

      // Mode toggle
      h('div',{style:{marginBottom:14}},
        h('div',{style:{display:'flex',position:'relative',background:BG,borderRadius:13,padding:3,height:42,border:`1px solid ${BORDER}`}},
          h('div',{style:{position:'absolute',top:3,left:3,width:'calc(50% - 3px)',height:36,borderRadius:11,transition:'transform .25s cubic-bezier(.22,1,.36,1)',transform:mode==='work'?'translateX(100%)':'translateX(0%)',background:CARD,boxShadow:`0 2px 8px rgba(0,0,0,0.07)`}}),
          h('button',{onClick:()=>setMode('personal'),style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,fontSize:13,fontWeight:600,background:'none',border:'none',cursor:'pointer',zIndex:1,fontFamily:F,color:mode==='personal'?TEXT1:TEXT3}},h(IC.Sun),' Personal'),
          h('button',{onClick:()=>setMode('work'),style:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,fontSize:13,fontWeight:600,background:'none',border:'none',cursor:'pointer',zIndex:1,fontFamily:F,color:mode==='work'?TEXT1:TEXT3}},h(IC.Brief),' Work'))),

      // Progress
      h('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:14}},
        h('div',{style:{flex:1,height:4,background:BG,borderRadius:99,overflow:'hidden',border:`1px solid ${BORDER}`}},
          h('div',{style:{height:'100%',borderRadius:99,transition:'width .5s cubic-bezier(.22,1,.36,1)',width:pct*100+'%',background:pct===1?`linear-gradient(90deg,${SUCCESS},#A8E8C4)`:`linear-gradient(90deg,${ACCENT},#F0B090)`}})),
        h('span',{style:{fontSize:12,fontWeight:600,color:TEXT3,minWidth:28,textAlign:'right'}},rCnt+'/'+dayT.length)),

      // Events strip
      todayEv.length>0&&h('div',{style:{marginBottom:12}},
        h('div',{style:{fontSize:10,fontWeight:700,color:ACCENT2,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6,padding:'0 2px'}},'Today'),
        h('div',{style:{display:'flex',flexDirection:'column',gap:4}},todayEv.map(rEvent))),

      // Hero card
      nxt&&h(HeroCard,{task:nxt,dN,doC,doS,doHold,setViewing,uN,ct}),

      // All done
      pct===1&&h('div',{style:{background:CARD,borderRadius:18,padding:'22px 20px',textAlign:'center',boxShadow:`0 2px 16px rgba(0,0,0,0.05)`}},
        h('span',{style:{fontSize:28}},'🎉'),
        h('div',{style:{fontSize:18,fontWeight:600,color:TEXT1,fontFamily:SERIF,fontStyle:'italic',marginTop:8}},'All done')),

      // Sections
      completedT.length>0&&h('div',null,
        secH('Completed',completedT.length,showCompleted,setShowCompleted),
        showCompleted&&h('div',{style:{display:'flex',flexDirection:'column',gap:3}},completedT.map(t=>rCard(t,true)))),
      blockedT.length>0&&h('div',null,
        secH('Time locked',blockedT.length,showBlocked,setShowBlocked),
        showBlocked&&h('div',{style:{display:'flex',flexDirection:'column',gap:3}},blockedT.map(t=>rCard(t,true)))),
      aheadT.length>0&&h('div',null,
        secH('Up ahead',aheadT.length,showAhead,setShowAhead),
        showAhead&&h('div',{style:{display:'flex',flexDirection:'column',gap:3}},aheadT.map(t=>rCard(t)))),

      // End day
      rCnt>0&&h('button',{onClick:()=>setCEnd(true),style:{
        display:'flex',alignItems:'center',justifyContent:'center',gap:8,
        width:'100%',padding:12,marginTop:24,
        background:'transparent',border:`1.5px solid ${BORDER}`,
        borderRadius:13,color:TEXT3,fontSize:13,fontWeight:600,
        cursor:'pointer',fontFamily:F
      }},h(IC.Moon),' End Day')),

    // ═══ ADMIN VIEW ═══
    tab==='admin'&&h('div',{style:{paddingBottom:100}},
      h('div',{style:{display:'flex',alignItems:'center',gap:6,marginBottom:12}},
        h('button',{onClick:()=>{if(reorderOn&&planTmrw&&todaySnap.current){setTasks(prev=>prev.map(t=>todaySnap.current[t.id]!=null?{...t,order:todaySnap.current[t.id]}:t));todaySnap.current=null}setReorderOn(!reorderOn);setPlanTmrw(false)},style:{
          fontSize:11,padding:'5px 11px',borderRadius:8,
          background:reorderOn?'rgba(232,149,109,0.1)':BG,
          border:`1px solid ${reorderOn?ACCENT:BORDER}`,
          color:reorderOn?ACCENT:TEXT3,cursor:'pointer',fontFamily:F,fontWeight:600
        }},reorderOn?'🔓 Reorder':'🔒 Reorder'),
        reorderOn&&h('button',{onClick:()=>{if(!planTmrw){const snap={};tasks.forEach(t=>{snap[t.id]=t.order});todaySnap.current=snap;setPlanTmrw(true)}else{if(todaySnap.current){setTasks(prev=>prev.map(t=>todaySnap.current[t.id]!=null?{...t,order:todaySnap.current[t.id]}:t));todaySnap.current=null}setPlanTmrw(false)}},style:{
          fontSize:11,padding:'5px 11px',borderRadius:8,
          background:planTmrw?'rgba(109,181,200,0.1)':BG,border:`1px solid ${planTmrw?ACCENT2:BORDER}`,
          color:planTmrw?ACCENT2:TEXT3,cursor:'pointer',fontFamily:F,fontWeight:600
        }},planTmrw?'📅 Tomorrow':'📅 Today'),
        h('button',{onClick:()=>{markDirty();setTasks(prev=>{const cats=['core','event','work','personal'];const result=[...prev];cats.forEach(cat=>{const parents=result.filter(t=>t.category===cat&&!t.archived&&!t.parentId).sort((a,b)=>(a.order||0)-(b.order||0));parents.forEach((p,i)=>{const idx=result.findIndex(t=>t.id===p.id);if(idx>=0)result[idx]={...result[idx],order:i};const subs=result.filter(t=>t.parentId===p.id&&!t.archived).sort((a,b)=>(a.order||0)-(b.order||0));subs.forEach((s,j)=>{const si=result.findIndex(t=>t.id===s.id);if(si>=0)result[si]={...result[si],order:j}})})});return result})},style:{
          fontSize:11,padding:'5px 11px',borderRadius:8,background:BG,border:`1px solid ${BORDER}`,color:TEXT3,cursor:'pointer',fontFamily:F,fontWeight:600,marginLeft:'auto'
        }},'🔧 Fix')),

      nextDayOrder&&Object.keys(nextDayOrder).length>0&&h('div',{style:{fontSize:10,color:ACCENT2,background:'rgba(109,181,200,0.06)',border:`1px solid rgba(109,181,200,0.2)`,borderRadius:9,padding:'6px 10px',marginBottom:8,display:'flex',alignItems:'center',justifyContent:'space-between'}},
        h('span',null,'📅 Tomorrow planned'),
        h('button',{onClick:()=>{setNextDayOrder(null);markDirty()},style:{fontSize:9,padding:'2px 8px',background:'none',border:`1px solid rgba(109,181,200,0.3)`,borderRadius:5,color:ACCENT2,cursor:'pointer',fontFamily:F}},'Clear')),

      ['core','event','work','personal'].map(cat=>{
        const list=grp[cat];if(!list||!list.length)return null;
        const c=CAT[cat],coll=!!collCats[cat];
        return h('div',{key:cat,style:{marginBottom:coll?6:14}},
          h('button',{onClick:()=>setCollCats(p=>({...p,[cat]:!p[cat]})),style:{
            display:'flex',alignItems:'center',gap:6,width:'100%',textAlign:'left',
            fontSize:11,fontWeight:700,textTransform:'uppercase',color:c.text,
            marginBottom:coll?0:6,padding:'0 2px',background:'none',border:'none',cursor:'pointer',fontFamily:F
          }},
            h('span',{style:{width:7,height:7,borderRadius:99,background:c.dot,display:'inline-block'}}),
            c.label+' ('+list.length+')',
            h('span',{style:{fontSize:10,marginLeft:4,display:'inline-block',transform:coll?'rotate(-90deg)':'rotate(0)',transition:'transform .18s'}},'▾')),
          !coll&&list.sort((a,b)=>a.order-b.order).map(t=>aRow(t,cat,false)))
      }),

      // Event calendar
      (()=>{const evts=tasks.filter(t=>t.category==='event'&&!t.archived);if(!evts.length)return null;
        const allDates=[];evts.forEach(t=>toArr(t.eventDates).forEach(d=>allDates.push({date:d,name:t.name,time:getActTime(t,dw)||'',id:t.id})));
        allDates.sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
        return h('div',{style:{marginTop:14,background:CARD,borderRadius:13,padding:'12px 14px',border:`1px solid ${BORDER}`,boxShadow:`0 1px 6px rgba(0,0,0,0.04)`}},
          h('div',{style:{fontSize:11,fontWeight:700,color:ACCENT2,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.06em'}},'📅 Eventos'),
          allDates.length===0?h('div',{style:{fontSize:11,color:TEXT3,fontStyle:'italic'}},'Sin fechas'):
          allDates.map((ev,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:8,padding:'5px 0',borderBottom:i<allDates.length-1?`1px solid ${BORDER}`:'none'}},
            h('span',{style:{fontSize:11,color:ACCENT2,fontWeight:600,minWidth:80,fontFamily:'monospace'}},ev.date),
            ev.time&&h('span',{style:{fontSize:10,color:TEXT3,minWidth:36}},ev.time),
            h('span',{style:{fontSize:11,color:TEXT1}},ev.name))))})(),

      // Rewards section
      h('div',{style:{marginTop:18,paddingTop:14,borderTop:`1px solid ${BORDER}`}},
        h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}},
          h('div',{style:{fontSize:11,fontWeight:700,color:'#8060B4',textTransform:'uppercase',letterSpacing:'0.06em'}},'🎁 Rewards'),
          h('button',{onClick:()=>setShowRewardEdit(true),style:{fontSize:10,padding:'4px 10px',background:'rgba(160,130,200,0.1)',border:'1px solid rgba(160,130,200,0.25)',borderRadius:99,color:'#8060B4',cursor:'pointer',fontFamily:F,fontWeight:600}},'+Add')),
        rewards.length===0?h('div',{style:{fontSize:11,color:TEXT3,fontStyle:'italic',padding:6}},'No rewards yet'):
        rewards.map((rw,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',background:CARD,borderRadius:9,marginBottom:3,boxShadow:`0 1px 4px rgba(0,0,0,0.04)`}},
          h('span',{style:{fontSize:10,padding:'2px 7px',borderRadius:99,background:rw.type==='micro'?'rgba(109,181,200,0.12)':'rgba(160,130,200,0.12)',color:rw.type==='micro'?ACCENT2:'#8060B4',fontWeight:700}},rw.type==='micro'?'⚡':'🌟'),
          h('span',{style:{flex:1,fontSize:12,color:TEXT1}},rw.name),
          h('button',{onClick:()=>{markDirty();setRewards(p=>p.filter((_,j)=>j!==i))},style:{background:'none',border:'none',color:'#C06060',cursor:'pointer',display:'flex'}},h(IC.X))))),

      // Archived
      arcTasks.length>0&&h('div',{style:{marginTop:14}},
        h('button',{onClick:()=>setShowAr(!showAr),style:{display:'flex',alignItems:'center',gap:6,width:'100%',padding:'9px 11px',background:CARD,border:`1px solid ${BORDER}`,borderRadius:11,color:TEXT3,fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:F,marginBottom:5}},h(IC.Archive),' Archived ('+arcTasks.length+')'),
        showAr&&arcTasks.map(t=>h('div',{key:t.id,style:{display:'flex',alignItems:'center',gap:8,padding:'8px 11px',background:CARD,borderRadius:9,marginBottom:3,opacity:0.5}},
          h('div',{style:{flex:1,fontSize:12,color:TEXT1,textDecoration:'line-through'}},t.name),
          h('button',{onClick:()=>unT(t.id),style:{width:24,height:24,background:BG,border:`1px solid ${BORDER}`,borderRadius:6,color:ACCENT2,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}},'↩'),
          h('button',{onClick:()=>setCDel(t.id),style:{width:24,height:24,background:BG,border:`1px solid ${BORDER}`,borderRadius:6,color:'#C06060',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}},h(IC.Trash))))),

      // FABs
      h('button',{onClick:()=>setEditing('new'),style:{position:'fixed',bottom:74,right:'calc(50% - 215px)',width:48,height:48,borderRadius:14,background:ACCENT,border:'none',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:`0 6px 20px rgba(232,149,109,0.4)`,zIndex:90}},h(IC.Plus)),
      h('button',{onClick:()=>setShowImport(true),style:{position:'fixed',bottom:74,right:'calc(50% - 157px)',width:48,height:48,borderRadius:14,background:ACCENT2,border:'none',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:`0 6px 20px rgba(109,181,200,0.35)`,zIndex:90,fontSize:18}},'📥'),
      h('button',{onClick:()=>{const cats=['core','event','work','personal'];const catLabel={core:'Core',event:'Events',work:'Work',personal:'Personal'};const lines=[];cats.forEach(cat=>{const ts=tasks.filter(t=>t.category===cat&&!t.archived&&!t.parentId);if(!ts.length)return;lines.push('## '+catLabel[cat]);ts.forEach(t=>{const ad=toArr(t.activeDays);const days=ad.length>0&&ad.length<7?' ['+ad.map(d=>DL[d]).join('')+']':'';const time=t.timeCondition?' '+t.timeCondition.time:'';const proj=t.project?' — '+t.project:'';lines.push('- [ ] '+t.name+proj+time+days);if(t.notes&&t.notes.trim())lines.push('    > '+t.notes.trim().replace(/\n/g,'\n    > '));const subs=tasks.filter(s=>s.parentId===t.id&&!s.archived);subs.forEach(s=>lines.push('    - [ ] '+s.name))});lines.push('')});navigator.clipboard.writeText(lines.join('\n')).then(()=>{setBanner('📋 Copied!');setTimeout(()=>setBanner(null),2000)}).catch(()=>{})},style:{position:'fixed',bottom:74,right:'calc(50% - 99px)',width:48,height:48,borderRadius:14,background:'#8060B4',border:'none',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:`0 6px 20px rgba(128,96,180,0.3)`,zIndex:90,fontSize:18}},'📤')),

    // ═══ LOG VIEW ═══
    tab==='log'&&h(LogView,{dailyLogs,lifeGoals,setLifeGoals,timeline,setTimeline,markDirty})),

    // ─── NAV ───
    h('div',{style:{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,display:'flex',background:CARD,backdropFilter:'blur(20px)',borderTop:`1px solid ${BORDER}`,zIndex:100,padding:'6px 0',paddingBottom:'calc(6px + env(safe-area-inset-bottom))'}},
      [['day','My Day',IC.Cal],['admin','Manage',IC.Gear],['log','Log',IC.Note]].map(([id,label,Ico])=>
        h('button',{key:id,onClick:()=>setTab(id),style:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'8px 0',background:'none',border:'none',cursor:'pointer',fontFamily:F,color:tab===id?ACCENT:TEXT3,transition:'color .18s'}},
          h(Ico),h('span',{style:{fontSize:10,fontWeight:tab===id?700:500}},label)))),

    // ─── MODALS ───
    conflict&&h(Confirm,{title:'Conflict',msg:'Cloud: '+new Date(conflict.rTs||0).toLocaleString()+'\nLocal: '+new Date(conflict.lTs||0).toLocaleString(),onOk:()=>{applyData(conflict.local);isResolving.current=false;setConflict(null);markDirty()},onNo:()=>{applyData(conflict.remote);isResolving.current=false;setConflict(null)},okLbl:'Local',noLbl:'Cloud',okClr:ACCENT}),
    editing!==null&&h(TaskForm,{task:editing==='new'?null:editing,allTasks:tasks,onSave:svT,onClose:()=>setEditing(null)}),
    viewing!==null&&h(DetailSheet,{task:viewing,dispName:dN(viewing),onClose:()=>setViewing(null),onUpdateNotes:n=>{uN(viewing.id,n);setViewing({...viewing,notes:n})},parentHasGoal}),
    cEnd&&h(EndDaySheet,{tasks,comp,skip,onConfirm:endD,onClose:()=>setCEnd(false)}),
    cDel&&h(Confirm,{title:'Delete',msg:'Delete "'+(tasks.find(t=>t.id===cDel)?.name||'')+'"?',onOk:()=>delT(cDel),onNo:()=>setCDel(null),okLbl:'Delete',okClr:'#C06060'}),
    showRewardEdit&&h(RewardEditor,{rewards,onSave:r=>{markDirty();setRewards(r);setShowRewardEdit(false)},onClose:()=>setShowRewardEdit(false)}),
    showImport&&h(ImportSheet,{onImport:(items)=>{markDirty();setTasks(prev=>{const maxOrd=Math.max(0,...prev.map(t=>t.order||0))+1;const newTasks=[];items.forEach((item,i)=>{const pid=gid();newTasks.push({id:pid,name:item.name,category:item.category,project:item.project||'',notes:item.notes||'',timeCondition:null,dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:maxOrd+i,reminderMin:0,isGoal:false,parentId:null});(item.subs||[]).forEach((s,j)=>{newTasks.push({id:gid(),name:s,category:item.category,project:item.project||'',notes:'',timeCondition:null,dependsOn:null,activeDays:[...ALL_DAYS],eventDates:[],archived:false,order:j,reminderMin:0,isGoal:false,parentId:pid})})});return[...prev,...newTasks]});setShowImport(false)},onClose:()=>setShowImport(false)}),
    showInv&&h(InventorySheet,{inventory,onClose:()=>setShowInv(false),onRemove:i=>{markDirty();setInventory(p=>p.filter((_,j)=>j!==i))}}));
}

// ─── REWARD EDITOR ────────────────────────────────────────────────
function RewardEditor({rewards,onSave,onClose}){
  const[list,setList]=useState([...rewards]);const[name,setName]=useState('');const[type,setType]=useState('micro');
  const add=()=>{if(!name.trim())return;setList(p=>[...p,{name:name.trim(),type}]);setName('')};
  const inp={width:'100%',padding:'10px 13px',background:BG,border:`1.5px solid ${BORDER}`,borderRadius:10,color:TEXT1,fontSize:13,fontFamily:F,outline:'none',boxSizing:'border-box'};
  return h('div',{onClick:onClose,style:{position:'fixed',inset:0,background:'rgba(44,40,37,0.12)',backdropFilter:'blur(6px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16}},
    h('div',{onClick:e=>e.stopPropagation(),style:{width:'100%',maxWidth:400,background:CARD,borderRadius:20,padding:'22px 20px',maxHeight:'80vh',overflow:'auto',boxShadow:`0 -4px 40px rgba(0,0,0,0.1)`}},
      h('h2',{style:{fontSize:16,fontWeight:600,color:TEXT1,margin:'0 0 16px',fontFamily:SERIF,fontStyle:'italic'}},'🎁 Rewards Bag'),
      h('div',{style:{display:'flex',gap:7,marginBottom:10}},
        h('input',{style:{...inp,flex:1},value:name,onChange:e=>setName(e.target.value),placeholder:'Movie, Snack, Game...',onKeyDown:e=>{if(e.key==='Enter')add()}}),
        h('select',{style:{...inp,width:84,WebkitAppearance:'none'},value:type,onChange:e=>setType(e.target.value)},h('option',{value:'micro'},'⚡ Micro'),h('option',{value:'macro'},'🌟 Macro')),
        h('button',{onClick:add,style:{padding:'8px 14px',background:ACCENT,border:'none',borderRadius:10,color:'#fff',fontWeight:700,cursor:'pointer',fontFamily:F}},'++')),
      list.map((rw,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',background:BG,borderRadius:9,marginBottom:3}},
        h('span',{style:{fontSize:10,padding:'2px 7px',borderRadius:99,background:rw.type==='micro'?'rgba(109,181,200,0.12)':'rgba(160,130,200,0.12)',color:rw.type==='micro'?ACCENT2:'#8060B4',fontWeight:700}},rw.type==='micro'?'⚡':'🌟'),
        h('span',{style:{flex:1,fontSize:12,color:TEXT1}},rw.name),
        h('button',{onClick:()=>setList(p=>p.filter((_,j)=>j!==i)),style:{background:'none',border:'none',color:'#C06060',cursor:'pointer',display:'flex'}},h(IC.X)))),
      h('div',{style:{display:'flex',gap:8,marginTop:16}},
        h('button',{onClick:onClose,style:{flex:1,padding:12,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:12,color:TEXT2,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F}},'Cancel'),
        h('button',{onClick:()=>onSave(list),style:{flex:1,padding:12,background:'#8060B4',border:'none',borderRadius:12,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F}},'Save'))));
}

// ─── INVENTORY ────────────────────────────────────────────────────
function InventorySheet({inventory,onClose,onRemove}){
  return h('div',{onClick:onClose,style:{position:'fixed',inset:0,background:'rgba(44,40,37,0.12)',backdropFilter:'blur(6px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16}},
    h('div',{onClick:e=>e.stopPropagation(),style:{width:'100%',maxWidth:400,background:CARD,borderRadius:20,padding:'22px 20px',maxHeight:'70vh',overflow:'auto',boxShadow:`0 -4px 40px rgba(0,0,0,0.1)`}},
      h('h2',{style:{fontSize:16,fontWeight:600,color:TEXT1,margin:'0 0 14px',fontFamily:SERIF,fontStyle:'italic'}},'🎁 Inventory ('+inventory.length+')'),
      inventory.length===0?h('div',{style:{fontSize:13,color:TEXT3,textAlign:'center',padding:24}},'Complete goals to earn rewards!'):
      inventory.map((rw,i)=>h('div',{key:i,style:{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:BG,borderRadius:11,marginBottom:4}},
        h('span',{style:{fontSize:20}},rw.type==='micro'?'⚡':'🌟'),
        h('span',{style:{flex:1,fontSize:14,color:TEXT1,fontWeight:600}},rw.name),
        h('button',{onClick:()=>onRemove(i),style:{padding:'4px 10px',fontSize:11,background:'rgba(200,100,100,0.08)',border:'1px solid rgba(200,100,100,0.15)',borderRadius:99,color:'#C06060',cursor:'pointer',fontFamily:F,fontWeight:600}},'Used'))),
      h('div',{style:{fontSize:10,color:TEXT3,textAlign:'center',marginTop:10,fontStyle:'italic'}},'Resets at End Day'),
      h('button',{onClick:onClose,style:{width:'100%',padding:12,marginTop:12,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:12,color:TEXT2,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F}},'Close')));
}

// ─── DETAIL SHEET ─────────────────────────────────────────────────
function DetailSheet({task,dispName,onClose,onUpdateNotes,parentHasGoal}){
  const[notes,setNotes]=useState(task.notes||'');const[dirty,setDirty]=useState(false);const c=CAT[task.category];
  return h('div',{onClick:onClose,style:{position:'fixed',inset:0,background:'rgba(44,40,37,0.12)',backdropFilter:'blur(6px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16}},
    h('div',{onClick:e=>e.stopPropagation(),style:{width:'100%',maxWidth:420,background:CARD,borderRadius:20,padding:'22px 20px',maxHeight:'80vh',overflow:'auto',boxShadow:`0 -4px 40px rgba(0,0,0,0.1)`}},
      h('div',{style:{display:'flex',alignItems:'center',gap:7,marginBottom:6}},
        h('span',{style:{fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:99,background:c.bg,color:c.text}},c.label.toUpperCase()),
        task.project&&h('span',{style:{fontSize:11,color:TEXT3}},task.project),
        (task.isGoal||(parentHasGoal&&parentHasGoal(task.id)))&&h('span',{style:{fontSize:10,color:ACCENT,fontWeight:700}},'🎯')),
      h('h2',{style:{fontSize:18,fontWeight:400,color:TEXT1,margin:'8px 0 14px',fontFamily:SERIF,fontStyle:'italic',lineHeight:1.3}},dispName),
      task.timeCondition&&h('div',{style:{fontSize:12,color:TEXT3,marginBottom:6}},task.timeCondition.time),
      task.category==='event'&&toArr(task.eventDates).length>0&&h('div',{style:{fontSize:11,color:ACCENT2,marginBottom:6}},'📅 '+toArr(task.eventDates).join(', ')),
      toArr(task.activeDays).length>0&&toArr(task.activeDays).length<7&&h('div',{style:{display:'flex',gap:4,marginBottom:12}},DAYS.map(d=>h('span',{key:d,style:{fontSize:10,fontWeight:600,padding:'3px 7px',borderRadius:7,background:toArr(task.activeDays).includes(d)?'rgba(232,149,109,0.1)':BG,color:toArr(task.activeDays).includes(d)?ACCENT:TEXT3,border:`1px solid ${toArr(task.activeDays).includes(d)?'rgba(232,149,109,0.2)':BORDER}`}},DL[d]))),
      h('label',{style:{display:'block',fontSize:10,fontWeight:600,color:TEXT3,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:5}},'Notes'),
      h('textarea',{style:{width:'100%',padding:'10px 13px',background:BG,border:`1.5px solid ${BORDER}`,borderRadius:11,color:TEXT1,fontSize:13,fontFamily:F,outline:'none',boxSizing:'border-box',minHeight:100,resize:'vertical',lineHeight:1.5},value:notes,onChange:e=>{setNotes(e.target.value);setDirty(true)},placeholder:'Notes...'}),
      h('div',{style:{display:'flex',gap:8,marginTop:14}},
        h('button',{onClick:onClose,style:{flex:1,padding:12,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:12,color:TEXT2,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F}},'Close'),
        dirty&&h('button',{onClick:()=>{onUpdateNotes(notes);setDirty(false)},style:{flex:1,padding:12,background:ACCENT,border:'none',borderRadius:12,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F}},'Save'))));
}

// ─── TASK FORM ────────────────────────────────────────────────────
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
  const inp={width:'100%',padding:'10px 13px',background:BG,border:`1.5px solid ${BORDER}`,borderRadius:10,color:TEXT1,fontSize:13,fontFamily:F,outline:'none',boxSizing:'border-box'};
  const lbl={display:'block',fontSize:10,fontWeight:600,color:TEXT3,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:4,marginTop:14};
  const slbl={display:'block',fontSize:10,fontWeight:600,color:TEXT3,marginBottom:3,marginTop:8};
  const Toggle=({on,toggle,color})=>h('button',{onClick:toggle,style:{width:40,height:22,borderRadius:11,border:'none',cursor:'pointer',position:'relative',padding:0,background:on?(color||ACCENT):BORDER,transition:'background .2s'}},h('div',{style:{width:18,height:18,borderRadius:9,background:'#fff',position:'absolute',top:2,transition:'transform .2s',transform:on?'translateX(20px)':'translateX(2px)',boxShadow:'0 1px 3px rgba(0,0,0,0.15)'}}));

  return h('div',{onClick:onClose,style:{position:'fixed',inset:0,background:'rgba(44,40,37,0.12)',backdropFilter:'blur(6px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16}},
    h('div',{onClick:e=>e.stopPropagation(),style:{width:'100%',maxWidth:420,background:CARD,borderRadius:20,padding:'22px 20px',maxHeight:'85vh',overflow:'auto',boxShadow:`0 -4px 40px rgba(0,0,0,0.1)`}},
      h('h2',{style:{fontSize:16,fontWeight:400,color:TEXT1,margin:'0 0 16px',fontFamily:SERIF,fontStyle:'italic'}},isE?'Edit task':iNS?'New subtask':'New task'),
      pId&&h('div',{style:{fontSize:11,color:TEXT3,marginBottom:12}},'↳ '+(allTasks.find(t=>t.id===pId)?.name||'')),
      h('label',{style:lbl},'Name'),h('input',{style:inp,value:nm,onChange:e=>setNm(e.target.value),placeholder:'Task name',autoFocus:true}),
      !pId&&h('div',null,h('label',{style:lbl},'Category'),h('select',{style:{...inp,WebkitAppearance:'none'},value:cat,onChange:e=>setCat(e.target.value)},h('option',{value:'core'},'Core'),h('option',{value:'event'},'Event'),h('option',{value:'work'},'Work'),h('option',{value:'personal'},'Personal'))),
      h('label',{style:lbl},'Project'),h('input',{style:inp,value:proj,onChange:e=>setProj(e.target.value),placeholder:'Project',list:'pl'}),h('datalist',{id:'pl'},pjs.map(p=>h('option',{key:p,value:p}))),
      h('label',{style:lbl},'Notes'),h('textarea',{style:{...inp,minHeight:40,resize:'vertical'},value:notes,onChange:e=>setNotes(e.target.value),placeholder:'...'}),
      (cat==='work'||cat==='personal')&&h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:14}},
        h('label',{style:{...lbl,marginTop:0}},'🎯 Daily goal'),
        h(Toggle,{on:isG,toggle:()=>setIG(!isG),color:ACCENT})),
      cat!=='event'&&h('div',null,h('label',{style:lbl},'Days'),h('div',{style:{display:'flex',gap:4,flexWrap:'wrap'}},DAYS.map(d=>h('button',{key:d,onClick:()=>togD(d),style:{padding:'6px 10px',borderRadius:8,fontSize:12,fontWeight:600,fontFamily:F,cursor:'pointer',border:`1.5px solid ${ad.includes(d)?ACCENT:BORDER}`,background:ad.includes(d)?'rgba(232,149,109,0.1)':BG,color:ad.includes(d)?ACCENT:TEXT3,transition:'all .15s'}},DF[d])))),
      cat==='event'&&h('div',null,h('label',{style:lbl},'Dates'),
        h('div',{style:{display:'flex',gap:6,marginBottom:7}},h('input',{type:'date',style:{...inp,flex:1},value:nd,onChange:e=>setND(e.target.value)}),h('button',{onClick:addD,style:{padding:'8px 14px',background:ACCENT2,border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F}},'Add')),
        h('div',{style:{display:'flex',flexWrap:'wrap',gap:5}},ed.map(d=>h('span',{key:d,style:{display:'flex',alignItems:'center',gap:3,fontSize:11,background:'rgba(109,181,200,0.1)',color:ACCENT2,padding:'3px 9px',borderRadius:99,fontWeight:600}},d,h('button',{onClick:()=>setED(p=>p.filter(x=>x!==d)),style:{background:'none',border:'none',color:ACCENT2,cursor:'pointer',padding:0,display:'flex'}},h(IC.X)))),ed.length===0&&h('span',{style:{fontSize:11,color:TEXT3,fontStyle:'italic'}},'No dates')),
        h('label',{style:{...lbl,marginTop:12}},'Reminder'),h('select',{style:{...inp,WebkitAppearance:'none'},value:rm,onChange:e=>setRM(e.target.value)},h('option',{value:0},'None'),h('option',{value:5},'5m'),h('option',{value:10},'10m'),h('option',{value:15},'15m'),h('option',{value:30},'30m'),h('option',{value:60},'1h'))),
      h('label',{style:lbl},'Depends on'),h('select',{style:{...inp,WebkitAppearance:'none'},value:dep,onChange:e=>setDep(e.target.value)},h('option',{value:''},'None'),allTasks.filter(t=>t.id!==(isE?task.id:null)).map(t=>h('option',{key:t.id,value:t.id},t.name+' ('+CAT[t.category]?.label+')'))),
      h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:14}},
        h('label',{style:{...lbl,marginTop:0}},'Time condition'),
        h(Toggle,{on:hasT,toggle:()=>setHT(!hasT)})),
      hasT&&h('div',{style:{background:BG,borderRadius:12,padding:'8px 13px 13px',marginTop:7,border:`1px solid ${BORDER}`}},
        h('label',{style:slbl},'Default time'),h('input',{type:'time',style:inp,value:time,onChange:e=>setTime(e.target.value)}),
        h('label',{style:slbl},'Label before'),h('input',{style:inp,value:lb,onChange:e=>setLb(e.target.value),placeholder:'Optional'}),
        h('label',{style:slbl},'Label after'),h('input',{style:inp,value:la,onChange:e=>setLa(e.target.value),placeholder:'Optional'}),
        (lb||la)&&h('div',null,h('label',{style:slbl},'Switch at'),h('input',{type:'time',style:inp,value:lst,onChange:e=>setLst(e.target.value)})),
        h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:10}},
          h('label',{style:{fontSize:10,fontWeight:600,color:TEXT3}},'Per-day times'),
          h(Toggle,{on:shDOv,toggle:()=>setShDOv(!shDOv),color:ACCENT2})),
        shDOv&&h('div',{style:{marginTop:8,display:'flex',flexDirection:'column',gap:4}},DAYS.filter(d=>ad.includes(d)).map(d=>h('div',{key:d,style:{display:'flex',alignItems:'center',gap:8}},h('span',{style:{fontSize:11,color:TEXT2,width:28}},DF[d]),h('input',{type:'time',style:{...inp,flex:1,padding:'7px 10px',fontSize:12},value:dOv[d]||'',onChange:e=>{const v=e.target.value;setDOv(p=>v?{...p,[d]:v}:(()=>{const n={...p};delete n[d];return n})())},placeholder:time}))))),
      h('div',{style:{display:'flex',gap:8,marginTop:20}},
        h('button',{onClick:onClose,style:{flex:1,padding:12,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:12,color:TEXT2,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F}},'Cancel'),
        h('button',{onClick:submit,disabled:!nm.trim(),style:{flex:1,padding:12,background:nm.trim()?ACCENT:'#E0D8D0',border:'none',borderRadius:12,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F}},isE?'Save':'Add task'))));
}

// ─── IMPORT SHEET ─────────────────────────────────────────────────
function ImportSheet({onImport,onClose}){
  const[raw,setRaw]=useState('');const[parsed,setParsed]=useState(null);const[editIdx,setEditIdx]=useState(null);
  const doParse=()=>{
    const lines=raw.split('\n').filter(l=>l.trim());const items=[];let current=null;
    lines.forEach(line=>{
      const stripped=line.replace(/^[\s\t]+/,'');const indent=line.length-line.trimStart().length;
      const clean=stripped.replace(/^[-•*]\s*/,'').replace(/^(\[[ x]?\]|☐|☑|✅|✓|□|■)\s*/,'').trim();
      if(!clean)return;
      if(clean.startsWith('>')){const noteText=clean.replace(/^>\s*/,'').trim();if(noteText&&current){current.notes=current.notes?(current.notes+'\n'+noteText):noteText}return}
      const projMatch=clean.match(/#(\S+)\s*$/);const project=projMatch?projMatch[1]:'';const name=projMatch?clean.replace(/#\S+\s*$/,'').trim():clean;
      if(!name)return;
      if(indent>=2&&current){current.subs.push(name)}else{current={name,subs:[],category:'work',selected:true,project,notes:''};items.push(current)}
    });
    setParsed(items);
  };
  const upd=(i,k,v)=>setParsed(p=>p.map((t,j)=>j===i?{...t,[k]:v}:t));
  const inp=(v,f,ph)=>h('input',{style:{width:'100%',padding:'8px 10px',background:BG,border:`1.5px solid ${BORDER}`,borderRadius:8,color:TEXT2,fontSize:11,fontFamily:F,outline:'none',boxSizing:'border-box'},value:v,onChange:e=>f(e.target.value),placeholder:ph});

  return h('div',{onClick:onClose,style:{position:'fixed',inset:0,background:'rgba(44,40,37,0.12)',backdropFilter:'blur(6px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16}},
    h('div',{onClick:e=>e.stopPropagation(),style:{width:'100%',maxWidth:420,background:CARD,borderRadius:20,padding:'22px 20px',maxHeight:'85vh',overflow:'auto',boxShadow:`0 -4px 40px rgba(0,0,0,0.1)`}},
      h('h2',{style:{fontSize:16,fontWeight:400,color:TEXT1,margin:'0 0 4px',fontFamily:SERIF,fontStyle:'italic'}},'📥 Import'),
      h('div',{style:{fontSize:11,color:TEXT3,marginBottom:14}},'Paste tasks from Notion or plain text'),
      !parsed?h('div',null,
        h('textarea',{style:{width:'100%',padding:'12px 13px',background:BG,border:`1.5px solid ${BORDER}`,borderRadius:12,color:TEXT1,fontSize:13,fontFamily:F,outline:'none',boxSizing:'border-box',minHeight:150,resize:'vertical'},value:raw,onChange:e=>setRaw(e.target.value),placeholder:'Task name #Project\n  Subtask 1\n  > Note line\nAnother task'}),
        h('div',{style:{display:'flex',gap:8,marginTop:12}},
          h('button',{onClick:onClose,style:{flex:1,padding:12,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:12,color:TEXT2,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F}},'Cancel'),
          h('button',{onClick:raw.trim()?doParse:null,style:{flex:1,padding:12,background:raw.trim()?ACCENT2:'#E0D8D0',border:'none',borderRadius:12,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F}},'Parse'))):
      h('div',null,
        h('div',{style:{display:'flex',gap:5,marginBottom:10}},
          h('button',{onClick:()=>setParsed(p=>p.map(t=>({...t,category:'work'}))),style:{fontSize:10,padding:'4px 10px',borderRadius:99,background:'rgba(109,181,200,0.1)',border:`1px solid rgba(109,181,200,0.25)`,color:ACCENT2,cursor:'pointer',fontFamily:F,fontWeight:600}},'All → Work'),
          h('button',{onClick:()=>setParsed(p=>p.map(t=>({...t,category:'personal'}))),style:{fontSize:10,padding:'4px 10px',borderRadius:99,background:'rgba(160,130,200,0.1)',border:`1px solid rgba(160,130,200,0.25)`,color:'#8060B4',cursor:'pointer',fontFamily:F,fontWeight:600}},'All → Personal'),
          h('button',{onClick:()=>setParsed(null),style:{marginLeft:'auto',fontSize:10,padding:'4px 10px',borderRadius:99,background:BG,border:`1px solid ${BORDER}`,color:TEXT3,cursor:'pointer',fontFamily:F}},'← Back')),
        parsed.map((t,i)=>{const isEdit=editIdx===i;const c=CAT[t.category];
          return h('div',{key:i,onClick:()=>t.selected&&setEditIdx(isEdit?null:i),style:{background:t.selected?CARD:BG,borderRadius:11,padding:'10px 12px',marginBottom:4,opacity:t.selected?1:0.4,borderLeft:`2.5px solid ${t.selected?c.border:BORDER}`,cursor:'pointer'}},
            h('div',{style:{display:'flex',alignItems:'center',gap:8}},
              h('button',{onClick:e=>{e.stopPropagation();upd(i,'selected',!t.selected)},style:{width:20,height:20,borderRadius:5,border:`2px solid ${t.selected?SUCCESS:BORDER}`,background:t.selected?SUCCESS:'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0,color:'#fff',fontSize:11}},t.selected?'✓':''),
              h('span',{style:{flex:1,fontSize:13,fontWeight:500,color:TEXT1}},t.name),
              (t.project||t.notes)&&h('span',{style:{fontSize:9,color:TEXT3}},'✎'),
              h('button',{onClick:e=>{e.stopPropagation();upd(i,'category',t.category==='work'?'personal':'work')},style:{fontSize:9,padding:'2px 9px',borderRadius:99,border:`1px solid ${c.border}`,background:c.bg,color:c.text,cursor:'pointer',fontFamily:F,fontWeight:700}},t.category==='work'?'💼':'🟢')),
            t.subs.length>0&&h('div',{style:{marginTop:4,paddingLeft:28}},t.subs.map((s,j)=>h('div',{key:j,style:{fontSize:11,color:TEXT3,padding:'1px 0'}},'↳ '+s))),
            isEdit&&h('div',{style:{marginTop:8,display:'flex',flexDirection:'column',gap:6},onClick:e=>e.stopPropagation()},
              inp(t.project,v=>upd(i,'project',v),'Project'),
              h('textarea',{style:{width:'100%',padding:'8px 10px',background:BG,border:`1.5px solid ${BORDER}`,borderRadius:8,color:TEXT2,fontSize:11,fontFamily:F,outline:'none',boxSizing:'border-box',minHeight:40,resize:'vertical'},value:t.notes,onChange:e=>upd(i,'notes',e.target.value),placeholder:'Notes...'})))}),
        h('div',{style:{display:'flex',gap:8,marginTop:12}},
          h('button',{onClick:onClose,style:{flex:1,padding:12,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:12,color:TEXT2,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F}},'Cancel'),
          h('button',{onClick:()=>{const sel=parsed.filter(t=>t.selected);if(sel.length)onImport(sel)},style:{flex:1,padding:12,background:SUCCESS,border:'none',borderRadius:12,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F}},'Import '+parsed.filter(t=>t.selected).length)))));
}

// ─── END DAY ──────────────────────────────────────────────────────
function EndDaySheet({tasks,comp,skip,onConfirm,onClose}){
  const done=tasks.filter(t=>comp[t.id]||skip[t.id]);
  const withNotes=done.filter(t=>t.notes&&t.notes.trim());
  const[copied,setCopied]=useState(false);
  const summary=withNotes.map(t=>'• '+t.name+'\n'+t.notes.trim()).join('\n\n');
  const copyAll=()=>{if(!summary)return;navigator.clipboard.writeText('📋 '+new Date().toLocaleDateString()+'\n\n'+summary).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)}).catch(()=>{})};
  return h('div',{onClick:onClose,style:{position:'fixed',inset:0,background:'rgba(44,40,37,0.12)',backdropFilter:'blur(6px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16}},
    h('div',{onClick:e=>e.stopPropagation(),style:{width:'100%',maxWidth:420,background:CARD,borderRadius:20,padding:'22px 20px',maxHeight:'80vh',overflow:'auto',boxShadow:`0 -4px 40px rgba(0,0,0,0.1)`}},
      h('h2',{style:{fontSize:16,fontWeight:400,color:TEXT1,margin:'0 0 4px',fontFamily:SERIF,fontStyle:'italic'}},'🌙 End Day'),
      h('div',{style:{fontSize:12,color:TEXT3,marginBottom:14}},'Completed: '+done.length+' tasks'),
      withNotes.length>0&&h('div',{style:{marginBottom:14}},
        h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}},
          h('div',{style:{fontSize:11,fontWeight:700,color:ACCENT,textTransform:'uppercase',letterSpacing:'0.06em'}},'Today\'s notes'),
          h('button',{onClick:copyAll,style:{fontSize:10,padding:'4px 10px',background:copied?'rgba(125,200,160,0.1)':'rgba(232,149,109,0.08)',border:`1px solid ${copied?SUCCESS:ACCENT}`,borderRadius:99,color:copied?SUCCESS:ACCENT,cursor:'pointer',fontFamily:F,fontWeight:600}},copied?'✓ Copied':'📋 Copy')),
        withNotes.map(t=>h('div',{key:t.id,style:{background:BG,borderRadius:11,padding:'10px 13px',marginBottom:5,borderLeft:`2.5px solid ${ACCENT}`}},
          h('div',{style:{fontSize:11,fontWeight:600,color:ACCENT,marginBottom:3}},t.name),
          h('div',{style:{fontSize:12,color:TEXT2,whiteSpace:'pre-wrap',lineHeight:1.5}},t.notes.trim())))),
      withNotes.length===0&&h('div',{style:{fontSize:12,color:TEXT3,fontStyle:'italic',textAlign:'center',padding:'14px 0'}},'No notes today'),
      h('div',{style:{display:'flex',gap:8,marginTop:16}},
        h('button',{onClick:onClose,style:{flex:1,padding:12,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:12,color:TEXT2,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F}},'Cancel'),
        h('button',{onClick:onConfirm,style:{flex:1,padding:12,background:TEXT1,border:'none',borderRadius:12,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F}},'Reset Day'))));
}

// ─── CONFIRM ──────────────────────────────────────────────────────
function Confirm({title,msg,onOk,onNo,okLbl,noLbl,okClr}){
  return h('div',{onClick:onNo,style:{position:'fixed',inset:0,background:'rgba(44,40,37,0.12)',backdropFilter:'blur(6px)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:200,padding:16}},
    h('div',{onClick:e=>e.stopPropagation(),style:{width:'100%',maxWidth:320,background:CARD,borderRadius:20,padding:'22px 20px',boxShadow:`0 -4px 40px rgba(0,0,0,0.1)`}},
      h('h2',{style:{fontSize:16,fontWeight:400,color:TEXT1,margin:'0 0 10px',fontFamily:SERIF,fontStyle:'italic'}},title),
      h('p',{style:{fontSize:13,color:TEXT2,lineHeight:1.6,margin:'0 0 18px',whiteSpace:'pre-line'}},msg),
      h('div',{style:{display:'flex',gap:8}},
        h('button',{onClick:onNo,style:{flex:1,padding:12,background:BG,border:`1.5px solid ${BORDER}`,borderRadius:12,color:TEXT2,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F}},noLbl||'Cancel'),
        h('button',{onClick:onOk,style:{flex:1,padding:12,background:okClr||TEXT1,border:'none',borderRadius:12,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F}},okLbl))));
}

// ─── BOOT ─────────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(h(App));
