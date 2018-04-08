window.onload = function () {
	var addButton = document.getElementById('add-c');
	var delButton = document.getElementById('delBu');
	var listOfRents = document.querySelector('ul');
	var modal = document.getElementById('modal-0');
	var btn = document.getElementById('pluBu');
	var span = document.getElementsByClassName("close")[0];
	
	addButton.onclick = function() {
		var newCon = document.createElement('li');
		
		newCon.innerHTML = 
             '<div class="information">'
            +'<div class="delete">'
            +'<button name="del" id="delBu"></button>'
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
}

