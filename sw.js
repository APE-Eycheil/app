// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE WORKER — rend l'appli installable ; met en cache uniquement la coquille.
// Les données (Supabase) ne sont jamais mises en cache : hors ligne reporté en phase 4.
// Incrémenter CACHE_VERSION en même temps que les ?v= de index.html.
// ═══════════════════════════════════════════════════════════════════════════════
const CACHE_VERSION = 2;
const CACHE_NAME = 'ape-shell-v' + CACHE_VERSION;
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Réseau d'abord pour les fichiers du site ; cache en secours. Rien d'autre qu'en GET same-origin.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
