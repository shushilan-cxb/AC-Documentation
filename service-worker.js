// service-worker.js
const CACHE_NAME = 'ac-docs-cache-v1';
const urlsToCache = [
  'https://shushilan-cxb.github.io/AC-Documentation/', // Ensure this is the correct entry point
  'index.html',
  'style.css',
  'script.js',
  'ShushilanLogo.png',
  'Doc-Type.csv',
  'User-Hash.csv',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  'https://cdn.jsdelivr.net/npm/papaparse@5.3.2/papaparse.min.js',
  'https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
  'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js' // Corrected Flatpickr JS path
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.'); // Added for logging
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache, adding URLs...'); // Added for logging
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('All URLs cached. Skipping waiting.'); // Added for logging
        return self.skipWaiting(); // <--- ADD THIS LINE
      })
      .catch(error => {
        console.error('Service Worker installation failed:', error); // Added error logging
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.'); // Added for logging
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName); // Added for logging
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
        console.log('Activating and claiming clients.'); // Added for logging
        return self.clients.claim(); // Ensures SW takes control of existing clients
    })
  );
});
