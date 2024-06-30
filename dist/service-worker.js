// var CacheName = 'mohschool-v1';
// var CacheFiles = [
//     'index.html',
//     'cw3.webmanifest',
//     'public/images/arabic.jpg',
//     'public/images/arts.jpg',
//     'public/images/chess.jpg',
//     'public/images/cooking.jpg',
//     './public/images/dancing.jpg',
// ];

// self.addEventListener('install', (e) => {
//     console.log('service-worker');
//     e.waituntil(
//         caches.open(CacheName).then((cache) => {
//             console.log('[Service Worker] Caching all the Files');
//             return cache.addAll(CacheFiles);
//         })
//     );
// });

// self.addEventListener('fetch', function (e) {
//     e.respondWith(
//         caches.match(e.request).then(function (r) {
//             //Download the file if is not in the cache,
//             return r || fetch(e.request).then(function (response){
//                 //add the new file to cache
//                 return caches.open(CacheName).then(function (cache) {
//                     cache.put(e.request, response.clone());
//                     return response;
//                 });
//             });
//         })
//     );
// });

// 

var CacheName = 'mohschool-v1';
var CacheFiles = [
    'index.html',
    'cw3.webmanifest',
    'images/arabic.jpg',
    'images/arts.jpg',
    'images/chess.jpg',
    'images/cooking.jpg',
    'images/dancing.jpg',
];

self.addEventListener('install', (e) => {
    console.log('service-worker');
    e.waitUntil(
        caches.open(CacheName).then((cache) => {
            console.log('[Service Worker] Caching all the Files');
            return Promise.all(
                CacheFiles.map((file) => {
                    return cache.add(file).catch((err) => {
                        console.error(`Failed to cache ${file}: ${err}`);
                    });
                })
            );
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            // Download the file if not in the cache
            return r || fetch(e.request).then(function (response) {
                // Add the new file to cache
                return caches.open(CacheName).then(function (cache) {
                    cache.put(e.request, response.clone());
                    return response;
                });
            }).catch(function () {
                // Handle the error, for example, return a fallback page
                return caches.match('offline.html');
            });
        })
    );
});

