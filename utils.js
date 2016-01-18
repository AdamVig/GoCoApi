const config = require('./config');
const httpStatus = require('http-status');

/**
 * Get authentication parameters from request
 * @param  {request}   req  Contains parameters in 'body'
 * @param  {response}  res  Response object
 * @param  {Function}  next Callback
 * @return {object}         Contains username and password in plaintext
 */
module.exports.getAuth = function (req, res, next) {

    try {
        const auth = JSON.parse(req.body);
        auth.password = new Buffer(auth.password, "base64").toString("ascii");
    } catch (e) {
        throw new Error("Could not get auth from request body.");
    }

    return auth;
};

module.exports.getError = function (e) {
    const errorName = httpStatus[e.statusCode];
    const errorMessage = config.ERROR[errorName.replace(/ /g, "")];
    console.log("Error Name: %s", errorName);
    console.log("Error Message: %s", errorMessage);
    if (errorMessage) {
        return errorMessage;
    } else {
        return errorName;
    }
};

module.exports.handleError = function (req, res, route, error) {
    console.log("Error in %s: %s", route, error.message);
    res.send(error);
};
