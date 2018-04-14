var cacheName = 'bikeRental-PWA';

//just uncomment the files that already existing
var filesToCache = [
    '/',
    '/bikeRental/',
    '/bikeRental/images/add.png',
    '/bikeRental/images/delete.png',
    '/bikeRental/images/logo.png',
    '/bikeRental/styles/fonts/JosefinSans-Regular.ttf',
    '/bikeRental/styles/fonts/ProximaNova-Regular.ttf',
    '/bikeRental/styles/index.css',
    '/bikeRental/styles/layout.css',
    '/bikeRental/index.html',
    '/bikeRental/index.js',
    '/css/style.css',
    '/images/placeholder.png',
    '/images/burnham.jpg',
    '/images/logo.png',
    // '/images/iconbike.jpg',
    // '/images/iconsearch.jpg',
    // '/images/love.jpg',
    // '/images/bikkeee.jpg',
    // '/js/index.js',
    // '/js/jquery.min.js',
    '/app.js',
    '/index.html',
    '/manifest.json',
    '/offline.html',
    '/service-worker.js',
	'/images/bike.jpg',
	'/images/bikes/bmx.jpg',
	'/images/bikes/chopper.jpg',
	'/images/bikes/fatbike.jpg',
	'/images/bikes/grandtour.jpg',
	'/images/bikes/mtbike.jpg',
	'/images/bikes/quadracycle.jpg',
	'/images/bikes/safari.jpg',
	'/images/bikes/sidecar.jpg',
	'/images/bikes/tandem.jpg',
	'/images/bikes/trike1seater.jpg',
	'/images/bikes/trike2seater.jpg',
	'bike.html',
	
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        }).catch(function () {
            return caches.match('/offline.html');
        })
    );
});

self.addEventListener('notificationclick', function (e) {
    console.log('On notification click: ', e.notification.tag);
    e.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    e.waitUntil(clients.matchAll({
        type: "window",
        includeUncontrolled: true
    }).then(function (clientList) {

        let matchingClient = null;

        for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url === '/bikeRental/') {
                matchingClient = client;
                break;
            }
        }
        if (matchingClient) {
            return matchingClient.focus();
        } else {
            return clients.openWindow('/bikeRental/');
        }
    }));
});
