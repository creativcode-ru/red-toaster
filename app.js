window.addEventListener("DOMContentLoaded", event => {
    document.querySelector("#btnTest").addEventListener("click", testOrientation);
    document.querySelector("#lockPortrait").addEventListener("click", lockPortrait);
    document.querySelector("#unlockScreen").addEventListener("click", unlockScreen);

    screen.orientation.addEventListener('change', function () {
        showMsg('Текущая ориентация изменилось: ' + screen.orientation.type);
    });

    document.querySelector("#btnDisplayMode").addEventListener("click", getPWADisplayMode);

});






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


//ориетнтация экрана  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

function testOrientation() {
    console.log("#btnTest * click");

    let orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
    console.log("[orientation]:" + orientation);

    let msg = "";
    if (orientation === "landscape-primary") {
        msg = "горизонтально";
    } else if (orientation === "landscape-secondary") {
        msg = "гортзонтальное вверх ногами! Нижняя часть устройства слева";
    } else if (orientation === "portrait-primary") {
        msg = "вертикально";
    } else if (orientation === "portrait-secondary") {
        msg = "вертикально вверх ногами!";
    } else if (orientation === undefined) {
        msg = "* * * браузер не поддерживает ориентацию экрана :(";
    }


    let current_mode = screen.orientation;

    let screenHeight = window.screen.height;
    let screenWidth = window.screen.width;
    let availHeight = window.screen.availHeight; //доступная высота экрана
    let availWidth = window.screen.availWidth;

    let colorDepth = window.screen.colorDepth;
    let pixleDepth = window.screen.pixelDepth

    msg = "[orientation]:" + orientation + " - " + msg
        + ";<br /> type=" + current_mode.type + "; angle=" + current_mode.angle
        + ";<br /> высота=" + screenHeight + " доступно: " + availHeight
        + ";<br /> ширина=" + availWidth + " доступно: " + availWidth
        + ";<br /> разрядность цвета=" + colorDepth + " глубина пикселей: " + pixleDepth
    console.log(msg);
    showMsg(msg);
};


async function lockPortrait() {
    console.log("lockPortrait * click");

    screen.orientation.lock("portrait")
        .then(function () {
            showResult('Экран заблокирован вертикально');
        })
        .catch(function (error) {
            showResult("Ошибка при блокировки экрана: " + error);
        });
}

function unlockScreen() {
    console.log("unlockScreen * click");
    screen.orientation.unlock();
    showResult('Экран разблокирован');
}


function showMsg(text) {
    document.querySelector("var").innerHTML = text;
}


//автономный режим  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
// Отслеживайте, как было запущено PWA https://web.dev/customize-install/#otslezhivajte-kak-bylo-zapusheno-pwa
//Safari на iOS пока не поддерживает функцию matchMedia(), поэтому потребуется проверять свойство navigator.standalone
/*
window
    .matchMedia('(display-mode: standalone)')
    .addEventListener('change', ({ matches }) => {
        let msg = '';
        if (matches) {
            msg = 'display-mode: standalone';
        } else {
            msg = 'display-mode: не автономный';
        }
        showMsg(msg);
    });
*/

function getPWADisplayMode() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    let msg = '';
    if (document.referrer.startsWith('android-app://')) {
        msg = 'twa: android-app display-mode: standalone';
    } else if (navigator.standalone || isStandalone) {
        msg =  'standalone: safari на iOS';
    } else msg = 'browser';

    showMsg('isStandalone: ' + isStandalone + 'document.referrer:' + document.referrer + 'navigator.standalone:' + navigator.standalone);
}

//ИНИЦИАЛИЗАЦИЯ: Прослушивайте событие beforeinstallprompt https://web.dev/customize-install/#proslushivajte-sobytie-beforeinstallprompt  
/* Сохраните ссылку на событие и обновите свой пользовательский интерфейс, 
   чтобы указать, что пользователь может установить ваше PWA.
 */
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); //Предотвратить появление мини-информационной панели на мобильном телефоне
    deferredPrompt = e; // Сохраните событие, чтобы его можно было вызвать позже.
    //showInstallPromotion(); //Показать собственный интерфейс установки PWA
    showMsg('*** Обновите интерфейс уведомление об установке PWA ***');
    console.log(`'beforeinstallprompt' event was fired.`); // При желании отправьте событие аналитики о том, что была показана реклама установки PWA.
});

//УСТАНОВКА
btnInstall.addEventListener('click', async () => {
   
    //hideInstallPromotion(); // Скрыть собственную панель установки
    showMsg('');
    deferredPrompt.prompt(); // Показать приглашение установить == это ранее сохраненное событие
    const {outcome} = await deferredPrompt.userChoice; // Ждем, пока пользователь ответит на приглашение
    console.log(`User response to the install prompt: ${outcome}`); // При желании отправьте событие аналитики с результатом по выбору пользователя
    deferredPrompt = null; // Мы использовали подсказку и не можем использовать ее снова, выбросьте ее
});

//АВТОНОМНЫЙ РЕЖИМ. Определяйте, когда PWA было успешно установлено 
window.addEventListener('appinstalled', () => {
     //hideInstallPromotion(); // Повторно скрыть собственный интерфейс установки PWA. Событие deferredPrompt.userChoice может быть недоступно, если пользовательвыбрал иной способ установки
    deferredPrompt = null; //Очистите deferredPrompt, чтобы он мог быть собран мусором
    console.log('PWA was installed'); //При необходимости отправьте событие аналитики, чтобы указать на успешную установку.
    showMsg('PWA установлен в автономном режиме');
});

//Отслеживайте, когда меняется режим отображения https://web.dev/customize-install/#otslezhivajte-kogda-menyaetsya-rezhim-otobrazheniya
//Чтобы отслеживать, переключается ли пользователь между режимами standalone и browser, прослушивайте изменения в медиа-запросе display-mode.

window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
    let displayMode = 'browser';
    if (evt.matches) {
        displayMode = 'standalone';
    }
    // Log display mode change to analytics
    console.log('DISPLAY_MODE_CHANGED', displayMode);

    showMsg('DISPLAY_MODE_CHANGED: ' + displayMode);
});