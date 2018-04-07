window.onload = function () {
	var addButton = document.getElementById('pluBu');
	var delButton = document.getElementById('delBu');
	var listOfRents = document.querySelector('ul');
	
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
	}
}