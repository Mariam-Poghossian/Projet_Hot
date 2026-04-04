const CACHE_STATIC  = 'hothothot-static-v1';
const CACHE_DATA    = 'hothothot-data-v1';

// Fichiers à mettre en cache dès le premier accès
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

// Installation — mise en cache des fichiers statiques + documentation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      console.log('[SW] Mise en cache initiale');
      return cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting();
});

// Activation — supprime les anciens caches
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

// Fetch — stratégie selon le type de ressource
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API REST → Network first, fallback cache
  if (url.hostname === 'api.hothothot.dog') {
    event.respondWith(networkFirstData(event.request));
    return;
  }

  // Tout le reste → Cache first, fallback network
  event.respondWith(cacheFirst(event.request));
});

// Cache first : sert depuis le cache, sinon réseau
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

// Network first : réseau en priorité, on sauvegarde la réponse, fallback cache
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