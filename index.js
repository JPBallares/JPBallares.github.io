window.onload = function () {
	var addButton = document.getElementById("pluBu");
	var delButton = document.getElementById("delBu");
	var listOfRents = document.getElementById("content");
	
	addButton.onclick = function() {
		listOfRents.innerHTML += 
								'<div class="information" id="delete"></div>';
	}
/*
	delButton.onclick = function() {
		var bye = delBu.parentNode.parentNode.id;
		document.getElementById(bye).remove();
		console.log(bye);
	}
*/
}