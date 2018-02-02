module.exports = function(wagner){


	const authRouter = require("./auth/router")(wagner);
	const authInterceptor = wagner.invoke(
		(passport) => {
			return passport.authenticate("jwt", {session: false});
		}
	);
	const postAuthRouter = require("./post-auth/router")(wagner);

	wagner.invoke((app) => {
		app.use("/", authRouter);
		app.use("/", authInterceptor, postAuthRouter);
	});

	return {
		authRouter: authRouter,
		postAuthRouter: postAuthRouter
	}

}
