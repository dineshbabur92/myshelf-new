var express = require("express");
var bodyParser = require("body-parser");
var wagner = require("wagner-core");

//may be async to register in wagner 
require("./models")(wagner);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//may be async
wagner.factory("app", function(){
	return app;
});

require("./api")(wagner);

app.listen(3000, () => {
	console.log("app listening in 3000!")
});


