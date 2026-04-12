const CACHE_STATIC  = 'hothothot-static-v1';
const CACHE_DATA    = 'hothothot-data-v1';

const STATIC_FILES = [
  '/',
  '/index.html',
  '/documentation.html',
  '/css/style.css',
  '/css/alert-view.css',
  '/css/history-view.css',
  '/js/models/TemperatureModel.js',
  '/js/models/AuthModel.js',
  '/js/models/HistoryModel.js',
  '/js/models/AlertModel.js',
  '/js/views/DashboardView.js',
  '/js/views/AlertView.js',
  '/js/views/NotificationView.js',
  '/js/views/HistoryView.js',
  '/js/controllers/AuthController.js',
  '/js/controllers/AlertController.js',
  '/js/controllers/WebSocketController.js',
  '/js/app.js',
  '/img/Logo.png',
  '/assets/Fire.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      console.log('[SW] Mise en cache initiale');
      return cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_STATIC && k !== CACHE_DATA)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.hostname === 'api.hothothot.dog') {
    event.respondWith(networkFirstData(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_STATIC);
    cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('Hors ligne — contenu non disponible', { status: 503 });
  }
}

async function networkFirstData(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_DATA);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({
      "HotHotHot": "Api v1.0 (hors ligne)",
      "capteurs": [
        { "type": "Thermique", "Nom": "interieur", "Valeur": "20.0", "Timestamp": Math.floor(Date.now() / 1000) },
        { "type": "Thermique", "Nom": "exterieur", "Valeur": "10.0", "Timestamp": Math.floor(Date.now() / 1000) }
      ]
    }), { headers: { 'Content-Type': 'application/json' } });
  }
}