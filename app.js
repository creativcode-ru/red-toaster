window.addEventListener("DOMContentLoaded", event => {
    document.querySelector("#btnTest").addEventListener("click", testOrientation);
    console.log("#btnTest => click");
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


//ориетнтация экрана ================================================


function testOrientation() {
    console.log("#btnTest * click");

    var orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
    console.log("[orientation]:" + orientation);

    var msg = "";
    if (orientation === "landscape-primary") {
        msg = "горизонтально";
    } else if (orientation === "landscape-secondary") {
        msg = "гортзонтальное вверх ногами!";
    } else if (orientation === "portrait-primary") {
        msg = "вертикально";
    } else if (orientation === "portrait-secondary") {
        msg = "вертикально вверх ногами!";
    } else if (orientation === undefined) {
        msg = "браузер не поддерживает ориентацию экрана :(";
    }

    msg = "[orientation]:" + orientation + " - " + msg;
    console.log(msg);
    showMsg(msg);
};


function showMsg(text) {
    document.querySelector("var").innerHTML = text;
}