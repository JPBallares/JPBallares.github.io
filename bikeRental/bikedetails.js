var modal_1 = document.getElementById('modal-1');
var modal_2 = document.getElementById('modal-2');
var modal_3 = document.getElementById('modal-3');
var modal_4 = document.getElementById('modal-4');
var modal_5 = document.getElementById('modal-5');

var m_btn_1 = document.getElementById('modal-c-1');
var m_btn_2 = document.getElementById('modal-c-2');
var m_btn_3 = document.getElementById('modal-c-3');
var m_btn_4 = document.getElementById('modal-c-4');
var m_btn_5 = document.getElementById('modal-c-5');

m_btn_1.onclick = function() {
	modal_1.style.display = "block";
}
m_btn_2.onclick = function() {
	modal_2.style.display = "block";
}
m_btn_3.onclick = function() {
	modal_3.style.display = "block";
}
m_btn_4.onclick = function() {
	modal_4.style.display = "block";
}
m_btn_5.onclick = function() {
	modal_5.style.display = "block";
}

window.onclick = function(event) {
	if(event.target == modal_1) {
		modal_1.style.display = "none";
	}
	if(event.target == modal_2) {
		modal_2.style.display = "none";
	}
	if(event.target == modal_3) {
		modal_3.style.display = "none";
	}
	if(event.target == modal_4) {
		modal_4.style.display = "none";
	}
	if(event.target == modal_5) {
		modal_5.style.display = "none";
	}
}