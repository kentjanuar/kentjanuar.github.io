self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  self.skipWaiting(); // Force update on new version
  event.waitUntil(
    caches.open('static')
      .then(function(cache) {
        console.log('[Service Worker] Precaching App Shell');
        return cache.addAll([  
          '/',
          '/index.html',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/js/promise.js',
          '/src/js/fetch.js',
          '/src/js/material.min.js',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/images/main-image.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
          '/offline.html', 
          '/src/css/offline.css'
        ]);
      })
  );
});


self.addEventListener("fetch", (event) => {
  event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
              return cachedResponse; // Serve from cache first
          }

          return fetch(event.request).catch(() => {
              // If request is for a navigation (HTML page), return the offline fallback
              if (event.request.mode === "navigate") {
                  return caches.match("/offline.html"); 
              }
          });
      })
  );
});



// self.addEventListener('activate', function(event) {
//   console.log('[Service Worker] Activating Service Worker ....', event);
//   return self.clients.claim();
// });



  // self.addEventListener('fetch', function(event) {
  //   event.respondWith(
  //     caches.open(CACHE_DYNAMIC_NAME)
  //       .then(function(cache) {
  //         return fetch(event.request)
  //           .then(function(res) {
  //             cache.put(event.request, res.clone());
  //             return res;
  //           });
  //       })
  //   );
  // });
  
  