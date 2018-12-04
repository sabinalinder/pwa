// Set to true in production
var doCache = false;

var CACHE_NAME = 'pwa-app-cache';

// Delete old cache
self.addEventListener('activate', event => {
    const currentCachelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(keyList =>
                Promise.all(keyList.map(key => {
                    if (!currentCachelist.includes(key)) {
                        return caches.delete(key);
                    }
                }))
            )
    );
});

// Triggers when user starts the app
self.addEventListener('install', function(event) {
    if (doCache) {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function(cache) {
                    fetch('asset-manifest.json')
                        .then(response => {
                            response.json();
                        })
                        .then(assets => {
                            // Cache initial page and main.js
                            // Images, css etc can also be cached here
                            const urlsToCache = [
                                '/',
                                assets['main.js']
                            ];
                            cache.addAll(urlsToCache);
                        })
                })
        );
    }
});

// Intercept request and serve matching files
self.addEventListener('fetch', function(event) {
    if(doCache) {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );
    }
});