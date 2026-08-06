const CACHE_NAME = 'pcba-ciclo-cache-v3';
self.addEventListener('install', (event)=>{
event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.add(self.registration.scope)).catch(()=>{}));
self.skipWaiting();
});
self.addEventListener('activate', (event)=>{
event.waitUntil(
caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
);
self.clients.claim();
});
self.addEventListener('fetch', (event)=>{
if(event.request.method !== 'GET') return;
event.respondWith(
caches.match(event.request).then(cached=>{
if(cached) return cached;
return fetch(event.request).then(resp=>{
const clone = resp.clone();
caches.open(CACHE_NAME).then(cache=>cache.put(event.request, clone)).catch(()=>{});
return resp;
}).catch(()=> caches.match(self.registration.scope));
})
);
});
