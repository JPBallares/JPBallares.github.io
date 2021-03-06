if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('../service-worker.js').then(
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
Notification.requestPermission();
timer = null;
rentBike();

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
		os.createIndex('date', 'date', {
			unique: false
		});
		os.createIndex('amount', 'amount', {
			unique: false
		});
	}
};

request.onsuccess = function (e) {
	console.log("Successfully opened");
	db = e.target.result;
	showCustomer();
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
	var time = new Date((document.getElementById('time').value) * 60000 + Date.now());
	var date = new Date();
	var tob = document.getElementById('tob').value;
    var amount = computeAmount();

	var transaction = db.transaction(["customers"], "readwrite");
	var store = transaction.objectStore("customers");
	var customer = {
		name: name,
		aok: aok,
		time: time,
		date: date,
		tob: tob,
		amount: amount

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

	showCustomer();
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

//showcustomer
function showCustomer(e) {
	var content = '';
	var outputTime;
	var transaction = db.transaction(["customers"], "readonly");

	var store = transaction.objectStore("customers");
	var index = store.index('name');

	index.openCursor().onsuccess = function (e) {
		var cursor = e.target.result;
		if (cursor) {
			if (!(cursor.value.time == 'Returned')) {
				
				if (cursor.value.time > 0) {
					outputTime = Math.floor((cursor.value.time.getTime() - Date.now()) / 60000) + ":" + pad(Math.floor(((cursor.value.time.getTime() - Date.now()) % 60000) / 1000), 2);
				} else {
					outputTime = cursor.value.time;
				}

				content +=
					'<li class="contentent">' +
					'<div class="information">' +
					'<div class="delete">' +
					'<button name="del" id="delBu" onclick="delRem(this,' + cursor.value.id + ')"></button>' +
					'<button name="ret" id="retBu" onclick="returnBike(this,' + cursor.value.id + ')">Return</button>' +
					'<div class="rent-info">' +
					'<div class="rent-info-left">' +
					'<p class="client-info">Name: ' + cursor.value.name + '</p>' +
					'<p class="client-info">Type: ' + cursor.value.aok + '</p>' +
					'<p class="client-info">Bike: ' + cursor.value.tob + '</p>' +
					'<p class="client-info">Date: ' + cursor.value.date.toLocaleDateString() + '/' + cursor.value.date.toLocaleTimeString() + '</p>' +
					'<p class="client-info">Amount: ' + cursor.value.amount + '</p>' +
					'</div>' +
					'<div class="rent-info-right">' +
					'<div class="time">' + outputTime + '</div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</li>';

			}


			cursor.continue();
		}

		if (document.getElementById('custlist')) {
			document.getElementById('custlist').innerHTML = content;
		}

	};



}

function delRem(e, elements) {
	e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode);
	var transaction = db.transaction(["customers"], "readwrite");
	var store = transaction.objectStore("customers");

	var request = store.delete(elements);

	request.onsuccess = function (e) {
		console.log("Deleted customer " + elements);
		alert("Deleted customer " + elements);
	};

	request.onerror = function (e) {
		console.log("Failed to delete customer " + elements);
		alert("Failed to delete customer" + elements);
	};

}

function returnBike(e, elements) {
	var transaction = db.transaction(["customers"], "readwrite");
	var store = transaction.objectStore("customers");

	store.openCursor().onsuccess = function (e) {
		var cursor = e.target.result;
		if (cursor) {
			var updateData = cursor.value;

			if (updateData.id == elements) {
				updateData.time = "Returned";
				var request = cursor.update(updateData);
				request.onsuccess = function (e) {
					console.log("Returned " + elements);
					alert("Bike Returned by customer " + elements);
				}
			}

			cursor.continue();

		}

		showCustomer();


	};
}

//timer and push notification
function countDownTimer(e) {
	var transaction = db.transaction(["customers"], "readwrite");
	var store = transaction.objectStore("customers");

	store.openCursor().onsuccess = function (e) {
		var cursor = e.target.result;
		if (cursor) {
			var updateData = cursor.value;
			if (updateData.time > 0) {
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

		showCustomer();

	};
}



function rentBike() {

	if (!timer) {
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

function pad(num, size) {
	var s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
}


function computeAmount (){
    var price = 0;
    var multiplier = document.getElementById('time').value/60;
    var type = document.getElementById("tob").value;
    if (type == "Safari"){
        price = 100;
    }else if(type == "Chopper" || type == "Quadracycle"){
        price = 150;
    }else if (type == "Grandtoor" ){
        price = 200;
    }else if (type == "BMX" || type == "Trike1"){
        price = 50;
    }else if (type == "Tandem" || type == "Trike2" || type == "Sidecar"){
        price = 80;
    }
    
    if(document.getElementById('aok').value == "Kiddie"){
        price = price * 0.80;
    }
    
    return totalPrice = Math.ceil(price * multiplier);
}

function earningToday() {
	var transaction = db.transaction(["customers"], "readwrite");
	var store = transaction.objectStore("customers");
	var totalIncome = 0;
	store.openCursor().onsuccess = function (e) {
		var cursor = e.target.result;
		if (cursor) {
			var curVal = cursor.value;

			if (curVal.date.toLocaleDateString() == (new Date()).toLocaleDateString()) {
				totalIncome += parseInt(curVal.amount);

			}

			cursor.continue();

		} else {
			alert('Total Income for today : ' + totalIncome);
		}

	};

}

function earningMonth() {
	var transaction = db.transaction(["customers"], "readwrite");
	var store = transaction.objectStore("customers");
	var totalIncome = 0;
	store.openCursor().onsuccess = function (e) {
		var cursor = e.target.result;
		if (cursor) {
			var curVal = cursor.value;
			var today = new Date();
			if (curVal.date.getMonth() == today.getMonth() && curVal.date.getFullYear() == today.getFullYear()) {
				totalIncome += parseInt(curVal.amount);


			}

			cursor.continue();
		} else {
			alert('Total Income for this month : ' + totalIncome);
		}


	};


}
