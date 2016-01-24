const config = require('./config');
const utils = require('./utils');

module.exports = endpoint = {};

/**
 * Make a GET endpoint
 * 1. Request a webpage
 * 2. Extract data from raw HTML using processor function
 * 3. Return data or error response
 * @param  {restify}  app       restify server
 * @param  {object}   endpoint  Contains lowercase name of endpoint,
 *                              data type to get,
 *                              location of data to get,
 *                              processor function to extract/transform data,
 *                              and cache settings (user, global, or false)
 */
endpoint.make = function (app, endpoint) {

    app.get(config.PREFIX + endpoint.name, (req, res, next) => {

        const auth = utils.getAuth(req, res, next);

        endpoint.getter(endpoint.location, auth)
            .then(endpoint.processor)
            .then((data) => {
                res.send({data: data});

                if (endpoint.cache) {
                    utils.cache(data, endpoint.cache);
                }
            }).catch((e) => {
                utils.handleError(req, res, "Endpoint", endpoint.name, e);
            }).finally(next);
    });
};
