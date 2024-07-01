var cacheName = 'mohschool-v1';
var cacheFiles = [];

self.addEventListener("install", (e) => {
    console.log("[ServiceWorker] - Install");
    e.waitUntil(async () => {
      const cache = await caches.open(cacheName);
      console.log("[ServiceWorker] - Caching app files");
      await cache.addAll(cacheFiles);
    });
  });
  
  // The activate handler takes care of cleaning up old caches.
  self.addEventListener("activate", (e) => {
    e.waitUntil(async () => {
      const keyList = await caches.keys();
      await Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            console.log("[ServiceWorker] - Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    });
    e.waitUntil(self.clients.claim());
  });
  
  self.addEventListener("fetch", (event) => { 
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
  
        return caches.open(cacheName).then((cache) => {
          return fetch(event.request).then((response) => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  });

