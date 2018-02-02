let mongoose = require("mongoose");
let _ = require("underscore");

module.exports = function(wagner){

	mongoose.connect(require("./../config").database.mongoDbUrl);
	wagner.factory("db", function(){	
		return mongoose;
	});

	var User = mongoose.model("User", require("./schemata/user"), "users");
	var Document = mongoose.model("Document", require("./schemata/document"), "documents");
	var Content = mongoose.model("Content", require("./schemata/content"), "contents");
	var models = {
		"User": User,
		"Document": Document,
		"Content": Content
	}
	_.each(models, function(value, key){
		wagner.factory(key, function(){
			return value;
		});
	});

	return models;
	
}