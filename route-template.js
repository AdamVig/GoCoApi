const endpoint = require('../helpers/endpoint');

modules.exports = routeName = {};

/**
 * Get the endpoint's data
 * @param {string} location Where to get the data from
 * @param {hash}   auth     Contains username and password in plaintext
 * @return {promise}        Will return data
 */
routeName.getter = function (location, auth) {
    return null;
};

/**
 * Process the data into a format suitable for the endpoint's response
 * @param {varies} data Data from getter function
 * @return {varies} Processed data
 */
routeName.processor = function (data) {
    return data;
};


routeName.ENDPOINT = {

    /**
     * Name of route, all lowercase, used for URL definition
     */
    name: "routename",

    /**
     * Function that retrieves data, returns promise
     * @param {string} location (see comment on "location" property below)
     * @param {hash}   auth     Contains username and password in plaintext
     * @return {promise} Will return data
     */
    getter: routeName.getter,

    /**
     * Location of data, first parameter passed to getter
     * Likely to be a full URL, partial URL, or database document ID
     */
    location: "",

    /**
     * Function that transforms data into the correct format
     * @param {varies} data Data retrieved by getter
     * @return {varies} Transformed data
     */
    processor: routeName.processor,

    /**
     * Possible Values:
     * "user" (data is specific to user)
     * "global" (data is applicable to all users)
     * false (do not cache)
     */
    cache: "global"
};

/**
 * Register the endpoint with Restify
 */
routeName.endpoint = (app) => {
    endpoint.make(app, routeName.ENDPOINT);
};
