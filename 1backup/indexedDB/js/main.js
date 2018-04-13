
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
            function (registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            },
            function (err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
            
    });
}

timer = null;
window.onload = rentBike();
var request = indexedDB.open('BikeManager', 1);
//create or open database
request.onupgradeneeded = function (e) {
    var db = e.target.result;
    if (!db.objectStoreNames.contains('customers')) {
        var os = db.createObjectStore('customers', {
            keyPath: 'id',
            autoIncrement: true
        });
        os.createIndex('name', 'name', {
            unique: false
        });
        os.createIndex('type', 'type', {
            unique: false
        });
        os.createIndex('time', 'time', {
            unique: false
        });
        os.createIndex('date', 'date', {
            unique: false
        });
    }
};

//success on opening database
request.onsuccess = function (e) {
    console.log("Successfully opened");
    db = e.target.result;
    showCustomers(e);
};

//error on opening database
request.onerror = function (e) {
    console.log("Error, Database was not opened", e.target.error.name);
};

//adding data from html to database
function addCustomer() {
    var name = document.getElementById('name').value;
    var aok = document.getElementById('aok').value;
    var time = new Date(document.getElementById('time').value*60000 + Date.now());
    var date = new Date();

    var transaction = db.transaction(["customers"], "readwrite");

    var store = transaction.objectStore("customers");

    var customer = {
        name: name,
        aok: aok,
        time: time,
        date: date
    };

    request = store.add(customer);

    request.onsuccess = function (e) {
        alert('Successfully added');
        console.log('Successfully added');
        window.location.href = 'index.html';
    };

    request.onerror = function (e) {
        console.log('Data was not added', e.target.error.name);
    };
}

//show all the customers from database
function showCustomers(e) {
    var transaction = db.transaction(["customers"], "readonly");

    var store = transaction.objectStore("customers");
    var index = store.index('name');

    var output = '';
    index.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
            output += "<tr id='customer_" + cursor.value.id + "'>";
            output += "<td>" + cursor.value.id + "</td>";
            output += "<td>" + cursor.value.name + "</td>";
            output += "<td>" + cursor.value.aok + "</td>";
            if (cursor.value.time > 0){
                output += "<td>" + Math.floor((cursor.value.time.getTime() - Date.now())/60000) + ":" + Math.floor(((cursor.value.time.getTime() - Date.now())%60000)/1000) + "</td>";
            } else {
                output += "<td>" + cursor.value.time + "</td>";
            }
            
            output += "<td>" + cursor.value.date.toLocaleDateString() + '/' + cursor.value.date.toLocaleTimeString() + "</td>";
            output += "<td><a onclick = 'removeCustomer(" + (cursor.value.id) + ")' href=''>Delete</a></td>";
            output += "</tr>";
            cursor.continue();
        }

        if (document.getElementById("customers")) {
            document.getElementById("customers").innerHTML = output;
        }

    };
}

//clear all content of database
function clearCustomers() {
    var request = indexedDB.deleteDatabase("BikeManager");
    window.location.href = "index.html";
    request.onsuccess = function (e) {
        console.log("Database was cleared");
    }
    request.onerror = function (e) {
        console.log("Failed to clear the database");
    }
}

//remove a customer from database
function removeCustomer(id) {
    var transaction = db.transaction(["customers"], "readwrite");
    var store = transaction.objectStore("customers");

    var request = store.delete(id);

    request.onsuccess = function (e) {
        console.log("Deleted " + id);
        document.getElementById("customer_" + id).remove();
    }

    request.onerror = function (e) {
        console.log("Failed to delete " + id);
    }

}

function countDownTimer(e) {
    var transaction = db.transaction(["customers"], "readwrite");
    var store = transaction.objectStore("customers");

    store.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
            var updateData = cursor.value;
            if (updateData.time > 0){
                if ((updateData.time.getTime()) <= Date.now()) {
                    updateData.time = "Not yet returned";
                    pushNotification(updateData.name);
                    var request = cursor.update(updateData);
                    request.onsuccess = function () {
                        console.log('Success!');
                    };
                } 
            }
            
            cursor.continue();

        }

        showCustomers();

    };
}

function rentBike() {
    
    if (!timer){
        timer = setInterval('countDownTimer()', 1000);
    }
    
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