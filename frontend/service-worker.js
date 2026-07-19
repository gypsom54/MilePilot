const CACHE = 'milepilot-v8-44-0';
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request));
    return;
  }
  if (e.request.url.includes('/js/') || e.request.url.includes('trip-auto-end')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
  }
});
