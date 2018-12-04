let version = 'v1::';

self.addEventListener('install', function(event) {
    console.log('WORKER: Installing...');
    event.waitUntil(
        caches.open(version + 'fundamentals')
        .then(function(cache) {
            return cache.addAll([
                '/'
                // Add more urls
            ]);
        })
        .then(function() {
            console.log('WORKER: Install completed.')
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('WORKER: Fetching...');
    if (event.request.method !== 'GET') {
        console.log('WORKER: Fetch event ignored. ', event.request.method, event.request.url);
        return;
    }
    event.respondWith(
        cached.match(event.request)
        .then(function(cached) {
            var networked = fetch(event.request)
            .then(fetchedFromNetwork, unableToResolve)
            .catch(unableToResolve)
            console.log('WORKER: Fetch event ', cached ? '(cached)' : '(network)', event.request.url);
            return cached || networked;

            function fetchedFromNetwork(response) {
                var cacheCopy = response.clone();
                console.log('WORKER: Fetch response from network.', event.request.url);

                cached.open(version + 'pages')
                .then(function add(cache) {
                    cache.put(event.request, cacheCopy);
                })
                .then(function() {
                    console.log('fetch response from cache.', event.request.url);
                });
                return response;
            }

            function unableToResolve() {
                console.log('WORKER: Fetch request failed in both cache and network.');

                return new Response('<h1>Service Unavailable</h1>', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/html'
                    })
                });
            }
        })
    )
})

self.addEventListener('activate', function(event) {
    console.log('WORKER: Activating...');

    event.waitUntil(
        caches.keys()
        .then(function(keys) {
            return Promise.all(
                keys.filter(function(key) {
                    return !key.startsWith(version);
                })
                .map(function(key) {
                    return caches.delete(key);
                })
            );
        })
        .then(function() {
            console.log('WORKER: Activate completed.');
        })
    );
})