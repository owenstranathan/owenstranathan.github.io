var params = new URLSearchParams(window.location.search);
if(params.has("category")){
	var category = params.get("category");
	var element = document.getElementById(category);
	element.style.display = "block";
} else {
	var element = document.getElementById("all");
	element.style.display = "block";
}

