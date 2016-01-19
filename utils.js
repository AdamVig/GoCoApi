const config = require('./config');
const rp = require('request-promise');
const cheerio = require('cheerio');

/**
 * Get authentication parameters from request
 * @param  {request}   req  Contains parameters in 'body'
 * @param  {response}  res  Response object
 * @param  {Function}  next Callback
 * @return {object}         Contains username and password in plaintext
 */
function getAuth(req, res, next) {

    try {
        const auth = JSON.parse(req.body);
        auth.password = new Buffer(auth.password, "base64").toString("ascii");
    } catch (e) {
        throw new Error("Could not get auth from request body.");
    }

    return auth;
}

module.exports.getAuth = getAuth;

/**
 * Get user-friendly error message and log actual error
 * Defaults to 500 Internal Server Error if unknown status code
 * @param  {error} e HttpError from Requests library, contains statusCode
 * @return {error}   restify error from restify's errors module
 */
function getErrorMessage(e) {
    const statusCode = e.statusCode || 500;
    const errorMessage = config.ERROR[statusCode] || config.ERROR[500];
    return errorMessage;
}

module.exports.getErrorMessage = getErrorMessage;

/**
 * Log and send error
 * @param  {request}  req    Request object
 * @param  {response} res    Response object
 * @param  {string}   route  Name of error's origin route
 * @param  {Error}    error  Error object, contains 'message'
 */
function handleError(req, res, route, error) {
    console.log("Error in %s: %s", route, error.message);
    res.send(error);
}

module.exports.handleError = handleError;

/**
 * Cache data
 * @param  {varies} data      Data to cache
 * @param  {string} endpoint  Name of endpoint, used as key in cache
 * @param  {string} cacheType Either "user" or "global"
 * @param  {object} username  User to cache data for (optional, only needed for
 *                            cacheType "user")
 */
function cache(data, endpoint, cacheType, username) {

}

/**
 * Make a GET endpoint
 * 1. Request a webpage
 * 2. Extract data from raw HTML using processor function
 * 3. Return data or error response
 * @param  {restify}  app       restify server
 * @param  {object}   endpoint  Contains lowercase name of endpoint,
 *                              URL of webpage to get,
 *                              processor function to extract data from webpage,
 *                              and cache settings (user, global, or false)
 */
function makeScraperEndpoint(app, endpoint) {

    // Define GET Endpoint on server object
    app.get(config.PREFIX + endpoint.name, (req, res, next) => {

        // Get credentials from request
        try {
            const auth = getAuth(req, res, next);
        } catch (e) {
            handleError(req, res, endpoint.name, e);
        }

        // Get webpage, extract data, and send response or handle error
        rp({url: endpoint.url, auth: auth, transform: cheerio.load})
            .then(($) => {

                const data = endpoint.processor($);

                if (endpoint.cache) {
                    cache(data, endpoint.cache);
                }

                res.send({data: data});

            }).catch((e) => {
                handleError(req, res, endpoint.name, e);
            }).finally(next);
    });
}

module.exports.makeScraperEndpoint = makeScraperEndpoint;
