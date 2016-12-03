var express = require('express')
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('foods.db');

/* Get blog from db */
app.get('/check', function(req, res){
			db.each("SELECT * FROM blogs", function(err, row) {
				console.log(row);
			 });
			res.json({});
});

/* Get blog from db */
app.get('/blog', function(req, res){
	var slug = req.query.slug;
	var found = false
	db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='blogs'", function(error, row) {
		if (row !== undefined) {
			db.each("SELECT slug, title, content FROM blogs WHERE slug=\'" + slug + "\'", function(err, row) {
				if(!found) {
					res.json({"slug": row.slug, "title": row.title, "content": row.content});
					found = true;
				}
			 });
		}
		else {
			res.json({});
		}
	});
});

/* Add blog to db */
app.post('/blog', function(req, res){
	var contype = req.headers['content-type'];
	if(!contype || contype.indexOf('application/json') != 0) {
		return {};
	}
	var slug = req.body.slug;
	var title = req.body.title;
	var content = req.body.content;
	console.log("Inserting " + title + " " + JSON.stringify(req.body));
	db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='blogs'", function(error, row) {
		//var slug = "a-mindful-shift-of-focus";
		//var title = "A Mindful Shift of Focus";
		//var content = "<h2> By Leo </h2>";
		if (row !== undefined) {
			console.log("table exists. cleaning existing records");
			db.run("INSERT OR REPLACE INTO blogs (slug, title, content) " + "VALUES (?, ?, ?)",slug,title,content);
		}
		else {
			console.log("creating table");
			db.run("CREATE TABLE blogs (slug TEXT, title TEXT, content TEXT, PRIMARY KEY (slug) )", function() {
				db.run("INSERT OR REPLACE INTO blogs (slug, title, content) " + "VALUES (?, ?, ?)",slug,title,content);
			});
		}
	});
	res.json(req.body);
});

/* Add a link to the db */
app.get('/addLink', function(req, res){
    var long_url = req.query.long_url;
    var short_url = req.query.short_url;

    db.run("INSERT INTO links " +
    	"(long_url, short_url, hit_count) " +
    	"VALUES (?, ?, ?)", 
    		long_url, 
    		short_url,
    		0);

	res.json({"long_url": long_url,
			"short_url": short_url});
});

/* return all of the links in the db */
app.get('/getAllLinks', function(req, res) {

	db.all("SELECT long_url, short_url, hit_count FROM " +
	 	"links", function(err, rows) {
			res.json({ "data": rows });
		})
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
	console.log('Server on localhost listening on port 3000');
});
