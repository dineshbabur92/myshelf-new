const express = require("express");

module.exports = function(wagner){

	//may be async , again wagner
	require("./passport-init")(wagner);

	const authHandlers = require("./handlers")(wagner);
	const authRouter = express.Router();
	authRouter.post("/login", authHandlers.login.post);
	authRouter.post("/signup", authHandlers.signup.post);

	return authRouter;

}
