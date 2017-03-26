var API_URL = "https://my-cookery-api.herokuapp.com/"

var express = require('express'); // Adding the express library 
var mustacheExpress = require('mustache-express'); // Adding mustache templating system and connecting it to 
var request = require('request')  // Adding the request library (to make HTTP reqeusts from the server)
var tools = require('./tools.js'); // Custom module providing additional functionality to the server
var bodyParser = require('body-parser');

var app = express(); // initializing applicaiton
app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// For each request to this server, run the function "logger" in tools.js 
app.use(tools.logger);
app.use(bodyParser.urlencoded({ extended: false }));

// Set up /static path to host css/js/image files directly
app.use('/static', express.static(__dirname + '/static'));


app.get('/', function (req, res, next) {
  res.render('index.html', { });
});

app.get('/kitchen', function (req, res, next) {
  var name = req.query.username;
  if (typeof name != 'undefined') {
    var foodCheckmarkList = "";
    var foodUrl = API_URL + "getFood?username=" + name;
    request(foodUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jsonObject = JSON.parse(body);
	    var foods = jsonObject.foods.split(',');
	    console.log(foods);
	    for(var i = 0; i < foods.length; i++) {
	  	  if (foods[i].length != 0) {
	  	    var date = new Date();
		    var id = "" + i;
	  	    foodCheckmarkList += "<li id=\"li_" + id + "\" class=\"unchecked\"><span id=\"sp_" + id + "\">" + foods[i] + "<\/span><\/li>"   	
	  	  }
	    }
      }
      console.log(foodCheckmarkList);
      if (foodCheckmarkList == "") {
        res.render('kitchen.html', { username: name});
  	  } else {
  		res.render('kitchen.html', { username: name, foodList: foodCheckmarkList});
  	  }
    });
  } else {
    res.render('index.html');
  }
});

app.get('/about', function (req, res, next) {
  res.render('about.html');
});

app.post('/kitchen', function (req, res, next) {
  name = req.body.username;
  var foodCheckmarkList = "";
  var foodUrl = API_URL + "getFood?username=" + name;
  request(foodUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonObject = JSON.parse(body);
	  var foods = jsonObject.foods.split(',');
	  console.log(foods);
	  for(var i = 0; i < foods.length; i++) {
	  	if (foods[i].length != 0) {
	  	  var date = new Date();
		  var id = "" + i;
	  	  foodCheckmarkList += "<li id=\"li_" + id + "\" class=\"unchecked\"><span id=\"sp_" + id + "\">" + foods[i] + "<\/span><\/li>"   	
	  	}
	  }
    }
    console.log(foodCheckmarkList);
    if (foodCheckmarkList == "") {
    	res.render('kitchen.html', { username: name});
  	} else {
  		res.render('kitchen.html', { username: name, foodList: foodCheckmarkList});
  	}
    
  });
});

app.get('/recipe', function (req, res, next) {
  name = req.query.username;
  foods = req.query.foods;
  var recipeUrl = API_URL + 'getRecipes?food=' + foods;
  var recipeList = '';
  request(recipeUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var ans = JSON.parse(body);
      var count = ans.count;
      var recipes = ans.recipes;
      for(var i = 0; i < count; i++) {
      	if (typeof recipes[i].source_url != 'undefined' && typeof recipes[i].title != 'undefined') {
	      recipeList += '<a href=\"' + recipes[i].source_url + '\" target=\"_blank\">' + recipes[i].title + '</a><br>'
	      if (typeof recipes[i].image_url != 'undefined' && recipes[i].image_url != '') {
	        recipeList += '<img src=\"' + recipes[i].image_url + '\""><br>'
	      }
	    }
      }
    }
    if (recipeList == '') {
    	res.render('recipe.html', { username: name });
    } else {
    	res.render('recipe.html', { username: name, recipes: recipeList });
    }
  });
});



var port = process.env.PORT || 8080;
// Start up server on port 3000 on host localhost
var server = app.listen(port, function () {
  var port = server.address().port;

  console.log('server on localhost listening on port ' + port + '!');
});
