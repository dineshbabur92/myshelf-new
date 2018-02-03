var bodyparser = require("body-parser");
var httpstatus = require("http-status");
var express = require("express");
var underscore = require("underscore");



module.exports = function(wagner){

	const documentHandlers = require("./document-handlers")(wagner);
	const contentHandlers = require("./content-handlers")(wagner);
	const postAuthRouter = express.Router();
	postAuthRouter.get("/documents/:docid", documentHandlers.get);
	postAuthRouter.post("/documents/", documentHandlers.post);
	postAuthRouter.put("/documents/:docid", documentHandlers.put);
	postAuthRouter.post("/documents/:docid/contents/", contentHandlers.post);
	postAuthRouter.get("/documents/:docid/contents/:cno", contentHandlers.get);
	postAuthRouter.put("/documents/:docid/contents/:cno", contentHandlers.put);

	return postAuthRouter;

}