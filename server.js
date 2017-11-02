var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');
var log = require("loglevel");
var path = require("path");

console.log('process.env.NODE_ENV (in server.js) = ' + process.env.NODE_ENV);
if (process.env.NODE_ENV) { // Production
	console.log("Setting log level to ERROR");
	log.setLevel("ERROR");
} else { // Development
	var level = process.env.LOG_LEVEL || "DEBUG";
	console.log("Setting log level to " + level);
	log.setLevel(level);
}

var app = express();
var port = process.env.PORT || 8080;

var db = require(path.join(__dirname, '/models'));

app.use(express.static(process.cwd() + '/public'));

app.use(methodOverride('_method'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

require('./controllers/burgers_controller.js')(app);

db.sequelize.sync().then(function() {
  app.listen(port, function() {
    console.log("My-Burger-Sequel is listening on PORT " + port);
  });
});
