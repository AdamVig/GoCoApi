const config = require('./config');
const utils = require('./utils');
const rp = require('request-promise');
const cheerio = require('cheerio');

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
function make(app, endpoint) {

    // Define GET Endpoint on server object
    app.get(config.PREFIX + endpoint.name, (req, res, next) => {

        // Get credentials from request
        try {
            const auth = utils.getAuth(req, res, next);
        } catch (e) {
            utils.handleError(req, res, endpoint.name, e);
        }

        // Get webpage, extract data, and send response or handle error
        rp({url: endpoint.url, auth: auth, transform: cheerio.load})
            .then(($) => {

                const data = endpoint.processor($);

                if (endpoint.cache) {
                    utils.cache(data, endpoint.cache);
                }

                res.send({data: data});

            }).catch((e) => {
                utils.handleError(req, res, "Endpoint", endpoint.name, e);
            }).finally(next);
    });
}

module.exports.make = make;
