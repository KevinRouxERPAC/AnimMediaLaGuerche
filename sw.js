/*!
 * ANIM'MÉDIA - SERVICE WORKER
 * Gestion du cache offline et des notifications push
 */

const CACHE_NAME = 'animmedia-cache-v2.0.0';
const OFFLINE_URL = '/offline.html';

// Fichiers critiques à mettre en cache
const CRITICAL_CACHE_FILES = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/admin.css', 
  '/assets/js/main.js',
  '/assets/js/admin.js',
  '/assets/js/animations.js',
  '/manifest.json',
  '/offline.html'
];

// Fichiers statiques à mettre en cache
const STATIC_CACHE_FILES = [
  '/assets/images/logo.png',
  '/assets/images/hero-bg.jpg',
  '/assets/fonts/nunito-v16-latin-regular.woff2',
  '/assets/fonts/nunito-v16-latin-700.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Ressources à mettre en cache à la demande
const RUNTIME_CACHE_PATTERNS = [
  /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
  /^https:\/\/cdnjs\.cloudflare\.com\/.*/,
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\.(?:js|css|woff2|woff|ttf|otf)$/
];

// Stratégies de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first', 
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Configuration des stratégies par type de ressource
const RESOURCE_STRATEGIES = {
  document: CACHE_STRATEGIES.NETWORK_FIRST,
  script: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  style: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  image: CACHE_STRATEGIES.CACHE_FIRST,
  font: CACHE_STRATEGIES.CACHE_FIRST,
  other: CACHE_STRATEGIES.NETWORK_FIRST
};

// ============================================================================
// ÉVÉNEMENTS DU SERVICE WORKER
// ============================================================================

// Installation du service worker
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installation...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Cache des fichiers critiques
        await cache.addAll(CRITICAL_CACHE_FILES);
        console.log('✅ Service Worker: Fichiers critiques mis en cache');
        
        // Cache des fichiers statiques (non bloquant)
        try {
          await cache.addAll(STATIC_CACHE_FILES);
          console.log('✅ Service Worker: Fichiers statiques mis en cache');
        } catch (error) {
          console.warn('⚠️ Service Worker: Erreur cache statique:', error);
        }
        
        // Prendre le contrôle immédiatement
        await self.skipWaiting();
        
      } catch (error) {
        console.error('❌ Service Worker: Erreur installation:', error);
      }
    })()
  );
});

// Activation du service worker
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activation...');
  
  event.waitUntil(
    (async () => {
      try {
        // Nettoyage des anciens caches
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log('🗑️ Service Worker: Suppression cache obsolète:', name);
              return caches.delete(name);
            })
        );
        
        // Prendre le contrôle de tous les clients
        await self.clients.claim();
        
        console.log('✅ Service Worker: Activé et opérationnel');
        
      } catch (error) {
        console.error('❌ Service Worker: Erreur activation:', error);
      }
    })()
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non-HTTP
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  // Ignorer les requêtes POST/PUT/DELETE (sauf GET)
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(handleFetch(event.request));
});

// ============================================================================
// GESTION DES REQUÊTES
// ============================================================================

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Stratégie selon le type de ressource
    const destination = request.destination || getDestinationFromURL(url);
    const strategy = RESOURCE_STRATEGIES[destination] || CACHE_STRATEGIES.NETWORK_FIRST;
    
    switch (strategy) {
      case CACHE_STRATEGIES.CACHE_FIRST:
        return await cacheFirst(request);
        
      case CACHE_STRATEGIES.NETWORK_FIRST:
        return await networkFirst(request);
        
      case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
        return await staleWhileRevalidate(request);
        
      case CACHE_STRATEGIES.CACHE_ONLY:
        return await cacheOnly(request);
        
      case CACHE_STRATEGIES.NETWORK_ONLY:
      default:
        return await fetch(request);
    }
    
  } catch (error) {
    console.warn('⚠️ Service Worker: Erreur fetch:', error);
    return await handleFetchError(request, error);
  }
}

// Stratégie Cache First (idéale pour les ressources statiques)
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Mettre en cache si la réponse est valide
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    // Fallback vers une page d'erreur ou ressource par défaut
    return await getFallbackResponse(request);
  }
}

// Stratégie Network First (idéale pour les documents)
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    
    // Mettre en cache si la réponse est valide
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    // Fallback vers le cache
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback vers une page d'erreur
    return await getFallbackResponse(request);
  }
}

