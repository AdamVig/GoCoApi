const restify = require("restify");
const config = require("../config");

const utils = module.exports = {};

/**
 * Get authentication parameters from request
 * @param  {request}   req  Contains parameters in "body"
 * @return {object}         Contains username and password in plaintext
 */
utils.getAuth = function (req) {
    const auth = req.body;

    try {
        auth.password = new Buffer(auth.password, "base64").toString("ascii");
    } catch (e) {
        throw new restify.UnauthorizedError(
            "Could not read password from request body.");
    }

    return auth;
};

/**
 * Get user-friendly error message and log actual error
 * Defaults to 500 Internal Server Error if unknown status code
 * @param  {error} e HttpError from Requests library, contains statusCode
 * @return {error}   restify error from restify"s errors module
 */
utils.getErrorMessage = function (e) {
    const statusCode = e.statusCode || 500;
    const errorMessage = config.ERROR[statusCode] || config.ERROR[500];
    return errorMessage;
};

/**
 * Log and send error
 * @param  {request}  req    Request object
 * @param  {response} res    Response object
 * @param  {string}   source Name of error"s origin function
 * @param  {string}   route  Name of error"s origin route
 * @param  {Error}    error  Error object, contains "message"
 */
utils.handleError = function (req, res, source, route, error) {
    console.error("%s Error in %s: %s", source, route, error.message);
    error.body.explanation = utils.getErrorMessage(error);
    res.send(error);
};
