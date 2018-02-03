const buildResponse = require("./../utilities").buildResponse;

module.exports = function(wagner){
	return {

		get: wagner.invoke(
			(Document, Content) => {
				return (req, res) => {

					const docid = req.params.docid;
					let cno = req.params.cno;
					try{
						cno = parseInt(cno);
					}
					catch(e){
						res.json(buildResponse(500, "Bad request.", null));
						return;
					}
					const user = req.user;

					// if(!(docid && cno && user)){
					// 		res.json(buildResponse(400, "Bad request.", null));
					// }
					// else {
						Document.findById(docid, (err, doc) => {
							if(err){
								res.json(buildResponse(500, "Unexpected server error.", null));
							}
							else if(!doc){
								res.json(buildResponse(404, "Document not found.", null));
							}
							else if(doc.info.author == user.id && doc.share_setting.is_public == true){
								Content.findOne({"info.document": doc.id, "info.index": cno}, function(err, content){
										if(err){
											res.json(buildResponse(500, "Unexpected server error.", null));
										}
										else if(!content){
											res.json(buildResponse(404, "Content not found.", null));
										}
										else{
											res.json(buildResponse(
													200, 
													"Content retrieved successfully",
													{ 
														doc: {  id: doc.id, info: doc.info }, 
														content: {
															info: content.info
														} 
													}
												)
											)
										}
								});
							}
							else{
								res.json(buildResponse(401, "Unauthorized.", null));
							}
						});
					// }
					
			}
		}),

		post: wagner.invoke(
			(Document, Content) => {
				return (req, res) => {

					let content = req.body.content;
					const docid = req.params.docid;
					const user = req.user;
					let cno = 1;

					// if(!(doc && doc.info && user && content)){
					// 	res.json(buildResponse(400, "Bad request.", null));
					// }
					// else
					// if(content && docid != content.document){
					// 	res.json(buildResponse(401, "Bad request.", null));
					// }
					// else {
						Document.findById(docid, (err, doc) => {
							// console.log(doc.info.author, user._id);
							if(err){
								res.json(buildResponse(500, "Unexpected server error.", null));
							}
							else if(!doc){
								res.json(buildResponse(400, "Bad request, Document not found.", null));
							}
							else if(!(doc.info.author == user.id)){
								// console.log(doc.info.author, user._id, typeof(doc.info.author), typeof(user._id), "are not equal");
								res.json(buildResponse(401, "Unauthorized.", null));
							}
							else {
								new Promise(
									(resolve, reject) => {
										console.log("finding contents for the docid, ", doc._id);
										Content.find({"info.document": doc.id})
										.sort([["info.index", -1]])
										.limit(1)
										.exec((err, contents) => {
											if(err){
												reject(err);
											}
											else {
												console.log("contents, ", contents);
												if(contents && contents.length > 0){
													cno = parseInt(contents[0].info.index) + 1;
													console.log("cno changed", cno);
												}
												resolve();
											}
										});
									}
								).then(() => {
									// content = content ? content : { description: { something: "description of something" } };
									if(!content.info){
										res.json(buildResponse(400, "Bad request.", null));
										return;
									}
									content.info.index = cno;
									content.info.document = doc.id;
									console.log("promise resolved, and cno, ", cno);
									Content.create(content, function(err, content){
										if(err){
											console.log(err);
											res.json(buildResponse(500, "Unexpected server error.", null));
										}
										else if(!content){
											res.json(buildResponse(500, 
												"Unexpected server error. Content cannot be created.", null));
										}
										else{
											res.json(buildResponse(
													200,
													"Content created successfully.",
													{ 
														doc: {  id: doc.id, info: doc.info }, 
														content: { info: content.info } 
													}
												)
											);
										}
									});
								})
								.catch((err) => {
									console.log("promise error, ", err);
									res.json(buildResponse(500, "Unexpected server error.", null));
								})
							}
						});
					// }

				}
			}
		),

		put: wagner.invoke(
			(Document, Content) => {
				return (req, res) => {

					const docid = req.params.docid;
					let cno = req.params.cno;
					try{
						cno = parseInt(cno);
					}
					catch(e){
						res.json(buildResponse(500, "Bad request.", null));
						return;
					}
					const user = req.user;
					let content = req.body.content;

					if(!content){
						res.json(buildResponse(500, "Bad request.", null));
						return;
					}
					if(content.info){
						if(content.info.document && content.info.document != docid){
							res.json(buildResponse(500, "Bad request.", null));
							return
						}
						if(content.info.index && content.info.index != cno){
							res.json(buildResponse(500, "Bad request.", null));
							return;
						}
					}
					// if(!(cno && docid && user && content)){
					// 	res.json(buildResponse(400, "Bad request.", null));
					// }
					// else if (docid != content.document){
					// 	res.json(buildResponse(401, "Bad request.", null));
					// }
					// else {
						Document.findById(docid, function(err, doc){
							if(err){
								res.json(buildResponse(500, "Unexpected server error", null));
							}
							else if(!doc){
								res.json(buildResponse(500, "Bad request. Document not found.", null));
							}
							else if(!(doc.info.author == user.id)){
								res.json(buildResponse(500, "Unauthorized.", null));
							}
							else{
								Content.findOne({"info.document": doc.id, "info.index": cno}, function(err, contentTobeUpdated){
										if(err){
											res.json(buildResponse(500, "Unexpected server error.", null));
										}
										else if(!contentTobeUpdated){
											res.json(buildResponse(404, "Content to be updated not found", null));
										}
										else{
											contentTobeUpdated.info = Object.assign(contentTobeUpdated.info, content.info);
											contentTobeUpdated.save((err, updatedContent) => {
												if(err || !updatedContent){
													console.log(err);
													res.json(buildResponse(
														500, 
														'Unexpected server error. Content not updated', 
														null
													));
												}
												else{
													res.json(buildResponse(
														200, 
														"Content updated successfully.", 
														{ 
															doc: { id: doc.id, info: doc.info }, 
															content: { info: updatedContent.info }
														}
													));
												}
											});
										}
								});
							}
						});
					// }
					
				}
			}
		)

	}
}