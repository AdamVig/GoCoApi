const cache = require("./cache");
const utils = require("./utils");

// Private:

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

// Public:

class Endpoint {
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
    constructor(app, endpoint) {

        // Get method type from endpoint definition, default to "post"
        const method = endpoint.method || "post";

        // Define endpoint on app
        app[method](endpoint.name, (req, res, next) => {

            // Auth is only required when method is POST
            let auth = {};
            if (method === "post") {
                auth = this.getAuth(req);
            }

            // Use Model's get method if present; default to standard getter
            let getter;
            if (endpoint.model) {
                getter = endpoint.model.get(endpoint.location);
            } else if (endpoint.getter) {
                getter = endpoint.getter(endpoint.location, auth);
            } else {
                throw new Error(`Endpoint ${endpoint.name} is missing either ` +
                                `a model or a getter.`);
            }

            getter.then(endpoint.processor)
                .then((data) => {
                res.setHeader("content-type", "application/json");
                if (data.hasOwnProperty("data")) {
                    res.send(data);
                } else {
                    res.send({data: data});
                }
            }).catch((e) => {
                utils.handleError(req, res, "Endpoint", endpoint.name, e);
            }).then(next);
        });

        // Define endpoint for OPTIONS preflight request
        app.opts(endpoint.name, (req, res) => res.send(204));
    }

    /**
     * Get authentication parameters from request
     * @param  {request}   req  Contains parameters in "body"
     * @return {object}         Contains username and password in plaintext
     */
    getAuth(req) {
        const auth = req.body;

        try {
            auth.password = new Buffer(auth.password, "base64")
                .toString("ascii");
        } catch (e) {
            throw new restify.UnauthorizedError(
                "Could not read password from request body.");
        }

        return auth;
    }

}

module.exports = Endpoint;
