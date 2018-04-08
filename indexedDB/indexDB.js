//create or open database
var request = indexedDB.open('BikeManager', 1);
    
request.onupgradeneeded = function (e) {
    var db = e.target.result;
    if (!db.objectStoreNames.contains('customers')) {
        var os = db.createObjectStore('customers', {keyPath: 'id', autoIncrement: true});
        os.createIndex('name', 'name', { unique: false });
        os.createIndex('aok', 'aok', { unique: false });
        os.createIndex('minutes', 'minutes', { unique: false });
    }
};

//success on opening database
request.onsuccess = function (e) {
    console.log("Successfully Opened");
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
        console.log('Successfully added');
        window.location.href = 'index.html';
    };
    
    request.onerror = function (e) {
    	alert('Data was not added');
        console.log('Error, data was not added', e.target.error.name);
    };
}

//show customers from database
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
	    output += <"td><a onclick='removeACustomer("+cursor.value.id + ") href = '#'>Delete</a></td>;
            output += "</tr>";
            cursor.continue();
        }
        document.getElementById("customers").innerHTML = output;
    };
}

//delete all customers
function deleteAllCustomers(){
	indexedDB.deleteDatabase('BikeManager');
	window.location.here="index.html";
}

//delete a customer by its id number
function deleteACustomer(id){
    var transaction = db.transaction(["customers"], "readwrite");
    
    var store = transaction.objectStore("customers");
    var reques = store.delete(id);

    request.onsuccess = function(e){
        console.log("Customer deleted");
        document.getElementbyId('customer_'+id).remove();
    }

    request.onerror = function (e) {
       console.log('Error, data was not deleted', e.target.error.name);
    };

}







