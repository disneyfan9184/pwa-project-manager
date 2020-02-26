// Shell resource
const staticCacheName = 'site-static';
const dynamicCacheName = 'site-dynamic';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/css/styles.css',
  '/img/project.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
  'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
];

// Install service worker
self.addEventListener('install', event => {
  // console.log('Service worker has been installed', event);
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// Activate service worker
self.addEventListener('activate', event => {
  // console.log('Service worker has been activated', event);
});

// Fetch event
self.addEventListener('fetch', event => {
  // console.log('fetch event', event);
});
