const CACHE_NAME = 'wbgt-checker-cache-v6'; // Versão do cache atualizada
const urlsToCache = [
  '/WBGT-JIDOU/',
  '/WBGT-JIDOU/index.html',
  '/WBGT-JIDOU/style.css',
  '/WBGT-JIDOU/script.js',
  '/WBGT-JIDOU/manifest.json',
  '/WBGT-JIDOU/wbgt_table_preciso.json',
  '/WBGT-JIDOU/icons/web-app-manifest-192x192.png',
  '/WBGT-JIDOU/icons/web-app-manifest-512x512.png',
  '/WBGT-JIDOU/icons/apple-touch-icon.png',
  '/WBGT-JIDOU/icons/favicon.ico',
  '/WBGT-JIDOU/icons/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache during install:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(error => {
        console.error('Fetch failed:', error);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