// Stratégie Stale While Revalidate (idéale pour les CSS/JS)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Lancer la mise à jour en arrière-plan
  const networkResponsePromise = fetch(request).then(async response => {
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  // Retourner immédiatement la version cache ou attendre le réseau
  return cachedResponse || await networkResponsePromise;
}

// Stratégie Cache Only
async function cacheOnly(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (!cachedResponse) {
    throw new Error('Ressource non trouvée en cache');
  }
  
  return cachedResponse;
}

// ============================================================================
// GESTION D'ERREURS ET FALLBACKS
// ============================================================================

async function handleFetchError(request, error) {
  console.warn('🔄 Service Worker: Fallback pour:', request.url);
  
  // Tentative de récupération depuis le cache
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fallback selon le type de ressource
  return await getFallbackResponse(request);
}

async function getFallbackResponse(request) {
  const url = new URL(request.url);
  
  // Pour les documents HTML, retourner la page offline
  if (request.destination === 'document' || 
      request.headers.get('Accept')?.includes('text/html')) {
    
    const cache = await caches.open(CACHE_NAME);
    const offlinePage = await cache.match(OFFLINE_URL);
    
    if (offlinePage) {
      return offlinePage;
    }
    
    // Créer une page offline minimale si pas en cache
    return new Response(getOfflineHTML(), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // Pour les images, retourner une image par défaut ou SVG placeholder
  if (request.destination === 'image') {
    return new Response(getPlaceholderSVG(), {
      status: 200,
      statusText: 'OK', 
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
  
  // Pour les autres ressources, retourner une erreur 404
  return new Response('Ressource non disponible hors ligne', {
    status: 404,
    statusText: 'Not Found'
  });
}

// ============================================================================
// UTILITAIRES
// ============================================================================

function getDestinationFromURL(url) {
  const pathname = url.pathname;
  const extension = pathname.split('.').pop().toLowerCase();
  
  if (pathname.endsWith('/') || pathname.endsWith('.html')) {
    return 'document';
  }
  
  if (['js', 'mjs'].includes(extension)) {
    return 'script';
  }
  
  if (['css'].includes(extension)) {
    return 'style';
  }
  
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(extension)) {
    return 'image';
  }
  
  if (['woff', 'woff2', 'ttf', 'otf'].includes(extension)) {
    return 'font';
  }
  
  return 'other';
}

function getOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hors ligne - Anim'Média</title>
      <style>
        body {
          font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #4ecdc4, #ff6b6b);
          color: white;
          text-align: center;
        }
        .offline-container {
          max-width: 500px;
          padding: 2rem;
        }
        .offline-icon {
          font-size: 4rem;
          margin-bottom: 2rem;
          opacity: 0.8;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          line-height: 1.6;
        }
        .retry-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid white;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .retry-btn:hover {
          background: white;
          color: #4ecdc4;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">📡</div>
        <h1>Vous êtes hors ligne</h1>
        <p>Il semble que vous n'ayez pas de connexion internet. Cette page a été sauvegardée pour que vous puissiez continuer à naviguer.</p>
        <button class="retry-btn" onclick="window.location.reload()">
          Réessayer
        </button>
      </div>
    </body>
    </html>
  `;
}

function getPlaceholderSVG() {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#f8fafc"/>
      <circle cx="200" cy="120" r="40" fill="#4ecdc4" opacity="0.3"/>
      <rect x="160" y="180" width="80" height="8" fill="#4ecdc4" opacity="0.3" rx="4"/>
      <rect x="140" y="200" width="120" height="6" fill="#4ecdc4" opacity="0.2" rx="3"/>
      <text x="200" y="250" font-family="Arial" font-size="14" fill="#718096" text-anchor="middle">
        Image non disponible
      </text>
    </svg>
  `;
}

// ============================================================================
// GESTION DES NOTIFICATIONS PUSH
// ============================================================================

self.addEventListener('push', event => {
  console.log('📬 Service Worker: Notification push reçue');
  
  const options = {
    body: 'Nouveau contenu disponible',
    icon: '/assets/images/icons/icon-192x192.png',
    badge: '/assets/images/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir',
        icon: '/assets/images/icons/view-icon.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/assets/images/icons/close-icon.png'
      }
    ]
  };
  
  if (event.data) {
    try {
      const payload = event.data.json();
      options.body = payload.body || options.body;
      options.title = payload.title || 'Anim\'Média';
    } catch (error) {
      console.warn('⚠️ Service Worker: Erreur parsing notification:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('Anim\'Média', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', event => {
  console.log('👆 Service Worker: Notification cliquée');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Ouvrir l'application
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Ne rien faire, juste fermer
    console.log('🔕 Service Worker: Notification fermée');
  } else {
    // Clic par défaut sur la notification
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Si une fenêtre est déjà ouverte, la mettre au premier plan
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Sinon, ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// ============================================================================
// GESTION DE LA SYNCHRONISATION EN ARRIÈRE-PLAN
// ============================================================================

self.addEventListener('sync', event => {
  console.log('🔄 Service Worker: Synchronisation en arrière-plan');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Ici, on pourrait synchroniser des données avec le serveur
      console.log('📡 Service Worker: Synchronisation des données...')
    );
  }
});

// ============================================================================
// ÉVÉNEMENTS DE CYCLE DE VIE
// ============================================================================

self.addEventListener('message', event => {
  console.log('💌 Service Worker: Message reçu:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Gestion des mises à jour
self.addEventListener('updatefound', () => {
  console.log('🆕 Service Worker: Mise à jour disponible');
});

console.log('🎯 Service Worker: Chargé et prêt (version:', CACHE_NAME, ')');