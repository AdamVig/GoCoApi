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

/**
 * Get user-friendly error message and log actual error
 * Defaults to 500 Internal Server Error if unknown status code
 * @param  {error} e HttpError from Requests library, contains statusCode
 * @return {error}   restify error from restify's errors module
 */
module.exports.getErrorMessage = function (e) {
    const statusCode = e.statusCode || 500;
    const errorMessage = config.ERROR[statusCode] || config.ERROR[500];
    return errorMessage;
};

/**
 * Log and send error
 * @param  {request}  req    Request object
 * @param  {response} res    Response object
 * @param  {string}   route  Name of error's origin route
 * @param  {Error}    error  Error object, contains 'message'
 */
module.exports.handleError = function (req, res, route, error) {
    console.log("Error in %s: %s", route, error.message);
    res.send(error);
};
