var API_URL = "https://my-cookery-api.herokuapp.com/"
var APP_URl = "https://my-cookery.herokuapp.com/"

function GoToKitchen() {
	var username = document.getElementById("username").value;
	if (username === "") {
		alert("Please give us your username!");
		return false;
	}
	localStorage.setItem('username', username)
	return true;
}

function ingredientClicked() {
	var clickedId = this.id.replace("sp_", "");
	var clickedLi = document.getElementById("li_" + clickedId);

	if (clickedLi.classList.contains("checked")) {
		clickedLi.classList.add("unchecked");
		clickedLi.classList.remove("checked");
	} else {
		clickedLi.classList.add("checked");
		clickedLi.classList.remove("unchecked");
	}
}

function httpGetAsync(theUrl, callback) {
	console.log("sending httpGetAsync");
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send();
}

function addNewIngredient(list, item) {
	// add to database
	var username = localStorage.getItem('username');
	var foodname = item;
    var addUrl = API_URL + "addFood?username=" + username + "&food=" + foodname;
    httpGetAsync(addUrl, function(res) {
    	console.log(res);
    });
    // add to front end
    var date = new Date();
	var id = "" + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
	var listIngredient = document.createElement("li");
	var spanElem = document.createElement("span");
	spanElem.innerText = item;
	spanElem.id = "sp_" + id;
	spanElem.onclick = ingredientClicked;
	listIngredient.className = 'unchecked';
	listIngredient.id = "li_" + id;
	listIngredient.appendChild(spanElem);
	list.appendChild(listIngredient);
}
var textbox = document.getElementById("newIngredient");
if (textbox) {
	textbox.focus();
	textbox.onkeyup = function(event) {
		// 13 -> ENTER key
		maybeAddNewIngredient(event);
	};
}

function addButtonClick() {
	maybeAddNewIngredient(null);
}

function maybeAddNewIngredient(event) {
	if (!event || event && event.which == 13) {
		var newIngredient = document.getElementById("newIngredient");
		var item = newIngredient.value;
		console.log("item is: " + item + "|");

		if (!item || item == "" || item == " ") {
			return false;
		}
		addNewIngredient(document.getElementById("myIngredients"), item);
		// newIngredient.value = "";
		newIngredient.focus();
		newIngredient.select();
	}
}

function removeFoods() {
	var list = document.getElementById("myIngredients");
	var children = list.children;
	var removeChildIndices = [];
	for (var i = 0; i < children.length; i++) {
	    var child = children[i];
	    if (child.classList.contains("checked")) {
	    	// remove from the front end
	    	removeChildIndices.push(i);
	    	// remove in database
	    	var username = localStorage.getItem('username');
	    	var foodname = child.childNodes[0].innerText;
	        var removeUrl = API_URL + "removeFood?username=" + username + "&food=" + foodname;
	    	httpGetAsync(removeUrl, function(res) {
		    	console.log(res);
		    });
	    }
	}
	console.log(removeChildIndices);
	for (var i = removeChildIndices.length - 1; i >= 0; i--) {
		var index = removeChildIndices[i];
		list.removeChild(list.childNodes[index]);
	}
}

function setOnClick() {
	var list = document.getElementById("myIngredients");
	var children = list.children;
	
	for (var i = 0; i < children.length; i++) {
	    var child = children[i];
	    var span = child.childNodes[0];
	    span.onclick = ingredientClicked;
	}
}

setOnClick();

function getRecipes() {
	var username = localStorage.getItem('username');

	var list = document.getElementById("myIngredients");
	var children = list.children;
	var foods = "";
	for (var i = 0; i < children.length; i++) {
	    var child = children[i];
	    if (child.classList.contains("checked")) {
	    	var foodname = child.childNodes[0].innerText;
	    	foods = foods + foodname + ",";
	    }
	}
	console.log(foods);

	var url= APP_URl + "recipe?username=" + username + "&foods=" + foods
	window.location = url;
}

function backToKitchen() {
	var username = localStorage.getItem('username');

	var url= APP_URl + "kitchen?username=" + username
	window.location = url;
}