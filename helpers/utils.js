const restify = require("restify");

const config = require("../config");
const log = require("./log");

const utils = module.exports = {};

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
    if (!error.body) {
        error = new restify.InternalServerError(error.message);
    }

    error.body.explanation = utils.getErrorMessage(error);
    res.send(error);
};
