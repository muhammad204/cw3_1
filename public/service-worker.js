var CacheName = 'mohschool-v1';
var CacheFiles = [
    'index.html',
    'cw3.webmanifest',
    'public/images/arabic.jpg',
    'public/images/arts.jpg',
    'public/images/chess.jpg',
    'public/images/cooking.jpg',
    './public/images/dancing.jpg',
];

self.addEventListener('install', (e) => {
    console.log('service-worker');
    e.waituntil(
        caches.open(CacheName).then((cache) => {
            console.log('[Service Worker] Caching all the Files');
            return cache.addAll(CacheFiles);
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            //Download the file if is not in the cache,
            return r || fetch(e.request).then(function (response){
                //add the new file to cache
                return caches.open(CacheName).then(function (cache) {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});