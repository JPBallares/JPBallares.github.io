self.addEventListener('notificationclick', function (e) {
    console.log('On notification click: ', e.notification.tag);
    e.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    e.waitUntil(clients.matchAll({
        type: "window",
        includeUncontrolled: true
    }).then(function (clientList) {

        let matchingClient = null;

        for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url === '/bikeRental/') {
                matchingClient = client;
                break;
            }
        }
        if (matchingClient) {
            return matchingClient.focus();
        } else {
            return clients.openWindow('/bikeRental/');
        }
    }));
});