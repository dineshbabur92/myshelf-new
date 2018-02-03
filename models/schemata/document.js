let mongoose = require("mongoose")

let documentSchema = {

	"info": {
		"title": {
			type: String,
			required: true
		},
		"description": {
			type: String
		},
		"author": {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		"is_done": {
			type: Boolean,
			default: false
		}
	},
	"share_setting": {
			"circle": [{
			type: String,
			enum: [
				"friends",
				"followers",
				"following"
			],
			set: function(v){
				this.is_private = false;
				this.is_public = false;
				return v;
			}
			// default: ""
		}],
		"is_private": {
			type: Boolean,
			default: true,
			set: function(v){
				this.is_public = false;
				this.share_circle = [];
				return v;
			}
		},
		"is_public": {
			type: Boolean,
			default: true,
			set: function(v){
				this.is_private = false;
				this.share_circle = [];
				return v;
			}
		},
		"shared_specific": [{
			type: mongoose.Schema.Types.ObjectId
		}]
	}
	
}

module.exports.documentSchema = documentSchema;
module.exports = new mongoose.Schema(documentSchema);
module.exports.set("toObject", {"virtuals": true});
module.exports.set("toJSON", {"virtuals": true});
