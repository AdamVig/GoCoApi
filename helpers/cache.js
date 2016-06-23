const restify = require("restify");
const config = require("../config");
const db = require("./db");
const moment = require("moment");

const cache = module.exports = {};

/**
 * Get cache length for endpoint, either custom setting or default
 * @param {string} endpoint Name of endpoint
 * @return {string}         Date of expiration, ISO 8601 format
 */
function getExpiration(endpoint) {

    let cacheLength;

    if (config.CACHE_LENGTH[endpoint]) {
        cacheLength = config.CACHE_LENGTH[endpoint];
    } else {
        cacheLength = config.CACHE_LENGTH.default;
    }

    return moment().add(cacheLength).format();
}

/**
 * Cache user data
 * @param {string} username Username, firstname,lastname
 * @param {string} endpoint Name of endpoint, used as key in cache
 * @param {varies} data     Data to cache
 * @return {promise}        Resolved by body of CouchDB response
 */
function cacheUser(username, endpoint, data) {
    return db.get(username).then((userData) => {

        // Create cache object if does not exist
        if (!userData.cache) {
            userData.cache = {};
        }

        userData.cache[endpoint] = {
            data: data,
            expiration: getExpiration(endpoint)
        };

        return db.save(userData);
    });
}

/**
 * Cache global data relevant to all users
 * @param {string} endpoint Name of endpoint, used as key in cache
 * @param {varies} data     Data to cache
 * @return {promise}        Resolved by body of CouchDB response
 */
function cacheGlobal(endpoint, data) {
    return db.get(config.CACHE_DOC_NAME).then((dataCache) => {

        dataCache[endpoint] = {
            data: data,
            expiration: getExpiration(endpoint)
        };

        return db.save(dataCache);
    });
}

/**
 * Cache data
 * @param  {varies} data      Data to cache
 * @param  {string} endpoint  Name of endpoint, used as key in cache
 * @param  {string} cacheType Either "user" or "global"
 * @param  {object} username  Firstname.Lastname (optional, only
 *                            needed when cacheType = "user")
 * @return {promise}          Resolved by body of CouchDB response
 */
cache.cacheData = function (data, endpoint, cacheType, username) {
    if (cacheType == "user") {
        return cacheUser(username, endpoint, data);
    } else if (cacheType == "global") {
        // DISABLED UNTIL SWITCHING TO THIS API
        // Will overwrite global cache used by current API
        //return cacheGlobal(endpoint, data);
    } else {
        throw new restify.InternalServerError(
            `Unrecognized cache type: ${cacheType}`);
    }
};

/**
 * Check if a date is in the future
 * @param {string} date Date in ISO 8601 format
 * @return {boolean}    True if date is in future, false if date is
 *                      equal to current time or in the past
 */
function isFuture(date) {
    if (moment().isBefore(moment(date))) {
        return true;
    } else {
        return false;
    }
}

/**
 * Check cached data exists and is not expired
 * @param {object} cacheData Either global or user cache; may contain
 *                           cached data from each endpoint
 * @param {string} endpoint  Name of endpoint
 * @return {boolean}         True if data exists and is not expired
 */
function isFresh(cacheData, endpoint) {
    // If cached data for endpoint, check if expired
    if (cacheData && cacheData[endpoint]) {
        return isFuture(cacheData[endpoint].expiration);

    // No cached data for endpoint
    } else {
        return false;
    }
}

/**
 * Get cached data
 * @param  {string} endpoint  Name of endpoint, used as key in cache
 * @param  {string} cacheType Either "user" or "global"
 * @param  {object} username  Firstname.Lastname (optional, only
 *                            needed when cacheType = "user")
 * @return {object/boolean}   False if data is expired or not cached,
 *                            otherwise cached data
 */
cache.getData = function (endpoint, cacheType, username) {
    if (cacheType === "user") {
        return db.get(username).then((userData) => {
            if (isFresh(userData.cache, endpoint)) {
                return userData.cache[endpoint];
            } else {
                return false;
            }
        });
    } else if (cacheType === "global") {
        return db.get(config.CACHE_DOC_NAME).then((globalCache) => {
            if (isFresh) {
                return globalCache[endpoint];
            } else {
                return false;
            }
        });
    } else {
        throw new restify.InternalServerError(
            `Unrecognized cache type: ${cacheType}`);
    }
};
