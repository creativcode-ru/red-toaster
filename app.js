window.addEventListener("DOMContentLoaded", event => {
    document.querySelector("#btnTest").addEventListener("click", testOrientation);
    document.querySelector("#lockPortrait").addEventListener("click", lockPortrait);
    document.querySelector("#unlockScreen").addEventListener("click", unlockScreen);

    screen.orientation.addEventListener('change', function () {
        showMsg('Текущая ориентация изменилось: ' + screen.orientation.type);
    });



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