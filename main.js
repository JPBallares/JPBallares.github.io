if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
            function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope); },
            function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

window.onload = pushNotification;

function pushNotification(){
    Notification.requestPermission();

    var data = {
        msg: "Hello World",
        details: "Welcome to the website"
    }

    var e = new Notification("TEST", {
        body : data.msg + "\n" + data.details,
        icon : "jpballares.github.io/images/icon-512x512.png",
        tag : "TIME-OUT"
    });

    e.onclick = function () {
        location.href = "https://jpballares.github.io/";
    }
}