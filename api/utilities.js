let config = require("../config");
let randombytes = require("randombytes");
let pbkdf2 = require("pbkdf2");

const buildResponse = function(status, message, data){

	return {
		status: status,
		message: message,
		data: data
	}

}

const hashPassword = function(password) {

  let salt = randombytes(config.authentication.saltLength).toString(config.authentication.saltEncoding);
  let iterations = config.authentication.saltIterations;
  let hash = pbkdf2.pbkdf2Sync(
  	password, 
  	salt, 
  	iterations, 
  	config.authentication.hashLength, 
  	config.authentication.hashDigest
	);

  return {
      salt: salt,
      hash: hash,
      iterations: iterations
  };

}

const isPasswordCorrect = function(savedHash, savedSalt, savedIterations, passwordAttempted) {
    return savedHash == pbkdf2.pbkdf2Sync( 
    	passwordAttempted, 
    	savedSalt, 
    	savedIterations, 
	  	config.authentication.hashLength, 
	  	config.authentication.hashDigest
  	);
}


exports.buildResponse = buildResponse;
exports.hashPassword = hashPassword;
exports.isPasswordCorrect = isPasswordCorrect;