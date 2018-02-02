let mongoose = require("mongoose");

let userSchema = {

	"profile": {
		"email":{
			"type": "String",
			"required": true,
			"lowercase": true
		},
		"username": {
			"type": String,
			// "required": true,
			"lowercase": true
		},
		"picture": {
			"type": String,
			// "required": true,
			"match": /^http:\/\//i
		},
		"friends": [{
			"type": mongoose.Schema.Types.ObjectId
		}],
		"followers": [{
			"type": mongoose.Schema.Types.ObjectId
		}],
		"following": [{
			"type": mongoose.Schema.Types.ObjectId
		}]
	},
	"data":{
		"oauth": {
			"type": String
		},
		"password": {
			"hash": {
				type: String,
				required: true
			},
			"salt": {
				type: String,
				required: true
			},
			"iterations": {
				type: Number,
				required: true
			}
		}
	}
	
} 

module.exports.userSchema = userSchema;
module.exports = new mongoose.Schema(userSchema);
module.exports.set("toObject", {"virtuals": true});
module.exports.set("toJSON", {"virtuals": true});

