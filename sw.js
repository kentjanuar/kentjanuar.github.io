const CACHE_NAME = 'pwa-cache-v3';
const DYNAMIC_CACHE = 'pwa-dynamic-cache';
const OFFLINE_PAGE = '/offline.html';

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching assets');
      return cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
        '/css/app.css',
        '/js/index.js',
        '/manifest.json',
        '/about.html',
        '/css/offline.css'
      ]).then(() => {
        console.log('[Service Worker] All assets cached');
      }).catch((error) => {
        console.error('[Service Worker] Failed to cache assets', error);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the network first
    fetch(event.request)
      .then(function(res) {
        // Clone the response before using it
        const resClone = res.clone();
        
        // Cache the successful network response
        caches.open(DYNAMIC_CACHE)
          .then(function(cache) {
            cache.put(event.request, resClone);
          });
        
        return res;
      })
      .catch(function(err) {
        // If network fails, try the cache
        return caches.match(event.request)
          .then(function(response) {
            if (response) {
              return response;
            }
            
            // If not in cache and it's an HTML request, show offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_PAGE);
            }
            
            // For other types of requests that aren't cached
            return new Response('Not found', {
              status: 404, 
              statusText: 'Not found'
            });
          });
      })
  );
});