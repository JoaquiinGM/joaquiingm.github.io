/* Asignar nombre y version de Caché */
const CACHE_NAME = 'v1_cache_archisoft_pwa';

/* Ficheros a cacheat en la aplicacion*/
var urlsToCache=[
    './',
    './main.js',
    './index.html',
    './css/styles.css',
    'img/favicon.png',
    'img/favicon-1024.png',
    'img/favicon-512.png',
    'img/favicon-384.png',
    'img/favicon-256.png',
    'img/favicon-192.png',
    'img/favicon-128.png',
    'img/favicon-96.png',
    'img/favicon-64.png',
    'img/favicon-32.png',
    'img/favicon-16.png',
    'img/facebook.png',
    'img/twitter.png',
    'img/instagram.png',
    'img/1.png',
    'img/2.png',
    'img/3.png',
    'img/4.png',
    'img/5.png',
    'img/6.png'
];

/* Evento Install */
/* Instalacion del service worker y guardar en cache los recursos estaticos*/
self.addEventListener('install', e=>{
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache =>{
            return cache.addAll(urlsToCache)
            .then(()=>{
                self.skipWaiting();
            })

        })
        .catch(err =>{
            console.log('No se registro el cache', err);
        })
    );    
});

/* Evento Activate */
/* Que la app funcione sin conexion */
self.addEventListener('activate', e=>{
    const cacheWhitelist=[CACHE_NAME];

    e.waitUntil(
        caches.keys()
        .then(cacheNames =>{
            return Promise.all(
                cacheNames.map(cacheName =>{
                    if(cacheWhitelist.indexOf(cacheName) === -1){
                        /* Borrar elementos que no se necesitan */
                        return cache.delete(cacheName);
                    }
                })
            )
        })
        .then(()=>{
            /* Activa cache en dispositivo */
            self.clients.claim();
        })
    );
});

/* Evento Fetch */
/* self.addEventListener('fetch', e =>{
    e.respondWith(
        caches.match(e.request)
        .then(res=>{
            if(res){
                /* Devuelvo datos desde cache 
                return res;
            }
            return fetch(e.request);

        })
    );
}); */

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          // IMPORTANT: Clone the request. A request is a stream and
          // can only be consumed once. Since we are consuming this
          // once by cache and once by the browser for fetch, we need
          // to clone the response.
          var fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });