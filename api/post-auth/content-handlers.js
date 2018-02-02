api.get("/content/:docid", wagner.invoke(
		function(passport){
			return passport.authenticate("jwt", {session: false});
		}), wagner.invoke(function(Document, Content){
		return function(req, res){

			try{
				var docid = req.params.docid;
				console.log(req.query);
				var cno = req.query.cno || 1;
				var userid = req.user.id;
			}
			catch(e){
				res.json({message: "Unathorized - Request content"});
			}

			Document.findById(docid, function(err, doc){
					if(err){
						res.json({error: err});
					}
					else if(!doc){
						res.status({message: "Document not found"});
					}
					else if(doc.info.author == userid || doc.share_settings.is_public == true){
						Content.findOne({document: docid, number: cno}, function(err, content){
								if(err){
									res.json({error: err});
								}
								else if(!content){
									res.status({message: "Content not found"});
								}
								else{
									res.json({content: content, message: "Content retrieved successfully"});
								}
						});
					}
					else{
						res.json({message: "Unauthorized"});
					}
			});

			
		}
	}));

	api.post("/content", wagner.invoke(
		function(passport){
			return passport.authenticate("jwt", {session: false});
		}), wagner.invoke(function(Content){
		return function(req, res){

			try{
				var content = req.body.content;
				var doc = req.body.doc;
				var user = req.user;
			}
			catch(e){
				res.json({message: "Unauthorized - Request content"});
			}

			if(doc.info.author != user._id){
				console.log("author: " + doc.info.author + ", user: " + user._id);
				res.json({message: "Unauthorized"})
			}

			else if (doc.id != content.document){
				res.json({message: "Unauthorized"});
			}

			else {
				Content.create(content, function(err, content){
					if(err){
						res.json({error: err});
					}
					else if(!content){
						res.json({message: "Content cannot be created"});
					}
					else{
						res.json({content: content, message: "Content created successfully"});
					}
				});
			}	
		}
	}));

	api.put("/content", wagner.invoke(
		function(passport){
			return passport.authenticate("jwt", {session: false});
		}), wagner.invoke(function(Document, Content){
		return function(req, res){

			var content = req.body.content;
			var doc = req.body.doc;
			var user = req.user;

			Document.findById(doc.id, function(err, doc){
					if(err){
						res.json({error: err});
					}
					else if(!doc){
						res.status({message: "Document not found"});
					}
					else if(!(doc.info.author == user.id || content.document == doc._id)){
						res.json({message: "Unauthorized"});
					}
					else{
						console.log("Document found for update content: " + doc);
						Content.findOneAndUpdate({document: doc.id, number: content.number}, content, {new: true}, function(err, content){
								console.log("inside content update handler");
								if(err){
									res.json({error: err});
								}
								else if(!content){
									res.json({message: "Content not found"});
								}
								else{
									res.json({content: content, message: "Content updated successfully"});
								}
						});
					}
			});
	
		}
	}));