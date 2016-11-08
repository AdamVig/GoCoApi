const moment = require("moment");
const restify = require("restify");
const _ = require("underscore");

const AppData = require("../models/app-data");
const User = require("../models/user");
const utils = require("../helpers/utils");

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
        this.request = {};

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
            this.request.platform = req.headers["x-platform"];
            this.request.platformVersion = req.headers["x-platform-version"];
            this.request.appVersion = req.headers["x-app-version"];
            this.request.skipCache = req.params.bust == "true" || false;

            // Get auth when method is POST
            if (method === "post") {
                this.request.auth = this.getAuth(req);

            // Else just get username
            } else if (req.params && req.params.username) {
                this.request.auth = {
                    username: req.params.username,
                };
            }

            this.getData()
                .then((data) => {
                    res.setHeader("content-type", "application/json");
                    if (data.hasOwnProperty("data")) {
                        res.send(data);
                    } else {
                        res.send({data: data});
                    }
                    return data;
                })
                .then(this.logRequest.bind(this))
                .catch((e) => {
                    utils.handleError(req, res, "Endpoint", this.name, e);
                })
                .then(next);
        });

        // Define endpoint for OPTIONS preflight request
        app.opts(this.name, (req, res) => res.send(204));
    }

    /**
     * Get authentication parameters from request
     * @param  {request}   req  Contains parameters in "body"
     * @return {object|boolean} Username and password in plaintext, false if no
     *     request body provided
     */
    getAuth(req) {
        const auth = req.body;

        if (!auth) {
            throw new restify.BadRequestError(
                "Did not receive a request body.")
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
     * Get data
     * @return {object} Contains data
     */
    getData() {
        // Use Model's get method if present; default to standard getter
        let dataRequest;
        if (this.model) {
            dataRequest = this.model.load()
                .then((data) => {
                    return this.model.get(this.location)
                });
        } else if (this.getter) {
            dataRequest = this.getter(this.location, this.request.auth);
        } else {
            throw new Error(`Endpoint ${this.name} is missing either ` +
                            `a model or a getter.`);
        }

        return this.getDataFromCache()
            .then((data) => {
                // If cached data exists and is not expired, return it
                if (data && !this.isExpired(data)) {
                    return data;

                // Else get fresh data, process, and return it
                } else {
                    return dataRequest.then(this.processor)
                        .then((data) => {
                            this.saveToCache(data);
                            return data;
                        });
                }
            });
    }

    /**
     * Get data from cache if it exists
     * @return {object|boolean} Data if exists, false otherwise
     */
    getDataFromCache() {
        if (this.cache === "global" && !this.request.skipCache) {
            return new AppData("cache").get(this.name);
        } else if (this.cache === "user" && !this.request.skipCache) {
            return new User(this.request.auth.username).getFromCache(this.name);
        }
        return Promise.resolve(false);
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
     * Log request in user data
     */
    logRequest() {
        if (this.request.auth && this.request.auth.username) {
            const user = new User(this.request.auth.username);
            user.updateUsage(this.name)
        }
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

    /**
     * Cache retrieved data according to the route's cache settings
     * If `cache` is `false`, skip caching.
     * If `cache` is `"user"`, cache data in user's document.
     * If `cache` is `"global"`, cache data in the global cache document.
     * @param {any} data Data to cache
     * @return {Promise|any} Provided data (pass-through for chaining) or
     *     Promise from cache request
     */
    saveToCache(data) {
        const expiration = moment().add(1, "hours");

        // Extract data from cache object if necessary
        if (_.isObject(data) && !_.isArray(data)) {
            data = data.data;
        }

        if (this.cache === "global") {
            const globalCache = new AppData("cache");
            return globalCache.set(this.name, {
                data: data,
                expiration: expiration.toISOString(),
            });
        } else if (this.cache === "user") {
            return new User(this.request.auth.username)
                .saveToCache(this.name, data, expiration)
                .catch((err) => {
                    throw new Error(`Failed to cache ${this.name} for user ` +
                                    `${this.request.auth.username}. ${err}`);
                });
        }
        return data;
    }

    /**
     * Test if data is expired
     * @param {object} data Contains key `expiration` with date in ISO 8601
     *     format, ex: {expiration: "2016-09-09T00:41:33+00:00"}
     * @return {boolean} True if data is expired, false otherwise
     */
    isExpired(data) {
        // If expiration is before current time, data is expired
        return new moment(data.expiration).isBefore();
    }
}
