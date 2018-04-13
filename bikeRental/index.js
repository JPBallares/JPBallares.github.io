if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('/sw.js').then(
			function (registration) {
				// Registration was successful
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
				Notification.requestPermission();
			},
			function (err) {
				// registration failed :(
				console.log('ServiceWorker registration failed: ', err);
			});

	});
}

// timer = null;
// window.onload = rentBike();

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
		os.createIndex('time', 'time', {
			unique: false
		});
		os.createIndex('tob', 'tob', {
			unique: false
		});
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

addButton.onclick = function () {
	var name = document.getElementById('name').value;
	var aok = document.getElementById('aok').value;
	var time = new Date((document.getElementById('time').value)*60000 + Date.now());
	var date = new Date();
	var tob = document.getElementById('tob').value;

	var transaction = db.transaction(["customers"], "readwrite");
	var store = transaction.objectStore("customers");
	var customer = {
		name: name,
		aok: aok,
		time: time,
		date: date,
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
	var tobDisplay;
	switch (tob) {
		case 1:
			tobDisplay = "Bike A";
			break;
		case 2:
			tobDisplay = "Bike B";
			break;
		case 3:
			tobDisplay = "Bike C";
			break;
		case 4:
			tobDisplay = "Bike D";
			break;
		case 5:
			tobDisplay = "Bike E";
			break;
	}
	var outputTime;
	if (time > 0){
		outputTime = Math.floor((time.getTime() - Date.now())/60000) + ":" + Math.floor(((time.getTime() - Date.now())%60000)/1000);
	} else {
		outputTime = time;
	}

	newCon.innerHTML =
		'<div class="information">' +
		'<div class="delete">' +
		'<button name="del" id="delBu"></button>' +
		'<div class="rent-info">' +
		'<div class="rent-info-left">' +
		'<p class="client-info">Name: ' + name + '</p>' +
		'<p class="client-info">Type: ' + aok + '</p>' +
		'<p class="client-info">Bike: ' + tob + '</p>' +
		'<p class="client-info">Date: ' + date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + '</p>' +
		'</div>' +
		'<div class="rent-info-right">' +
		'<div class="time">' + outputTime + '</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>';

	listOfRents.appendChild(newCon);

	delButton = newCon.querySelector('[name=del]');
	delButton.onclick = function (e) {
		e.target.closest('li').remove()
	}

	modal.style.display = "none";
}

btn.onclick = function () {
	modal.style.display = "block";
}

span.onclick = function () {
	modal.style.display = "none";
}

window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

//timer and push notification
// function countDownTimer(e) {
//     var transaction = db.transaction(["customers"], "readwrite");
//     var store = transaction.objectStore("customers");

//     store.openCursor().onsuccess = function (e) {
//         var cursor = e.target.result;
//         if (cursor) {
//             var updateData = cursor.value;
//             if (updateData.time > 0){
//                 if ((updateData.time.getTime()) <= Date.now()) {
//                     updateData.time = "Not yet returned";
//                     pushNotification(updateData.name);
//                     var request = cursor.update(updateData);
//                     request.onsuccess = function () {
//                         console.log('Success!');
//                     };
//                 } 
//             }
            
//             cursor.continue();

//         }

//         showCustomers();

//     };
// }

// function rentBike() {
    
//     if (!timer){
//         timer = setInterval('countDownTimer()', 1000);
//     }
    
// }



// function pushNotification() {
//     Notification.requestPermission(function (result) {
//         if (result === 'granted') {
//             navigator.serviceWorker.ready.then(function (registration) {
//                 var data = {
//                     msg: "Time out",
//                     details: "One of the customer is already out of time"
//                 }
    
    
//                 registration.showNotification("Baguio Bike Rental", {
//                     body: data.msg + "\n" + data.details,
//                     icon: "/images/icons/icon-512x512.png",
//                     tag: "TIME-OUT"
//                 });
//             });
//         }
//     });
// }