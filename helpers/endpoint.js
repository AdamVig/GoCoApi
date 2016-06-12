const config = require('../config');
const utils = require('./utils');
const cache = require('./cache');

module.exports = endpoint = {};

/**
 * Get current data from an endpoint
 * @param {object} endpoint Contains lowercase name of endpoint,
 *                          data type to get,
 *                          location of data to get,
 *                          processor function to extract/transform data,
 *                          and cache settings (user, global, or false)
 * @param {object} auth     Contains username and password
 * @return {promise}        Resolved by data from endpoint
 */
function getCurrentData(endpoint, auth) {
    return endpoint.getter(endpoint.location, auth)
            .then(endpoint.processor);
}

/**
 * Get cached or current data from endpoint
 * If caching is enabled and cached data is not expired, then cached
 * data is returned.
 * If caching is disabled or cached data is expired, then current data
 * is returned.
 * @param {object} endpoint Contains lowercase name of endpoint,
 *                          data type to get,
 *                          location of data to get,
 *                          processor function to extract/transform data,
 *                          and cache settings (user, global, or false)
 * @param {object} auth     Contains username and password
 * @return {promise}        Resolved by data from endpoint
 */
function getData(endpoint, auth) {
    if (endpoint.cache) {
            return cache.getData(endpoint.name,
                                 endpoint.cache,
                                 auth.username)
            .then((cachedData) => {

                // Cache does not exist or is expired
                if (!cachedData) {
                    return getCurrentData(endpoint, auth)
                        .then((freshData) => {
                            cache.cacheData(freshData,
                                            endpoint.name,
                                            endpoint.cache,
                                            auth.username);
                            return freshData;
                        });
                } else {
                    return cachedData;
                }
            });
    } else {
        return getCurrentData(endpoint, auth);
    }
}

/**
 * Make an endpoint
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

    // Get method type from endpoint definition, default to "post"
    const method = endpoint.method || "post";

    // Define endpoint on app
    app[method](config.PREFIX + endpoint.name, (req, res, next) => {

        // Auth is only required when method is POST
        let auth = {};
        if (method === "post") {
            auth = utils.getAuth(req, res, next);
        }

        getData(endpoint, auth).then((data) => {
            if (typeof data === "object") {
                res.send(data);
            } else {
                res.send({data: data});
            }
        }).catch((e) => {
            utils.handleError(req, res, "Endpoint", endpoint.name, e);
        }).then(next);
    });
};
