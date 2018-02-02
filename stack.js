
	var opts = {}
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = "very_secret"

	passport.use(new JwtStrategy(opts, function(payload, next){
		console.log("payload received" + payload);
		User.findById(payload.id, function(err, user){
			console.log("user found:" + user);
			if(err){
				return next(err, false)
			}
			else if(user){
				return next(null, user)
			}
			else{
				return next(null, false)
			}
		});
		}
	));

	app.use(passport.initialize());

	app.post("/login", function(req, res){

			var email = req.body.email;
			var password = req.body.password;

			var user = User.findOne({"email": email}, function(err, user){

			if(err){
				res.json({"error": err});
				return;
			}
			if(!user){
				res.json({"message": "No user found"});
				return;
			}
			if(user.password == password){
				res.json(
					{ 
						"message": "User found",
						"token": jwt.sign({"id": user.id}, opts.secretOrKey)
					}
				);
			}
			else{
				res.json({"message": "Password did not match"});
			}
		});
	});

	app.post("/register", function(req, res){
	new User({ email: req.body.email, password: req.body.password}).
		save(function(err, user){
				if(err){
					res.json({"message": "User cannot be created"});
				}
				else{
					res.json(
						{ 
							"message": "ok",
							"token": jwt.sign({"id": user.id}, opts.secretOrKey)
						}
					);
				}
		});
	});

	app.get("/secret", passport.authenticate("jwt", {session: false}), function(req, res){
		console.log(req.get('Authorization'));
		res.json(req.user);
	});

	GET /secret HTTP/1.1
	Host: localhost:3000
	Content-Type: application/x-www-form-urlencoded
	Authorization: JWT token_I_received_on_login
	Cache-Control: no-cache
	Postman-Token: 114060a3-3074-6688-6245-0b0cfe7e9f04

	it("Login and post", function(done){
		superagent
			.post(URL_ROOT + "/register")
			.send({
				email: "posttest@test.com",
				password: "posttest"
			})
			.end(function(err, res){
				assert.ifError(err);
				console.log("finished logging in test")
				var token = res.body.token;
				superagent
				.post(URL_ROOT + "/post")
				.send({
					content: "testing post",
					user: jwt.decode(token).id
				})
				.set("Authorization", "test_scheme " + token)
				.end(function(err, res){
					assert.ifError(err);
					assert.equal(res.body.post.content, "testing post");
					console.log("going to call done()");
					done();
				});
			});
	});


	// api.put("/me", wagner.invoke(function(User){
	// 	return function(req, res){
	// 		User.findOne({email: req.user}, function(err, user){
	// 				if(err){
	// 					res.json({"error": err});
	// 				}
	// 				if(user)
	// 		});
	// 	}
	// });