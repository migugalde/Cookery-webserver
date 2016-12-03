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
	var food = req.query.food;
	
	var values  = [];
	var foods = "";
	var query = "SELECT * FROM food WHERE username=\'" + username + "\'";
	console.log(query);
	db.each(query, function(err, row) {
		values.push({"username": row.username, "food": row.food});
		foods = foods + row.food + ",";
		}, function() {
		var result = {"data" : values};
		result = {"username" : username, "foods" : foods};
		res.json(result);
	});
	
	/*db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='foods'", function(error, row) {
		if (row !== undefined) {
			console.log("table exists. cleaning existing records");
			db.run("INSERT OR REPLACE INTO foods (username, food) " + "VALUES (?, ?)",username, food);
		}
		else {
			console.log("creating table");
			db.run("CREATE TABLE food (username TEXT, food TEXT, PRIMARY KEY (username, food) )", function() {
				db.run("INSERT OR REPLACE INTO foods (username, food) " + "VALUES (?, ?)",username, food);
			});
		}
	});*/
});



/* Create table: should run only once */
app.get('/createTable', function(req, res) {
	db.run("CREATE TABLE links (" +
		"long_url varchar(255)," +
		"short_url varchar(255)," +
		"hit_count int)");

	res.json({});	
})


var server = app.listen(3001, function() {
	console.log('Server on localhost listening on port 3001');
});
