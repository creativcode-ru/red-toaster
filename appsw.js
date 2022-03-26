console.log("Привет, это Service Worker v0-49");


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
    console.log("Service worker activated!");  // Если воркер в состоянии "activated", можно работать автономно!
    /* Вызывает событие "controllerchange" на navigator.serviceWorker всех клиентских страниц, 
     * контролируемых сервис-воркером.
     */
    event.waitUntil(self.clients.claim()); //уведомление от сервис-воркера -- иначе не отображается иконка в диалоге браузера при установке приложени
    /* Метод claim() позволяет установить контроль над страницами немедленно.
     * Имейте в виду, что в этом случае ваш сервис-воркер будет контролировать
     * все загружаемые по сети страницы этого origin, в т. ч. из других сервис-воркеров.
     */
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