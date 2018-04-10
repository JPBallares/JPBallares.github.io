var request = indexedDB.open('BikeManager', 1);
    
request.onupgradeneeded = function (e) {
    var db = e.target.result;
    if (!db.objectStoreNames.contains('customers')) {
        var os = db.createObjectStore('customers', {keyPath: 'id', autoIncrement: true});
        os.createIndex('name', 'name', { unique: false });
        os.createIndex('aok', 'aok', { unique: false });
        os.createIndex('minutes', 'minutes', { unique: false });
		os.createIndex('tob', 'tob', {unique: false});
    }
};

request.onsuccess = function (e) {
    console.log("Successfully opened");
    db = e.target.result;
};

request.onerror = function (e) {
    console.log("Error, Database was not opened", e.target.error.name);
};

var addButton = document.getElementById('add-c');
var delButton = document.getElementById('delBu');
var listOfRents = document.querySelector('ul');
var modal = document.getElementById('modal-0');
var btn = document.getElementById('pluBu');
var span = document.getElementsByClassName("close")[0];

addButton.onclick = function() {
	var name = document.getElementById('name').value;
	var aok = document.getElementById('aok').value;
	var minutes = document.getElementById('minutes').value;
	var tob = document.getElementById('tob').value;
	
	var transaction = db.transaction(["customers"], "readwrite");
	var store = transaction.objectStore("customers");
	var customer = {
		name: name,
		aok: aok,
		minutes: minutes,
		tob: tob
	};

	request = store.add(customer);

	request.onsuccess = function (e) {
		alert('Successfully added');
		console.log('Successfully added');
	};

	request.onerror = function (e) {
		alert('Data was not added', e.target.error.name);
		console.log('Data was not added', e.target.error.name);
	};

	var newCon = document.createElement('li');
	
	newCon.innerHTML = 
		 '<div class="information">'
		+'<div class="delete">'
		+'<button name="del" id="delBu"></button>'
		+'<div class="rent-info">'
		+'<div class="rent-info-left">'
		+'<p class="client-info">Name: '+name+'</p>'
		+'<p class="client-info">Type: '+aok+'</p>'
		+'<p class="client-info">Bike: '+tob+'</p>'
		+'</div>'
		+'<div class="rent-info-right">'
		+'<div class="time">'+minutes+'</div>'
		+'</div>'
		+'</div>'
		+'</div>'
		+'</div>';

	listOfRents.appendChild(newCon);

	delButton = newCon.querySelector('[name=del]');
	delButton.onclick = function(e) {
		e.target.closest('li').remove()
	}

	modal.style.display = "none";
}

btn.onclick = function() {
	modal.style.display = "block";
}

span.onclick = function() {
	modal.style.display = "none";
}

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}


