// Based on JSON Formatter by Mark Cavage

const utils = require('./utils');

/**
 * JSON formatter.
 * @param    {Object} req  the request object
 * @param    {Object} res  the response object
 * @param    {Object} body response body
 * @param    {Function} next next
 * @returns  {String}
 */
module.exports = function (req, res, body, next) {

    // Handle error
    if (body instanceof Error) {
        res.statusCode = body.statusCode || 500;
        body = utils.getErrorMessage(body);
    }

    const data = JSON.stringify(body);
    res.setHeader('Content-Length', Buffer.byteLength(data));

    return next(null, data);
};
