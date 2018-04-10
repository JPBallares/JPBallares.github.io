//create or open database
var request = indexedDB.open('BikeManager', 1);

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
        os.createIndex('aok', 'aok', {
            unique: false
        });
        os.createIndex('minutes', 'minutes', {
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
    var minutes = document.getElementById('minutes').value;

    var transaction = db.transaction(["customers"], "readwrite");

    var store = transaction.objectStore("customers");

    var customer = {
        name: name,
        aok: aok,
        minutes: minutes
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
            output += "<td>" + cursor.value.minutes + "</td>";
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
            if (!updateData.minutes) {
                clearInterval(timer);
                pushNotification();
            } else {
                updateData.minutes -= 1;
                var request = cursor.update(updateData);
                request.onsuccess = function () {
                    console.log('Success!');
                };
                cursor.continue();
            }

        }

        showCustomers();

    };
}

function rentBike() {
    timer = setInterval('countDownTimer()', 1000);
}

function pushNotification() {
    var data = {
        msg: "Time out",
        details: "One of the customer is already out of time"
    }

    var e = new Notification("Baguio Bike Rental", {
        body: data.msg + "\n" + data.details,
        icon: "/images/icons/icon-512x512.png",
        tag: "TIME-OUT"
    });

    e.onclick = function () {
        window.focus();
        e.close();
    }
}