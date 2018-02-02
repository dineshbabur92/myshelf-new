let config = require("./../../config");
let passport = require("passport");
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt

module.exports = function(wagner){

	let opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = config.authentication.secret;
	// opts.issuer = ""
	// opts.audience = "localhost"
	
	passport.use(new JwtStrategy(opts,
		wagner.invoke((User) => {
			return (payload, next) => {

					User.findById(payload.id, {_id: 1, profile: 1}, function(err, user){
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
			}	
		)
	));

	wagner.factory("passport", (app) => {
		app.use(passport.initialize());
		return passport;
	});

	return passport;

}