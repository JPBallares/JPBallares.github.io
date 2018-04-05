if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(
            function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope); },
            function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

window.onload = requestNotification;

function requestNotification(){
    Notification.requestPermission();

}

function pushNotification(){
    var data = {
        msg: "Hello World",
        details: "Welcome to the website"
    }

    var e = new Notification("TEST", {
        body : data.msg + "\n" + data.details,
        icon : "/images/icon-512x512.png",
        tag : "TIME-OUT"
    });

    e.onclick = function () {
        location.href = "https://jpballares.github.io/";
    }
}