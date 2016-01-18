// Based on JSON Formatter by Mark Cavage
'use strict';

const config = require('./config');
const utils = require('./utils');

/**
 * JSON formatter.
 * @param    {Object} req  the request object
 * @param    {Object} res  the response object
 * @param    {Object} body response body
 * @param    {Function} next next
 * @returns  {String}
 */
function formatResponse(req, res, body, next) {

    // Handle error
    if (body instanceof Error) {

        res.statusCode = body.statusCode || 500;

        // Set error message
        if (res.statusCode == 500) {
            console.log("Error: %s", body.message);
            body = config.ERROR.InternalServerError;
        } else {
            body = utils.getError(res.statusCode);
        }

        // Set content type to handle transmitted emoji
        res.setHeader('Content-Type', 'text/html');
    }

    const data = JSON.stringify(body);
    res.setHeader('Content-Length', Buffer.byteLength(data));

    return next(null, data);
}

module.exports = formatResponse;
