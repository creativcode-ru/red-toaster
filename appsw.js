console.log("Привет, это Service Worker v01");


//Работа в офлайн *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
var CACHE_NAME = 'red-toaster-cache';
// Файлы, необходимые для работы приложения в автономном режиме
//
var REQUIRED_FILES = [
    './',
    'index.html',
    'app.js',
    'favicon-32x32.png',
    'manifest.webmanifest',
    'icon-192x192.png',
    'icon-512x512.png',
];

// Шаг установки: загрузите каждый необходимый файл в кеш
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('[install] Добавление файлов в кеш');
                return cache.addAll(REQUIRED_FILES);
            })
            .then(function () {
                console.log('[install] Необходимые ресурсы закешированы');
                return self.skipWaiting(); //==> сразу переходим к активации сервис воркера
            })
    );
});


self.addEventListener("activate", event => {
    console.log("Service worker activated, можно работать автономно!");  // Если воркер в состоянии "activated", можно работать автономно!
});

//обрабатываем запросы пользователя
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Получен запрос - вернуть из кеша
                if (response) {
                    console.log('[fetch] возвращено из кеша сервис-воркера: ',
                        event.request.url);
                    return response;
                }

                //Если нет в кеше, получить с сервера
                console.log('[fetch] Получено с сервера: ', event.request.url);
                return fetch(event.request);
            }
            )
    );
});