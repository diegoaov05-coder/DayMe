const CACHE='myday-v6';
const ASSETS=['/','/index.html','/app.js','/manifest.json'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});

self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});

self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('/'))))});

// ═══ BACKGROUND NOTIFICATION CHECK ═══
// This runs inside the SW even when the page is not visible
const LK='routine-sync-v6';

function checkNotifications(){
  try{
    const raw=self.indexedDB?null:null; // SW can't access localStorage directly
    // Instead, we rely on messages from the page
  }catch(e){}
}

// Listen for messages from the page with notification data
self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='SCHEDULE_NOTIFS'){
    const notifs=e.data.notifs||[];
    notifs.forEach(n=>{
      const delay=n.fireAt-Date.now();
      if(delay>0&&delay<86400000){
        setTimeout(()=>{
          self.registration.showNotification(n.title,{
            body:n.body,
            tag:n.tag,
            renotify:true,
            vibrate:[200,100,200,100,200],
            requireInteraction:true,
            icon:'/icon-192.png'
          });
        },delay);
      }
    });
  }
  if(e.data&&e.data.type==='CLEAR_NOTIFS'){
    // Clear scheduled (not possible with setTimeout, but prevents duplicates via tag)
  }
});

// Wake up periodically to check (best effort)
self.addEventListener('periodicsync',e=>{
  if(e.tag==='check-notifications'){
    e.waitUntil(self.clients.matchAll().then(clients=>{
      clients.forEach(c=>c.postMessage({type:'CHECK_NOTIFS'}));
    }));
  }
});
