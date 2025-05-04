// Service Worker untuk Portfolio Ikhwan Alidae
const CACHE_NAME = 'portfolio-cache-v1';

// Aset yang akan disimpan dalam cache
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './js/darkmode.js',
  './js/sw-register.js',
  './offline.html',
  './img/profile.jpg',
  './img/profile-mobile.jpeg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Event Install
self.addEventListener('install', event => {
  console.log('[Service Worker] Install Event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Menyimpan aset aplikasi dalam cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Event Activate
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate Event');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName !== CACHE_NAME;
          }).map(cacheName => {
            console.log('[Service Worker] Menghapus cache lama', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Event Fetch
self.addEventListener('fetch', event => {
  console.log('[Service Worker] Fetch Event untuk', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[Service Worker] Mengembalikan dari cache:', event.request.url);
          return response;
        }
        
        console.log('[Service Worker] Mengambil resource:', event.request.url);
        return fetch(event.request)
          .then(networkResponse => {
            const responseClone = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
              
            return networkResponse;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch gagal:', error);
            if (event.request.headers.get('accept').includes('text/html')) {
              // Path ke offline.html relatif terhadap service-worker.js
              return caches.match('./offline.html');
            }
          });
      })
  );
});

// Event Message
self.addEventListener('message', event => {
  console.log('[Service Worker] Pesan diterima:', event.data);
  
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Event Push
self.addEventListener('push', event => {
  console.log('[Service Worker] Push diterima');
  
  const title = 'Portfolio Update';
  const options = {
    body: 'Portfolio saya memiliki konten baru!',
    icon: './img/notification-icon.png',
    badge: './img/badge-icon.png'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Event Notificationclick
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Klik notifikasi diterima');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('./')
  );
});