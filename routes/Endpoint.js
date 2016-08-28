const restify = require("restify");

const cache = require("../helpers/cache");
const utils = require("../helpers/utils");

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
 * Generic endpoint on a Restify app
 * Must be extended to add functionality, cannot be instantiated directly.
 * Will create the specified endpoint on a Restify app passed to the
 * constructor. If no app is passed, it will simply expose the instance methods
 * for use outside of an endpoint.
 */
module.exports = class Endpoint {
    /**
     * Make an endpoint
     * 1. Request a webpage
     * 2. Extract data from raw HTML using processor function
     * 3. Return data or error response
     * @param {restify} app Restify server
     * @param {object} config Endpoint configuration
     * @param {boolean|string} [config.cache=false] Cache setting: global, user,
     *     or false (disabled)
     * @param {string} [config.location=""] Location to retrieve data from; can
     *     be URL or database document ID
     * @param {string} [config.method="post"] Method for the endpoint to use
     * @param {Model} [config.model=null] Model for database access
     * @param {string} config.name Name of endpoint to use for URL; should have
     *     no spaces or special characters
     */
    constructor(app, {cache = false, location = "",  method = "post",
                      model = null, name}) {

        if (new.target === "Endpoint") {
            throw new Error("Cannot instantiate an Endpoint class directly; " +
                            "extend instead.");
        }

        this.cache = cache;
        this.location = location;
        this.method = method;
        this.model = model;
        this.name = name;

        if (app) {
            this.create(app);
        }
    }

    /**
     * Register endpoint on Restify app
     * @param {restify} app Restify server
     */
    create(app) {
        // Get method type from endpoint definition, default to "post"
        const method = this.method || "post";

        // Define endpoint on app
        app[method](this.name, (req, res, next) => {

            // Auth is only required when method is POST
            let auth = {};
            if (method === "post") {
                auth = this.getAuth(req);
            }

            // Use Model's get method if present; default to standard getter
            let getter;
            if (this.model) {
                getter = this.model.get(this.location);
            } else if (this.getter) {
                getter = this.getter(this.location, auth);
            } else {
                throw new Error(`Endpoint ${this.name} is missing either ` +
                                `a model or a getter.`);
            }

            getter.then(this.processor)
                .then((data) => {
                res.setHeader("content-type", "application/json");
                if (data.hasOwnProperty("data")) {
                    res.send(data);
                } else {
                    res.send({data: data});
                }
            }).catch((e) => {
                utils.handleError(req, res, "Endpoint", this.name, e);
            }).then(next);
        });

        // Define endpoint for OPTIONS preflight request
        app.opts(this.name, (req, res) => res.send(204));
    }

    /**
     * Get authentication parameters from request
     * @param  {request}   req  Contains parameters in "body"
     * @return {object}         Contains username and password in plaintext
     */
    getAuth(req) {
        const auth = req.body;

        if (!auth) {
            throw new restify.BadRequestError("Did not receive a request body.")
        }

        try {
            auth.password = new Buffer(auth.password, "base64")
                .toString("ascii");
        } catch (e) {
            throw new restify.UnauthorizedError(
                "Could not read password from request body.");
        }

        return auth;
    }

    /**
     * Get raw data from location
     * Placeholder function to be overridden by subclasses
     * @param {string} location URL or database document id
     * @return {Promise.<any>} Fulfilled by retrieved data
     */
    getter(location) {
        return Promise.resolve(location);
    }

    /**
     * Process data return by getter
     * Placeholder function to be overriden by subclasses.
     * @param {any} data Data from getter
     * @return {any} Processed data
     */
    processor(data) {
        return data;
    }
}
