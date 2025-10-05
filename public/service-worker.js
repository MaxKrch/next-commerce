const VERSION = 'v1';
const CACHE_NAME = `Lalasia-${VERSION}`;

const STATIC_FILES = [
    '/',
    '/offline.html',
    '/offline.css',    
    '/favicon.ico',
    '/network-error.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_FILES))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

async function cacheFirstAndUpdate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    
    } catch {
        return caches.match('/offline.html');
    }
}

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(error => {
                if (error instanceof TypeError && !navigator.onLine) {
                    return caches.match('/offline.html');
                }
                throw error;
            })
        );
        return;
    }

    if (request.url.match(/\.(js|css|woff2?|svg|png|jpg|jpeg|ico)$/)) {
        event.respondWith(cacheFirstAndUpdate(request));
        return;
    }

    if (request.url.includes('/_next/static/')) {
        event.respondWith(cacheFirstAndUpdate(request));
        return;
    }
});