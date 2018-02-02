let mongoose = require("mongoose")

let contentSchema = {

	"number": {
		type: Number,
		required: true
	},
	"description": {
		type: Object,
		required: true
	},
	"document": {
		type: mongoose.Schema.Types.ObjectId
	}
	
}

module.exports.contentSchema = contentSchema;
module.exports = new mongoose.Schema(contentSchema);
module.exports.set("toObject", {"virtuals": true});
module.exports.set("toJSON", {"virtuals": true});

