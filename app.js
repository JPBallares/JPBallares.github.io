if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js').then(
            function (registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                pushNotification();
            },
            function (err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
            
    });
}


window.onload = requestNotification;

function requestNotification() {
    Notification.requestPermission();

}

function pushNotification() {
    Notification.requestPermission(function (result) {
        if (result === 'granted') {
            navigator.serviceWorker.ready.then(function (registration) {
                var data = {
                    msg: "Time out",
                    details: "One of the customer is already out of time"
                }
    
    
                registration.showNotification("Baguio Bike Rental", {
                    body: data.msg + "\n" + data.details,
                    icon: "/images/icons/icon-512x512.png",
                    tag: "TIME-OUT"
                });
            });
        }
    });
}

function rentBike(time, elementID) {
    var element = document.getElementById(elementID);
    element.innerHTML = "You have " + time + " seconds remaining";
    if (time == 0) {
        clearTimeout(timer);
        pushNotification();
    } else {
        time--;
        var timer = setTimeout('rentBike(' + time + ', "' + elementID + '")', 1000);
    }
}