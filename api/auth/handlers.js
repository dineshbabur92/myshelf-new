let jwt = require("jsonwebtoken");
let secretKey = require("./../../config").authentication.secret;
let buildResponse = require("./../utilities").buildResponse;
let isPasswordCorrect = require("./../utilities").isPasswordCorrect;
let hashPassword = require("./../utilities").hashPassword;

module.exports = function(wagner){
	return  {

		login: {
			post: wagner.invoke(
				(User) => {
					return (req, res) => {

						let email = req.body.email;
						let password = req.body.password;

						User.findOne({"profile.email": email}, (err, user) => {

							if(err){
								res.json(buildResponse(500, "Internal server error.", null));
							}
							else if(!user){
								res.json(buildResponse(401, "User not found. Please sign up.", null));
							}
							else if(
								isPasswordCorrect(
									user.data.password.hash, user.data.password.salt, 
									user.data.password.iterations, password
								)
							){
								res.json(buildResponse(200, "Logged in successfully.", { 
										"token": jwt.sign({"id": user._id}, secretKey)
									})
								);
							}
							else{
								res.json(buildResponse(401, "Incorrect password.", null));
							}

						});

					}
				}
			)
		},

		signup: {
			post: wagner.invoke(
				(User) => {
					return (req, res) => {

						let email = req.body.email;
						let password = req.body.password;

						new User(
							{
								profile: {email: email}, 
								data: {
									password: hashPassword(password)
								}
							}
						).save((err, user) => {

									if(err){
										res.json(buildResponse(500, "Internal server error.", null));
									}
									else{
										res.json(buildResponse(200, "Signed up successfully.", { 
											"token": jwt.sign({"id": user._id},secretKey)
										}));
									}

						});

					}
				}
			)
		}

		// test: {
		// 	get: (req, res) => {
		// 		console.log(req.get('Authorization'));
		// 		res.json(req.user);
		// 	}
		// }

	}
}