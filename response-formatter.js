// Based on JSON Formatter by Mark Cavage
'use strict';

const config = require('./config');

/**
 * JSON formatter.
 * @param    {Object} req  the request object
 * @param    {Object} res  the response object
 * @param    {Object} body response body
 * @param    {Function} next next
 * @returns  {String}
 */
function formatResponse(req, res, body, next) {

    let data;

    if (body instanceof Error) {

        res.statusCode = body.statusCode || 500;

        if (res.statusCode == 500) {
            console.log("Error: %s", body.message);
            body = config.ERROR.InternalServerError;
        }

    } else if (Buffer.isBuffer(body)) {

        body = body.toString('base64');
        data = body;
    }

    data = JSON.stringify(body);
    res.setHeader('Content-Length', Buffer.byteLength(data));

    return next(null, data);
}

module.exports = formatResponse;
