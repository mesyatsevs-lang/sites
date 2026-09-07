const KESH = 'krt-radar-v20260904';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(KESH).then(k => k.addAll(['./', './manifest.json'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(
    ks.filter(k => k !== KESH).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || e.request.url.includes('/api/')) return;
  e.respondWith(
    fetch(e.request).then(o => {
      const kopiya = o.clone();
      caches.open(KESH).then(k => k.put(e.request, kopiya));
      return o;
    }).catch(() => caches.match(e.request).then(o => o || caches.match('./')))
  );
});
