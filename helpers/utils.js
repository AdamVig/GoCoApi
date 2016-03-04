const config = require('../config');

module.exports = utils = {};

/**
 * Get authentication parameters from request
 * @param  {request}   req  Contains parameters in 'body'
 * @param  {response}  res  Response object
 * @param  {Function}  next Callback
 * @return {object}         Contains username and password in plaintext
 */
utils.getAuth = function (req, res, next) {

    try {
        const auth = req.body;
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
utils.getErrorMessage = function (e) {
    const statusCode = e.statusCode || 500;
    const errorMessage = config.ERROR[statusCode] || config.ERROR[500];
    return errorMessage;
};

/**
 * Log and send error
 * @param  {request}  req    Request object
 * @param  {response} res    Response object
 * @param  {string}   source Name of error's origin function
 * @param  {string}   route  Name of error's origin route
 * @param  {Error}    error  Error object, contains 'message'
 */
utils.handleError = function (req, res, source, route, error) {
    console.log("%s Error in %s: %s", source, route, error.message);
    res.send(error);
};

/**
 * Cache data
 * @param  {varies} data      Data to cache
 * @param  {string} endpoint  Name of endpoint, used as key in cache
 * @param  {string} cacheType Either "user" or "global"
 * @param  {object} username  User to cache data for (optional, only needed for
 *                            cacheType "user")
 */
utils.cache = function (data, endpoint, cacheType, username) {

};
