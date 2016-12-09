# **Group Project Learnings**

# Project URL
**http://my-cookery.herokuapp.com/**

# Project Description:
Cookery is a web application to keep track of the ingredients you have in your kitchen and give recipes suggestion based on the ingredients you want to use to cook at the moment. In the kitchen tab, you can add more ingredients as well as removing the ingredients you used up already.

# Project Technologies:

* WEBSERVER
  * Node.js: We used Node.js to implement our backend server. Our web-server will receive request from the web browser and run requested jobs. This includes:
    * URL routing from the web browser
    * Getting the necessary data from the api-server to be rendered in the webpage for each different route
    * Receive request caused by user's mouse click, etc
    * Process the user input when submitting a form
  * HTML, CSS, Javascript: We used all 3 of these to build up the front end of our web interface

* API
  * Sqlite: We used sqlite to hold usernames and the foods each user has in their inventory.
  * Node.js: We used Node.js to implement our API which provides: user recipes, user food inventory lists, and the ability to add/remove foods from a users inventory.
  * Food2fork: We used Food2fork as an external API which we made requests to in our API server for recipes containing a given set of ingredients. 

*TESTING
  * Curl: We used curl during testing to make requests to individual routes in our servers. 

* DEPLOYMENT
  * Heroku: We used Heroku to deploy our application to the internet

* PRESENTATION
  * Browser: For our presentation, we are using a browser (either Chrome or Safari) to make requests, retrieve, and render our project. 


