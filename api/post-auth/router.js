var bodyparser = require("body-parser");
var httpstatus = require("http-status");
var express = require("express");
var underscore = require("underscore");



module.exports = function(wagner){

	const documentHandlers = require("./document-handlers")(wagner);
	const postAuthRouter = express.Router();
	postAuthRouter.get("/document/:docid", documentHandlers.get);
	postAuthRouter.post("/documents/", documentHandlers.post);
	postAuthRouter.put("/document/:docid", documentHandlers.put);

	return postAuthRouter;

}