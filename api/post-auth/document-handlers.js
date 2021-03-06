let buildResponse = require("./../utilities").buildResponse;

module.exports = function(wagner){
	return {
		get: wagner.invoke(
			(Document) => {
				return (req, res) => {
					
					const docid = req.params.docid;
					const user = req.user;

					// if(!(docid && user)){
					// 		res.json(buildResponse(400, "Bad request.", null));
					// }
					// else{
						Document.findById(docid, (err, doc) => {
							// console.log(doc.info.author, user._id, doc.share_setting.is_public);
							if(err){
								res.json(buildResponse(500, "Unexpected server error.", null));
							}
							else if(!doc){
								res.json(buildResponse(404, "Document not found.", null));
							}
							else if(doc.info.author == user.id || doc.share_setting.is_public == true){
								res.json(buildResponse(
										200, 
										"Document retrieved successfully.", 
										{ doc: {id: doc.id, info: doc.info} }
									)
								);
							}
							// else{
							// 	res.json(buildResponse(401, "Unauthorized.", null));
							// }
						});
					// }

				}
			}
		),

		post: wagner.invoke(
			(Document) => {
				return (req, res) => {

					const doc = req.body.doc;
					const user = req.user;

					// console.log("doc and user, ", doc, user);
					// if(!(doc && doc.info && doc.info.author && user )){
					// 		res.json(buildResponse(400, "Bad request.", null));
					// }
					// else 
					if(doc.info && (doc.info.author != user.id)){
						// console.log("author: " + doc.info.author + ", user: " + user._id);
						res.json(buildResponse(500, "Bad request. Identity forge.", null));
					}
					else {
						Document.create(doc, (err, doc) => {
							console.log(err, doc);
							if(err || !doc){
								res.json(buildResponse(500, "Unexpected server error. Document not saved.", null));
							}
							else{
								res.json(buildResponse(
										200, 
										"Document created successfully.", 
										{ doc: { id: doc.id, info: doc.info } }
									)
								);
							}
						});
					}

				}
			}
		),

		put: wagner.invoke(
			(Document) => {
				return (req, res) => {

					const docid = req.params.docid;
					const doc = req.body.doc;
					const user = req.user;

					if(!doc){
						res.json(buildResponse(500, "Bad request.", null));
						return;
					}
					// console.log("doc and user, ", doc, user);
					// if(!(docid && doc && doc.info && doc.info.author && user )){
					// 		res.json(buildResponse(400, "Bad request.", null));
					// }
					// else if(doc.info.author != user._id){
					// 	// console.log("author: " + doc.info.author + ", user: " + user._id);
					// 	res.json(buildResponse(401, "Unauthorized.", null))
					// }
					// else {
						Document.findById(
							docid,
							// {$set: {info: doc.info}}, 
							// {new: true}, 
							(err, docToBeUpdated) => {
								if(err || !docToBeUpdated){
									res.json(buildResponse(500, "Unexpected server error.", null));
								}
								else if (!docToBeUpdated){
									res.json(buildResponse(404, "Document to be updated, not found"), null);
								}
								else if(!(JSON.stringify(docToBeUpdated.info.author) == JSON.stringify(user.id))){
									// console.log("author: ", JSON.stringify(docToBeUpdated.info.author), ", user: ", JSON.stringify(user.id));
									res.json(buildResponse(500, "Bad request. Identity forge.", null))
								}
								else{
									docToBeUpdated.info = Object.assign(docToBeUpdated.info, doc.info);
									docToBeUpdated.save((err, updDoc) => {
										if(err || !updDoc){
											res.json(buildResponse(500, "Unexpected server error. Document not updated", null));
										}
										else {
											res.json(buildResponse(
													200, 
													"Document updated successfully.", 
													{ doc: { id: updDoc.id, info: updDoc.info } }
												)
											);
										}
									});
								}	
							}
						);
					// }

				}	
			}
		)

	}
};