var express = require('express')
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('foods.db');

/* Add food to username in db */
app.get('/addFood', function(req, res){
	var username = req.query.username;
	var food = req.query.food;
	
	db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='food'", function(error, row) {
		if (row !== undefined) {
			console.log("table exists. cleaning existing records");
			db.run("INSERT OR REPLACE INTO food (username, food) " + "VALUES (?, ?)",username, food);
		}
		else {
			console.log("creating table");
			db.run("CREATE TABLE food (username TEXT, food TEXT, PRIMARY KEY (username, food) )", function() {
				db.run("INSERT OR REPLACE INTO foods (username, food) " + "VALUES (?, ?)",username, food);
			});
		}
	});
});

/* Remove food from username in db */
app.get('/removeFood', function(req, res){
	var username = req.query.username;
	var food = req.query.food;
	
	db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='food'", function(error, row) {
		if (row !== undefined) {
			console.log("table exists. cleaning existing records");
			db.run("DELETE FROM food WHERE username=(?) AND food=(?)",username, food);
		}
		else {
			console.log("creating table");
			db.run("CREATE TABLE food (username TEXT, food TEXT, PRIMARY KEY (username, food) )", function() {
				db.run("INSERT OR REPLACE INTO food (username, food) " + "VALUES (?, ?)",username, food);
			});
		}
	});
});

/* Get all food owned by username from db */
app.get('/getFood', function(req, res){
	var username = req.query.username;
	
	var foods = "";
	var query = "SELECT * FROM food WHERE username=\'" + username + "\'";
	/*console.log(query);
	db.each(query, function(err, row) {
		values.push({"username": row.username, "food": row.food});
		foods = foods + row.food + ",";
		}, function() {
		var result = {"data" : values};
		result = {"username" : username, "foods" : foods};
		res.json(result);
	});*/
	
	db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='food'", function(error, row) {
		if (row !== undefined) {
			db.each(query, function(err, row) {
				foods = foods + row.food + ",";
				}, function() {
				var result = {"username" : username, "foods" : foods};
				res.json(result);
			});
		}
		else {
			db.run("CREATE TABLE food (username TEXT, food TEXT, PRIMARY KEY (username, food) )", function() {
					db.each(query, function(err, row) {
						foods = foods + row.food + ",";
						}, function() {
						var result = {"username" : username, "foods" : foods};
						res.json(result);
					});
			});
		}
	});
});

/* Add food to username in db */
app.get('/getRecipes', function(req, res){
	var username = req.query.username;
	//var sampleUrl = "http://food2fork.com/api/search?key=61201e608a47665ae57fe1b61fb7777a&q=shredded%20chicken,pork";
	var sampleUrl = "http://food2fork.com/api/search?key=61201e608a47665ae57fe1b61fb7777a&q=";
	
	var foodUrl = 'http://localhost:3001/getFood?username=' + username;
	request(foodUrl, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
		var jsonObject = JSON.parse(body);
		request(sampleUrl+jsonObject.foods, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
			res.json(body);
		    }
		});
	    }
	});
});

var server = app.listen(3001, function() {
	console.log('Server on localhost listening on port 3001');
});
