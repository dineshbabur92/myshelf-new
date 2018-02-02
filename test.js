var assert = require("assert");
var wagner = require("wagner-core");
var superagent = require("superagent");
var URL_ROOT = "localhost:3000";
var jwt = require("jsonwebtoken");

describe("all tests", function(){
	// var test_var;

	before(function(){
		// test_var = 1;
		// app = express();
		// server = app.listen(3000)
		require("./models")(wagner);

	});

	it("check user insertion", function(done){
		wagner.invoke(function(User){
			User.create({

			}, function(err, user){
				if(err){
					assert.ok(err);
				}
			});
			User.create({
				"profile": {
					"email": "test2@test.com",
					"picture": "http://somedomain.com/mypicture"
				},
				"data":{
					"password": "test2"
				}
			}, function(err, user){
				if(err){
					assert.ifError(err);
				}
				assert.equal(user.profile.email, "test2@test.com");
				done();
			})
		});
	});

	it("check document insertion", function(done){
		wagner.invoke(function(User, Document){
			var author;
			User.findOne({}, function(err, user){
				if(err){
					assert.ifError(err);
				}
				Document.create({
					info: {
						"title": "test_doc",
						"author": user._id
					}
				}, function(err, doc){
					if(err){
						assert.ifError(err);
					}
					assert.equal(doc.info.title, "test_doc");
					assert.equal(doc.info.author, user._id);
					done();
				})
			})
		})
	});
	// it("should produce a sample test", function(done){
	// 	assert.equal(test_var, 0);
	// 	done();
	// });
	it("Login and create document", function(done){
		// console.log("starting test")
		superagent
			.post(URL_ROOT + "/login")
			.send({
				email: "doctest@test.com",
				password: "doctest"
			})
			.end(function(err, res){
				// assert.equal(res.hasOwnProperty("token"), true);
				assert.ifError(err);
				// console.log(res);
				var token = res.body.token;
				console.log(token);
				console.log(jwt.decode(token));
				superagent
				.post(URL_ROOT + "/document")
				.set("Authorization", "bearer " + token)
				.send({doc:{
					info:{
						title: "doctest",
						description: "testing document creation",
						author: jwt.decode(token).id
					},
					share_setting: {
						is_public: true
					}
				}})
				.end(function(err, res){
					assert.ifError(err);
					console.log(res.body);
					assert.equal(res.body.doc.info.title, "doctest");
					done();
				});

			});
	});
});