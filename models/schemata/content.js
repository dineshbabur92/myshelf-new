let mongoose = require("mongoose")

let contentSchema = {

	info: {
		index: {
			type: Number,
			required: true
		},
		contents: {
			type: Object,
			required: true
		},
		document: {
			type: mongoose.Schema.Types.ObjectId
		}
	}

}

module.exports.contentSchema = contentSchema;
module.exports = new mongoose.Schema(contentSchema);
module.exports.set("toObject", {"virtuals": true});
module.exports.set("toJSON", {"virtuals": true});

