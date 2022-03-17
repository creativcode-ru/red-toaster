// Регистрируем сервис-воркера *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
if ('serviceWorker' in navigator) {
    // navigator.serviceWorker.register('/sw-test/sw.js', { scope: '/sw-test/' }).then(function (reg) {
    navigator.serviceWorker.register('appsw.js').then(function (reg) { //успешное выполнение промиса
        var msg;
        if (reg.installing) {
            msg = 'Service worker устанавливается';

        } else if (reg.waiting) {
            msg = 'Service worker уже установлен';
        } else if (reg.active) {
            msg = 'Service worker активен';
        }

        console.log(msg);
        showResult(msg);

    }).catch(function (error) {//промис отклонен
        console.log('Регистрация не удалась ' + error);
    });
}

// Отображение сообщения
function showResult(text) {
    document.querySelector("output").innerHTML = text;
}