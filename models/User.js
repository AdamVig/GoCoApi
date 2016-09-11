const Database = require("./database");
const Model = require("./model");
const vars = require("../vars");

/**
 * Document from the User database
 * @extends Model
 */
class User extends Model {
    /**
     * Create a new User instance
     * Uses the User database; name specified in `vars.couchDB.db`
     * @param {string} id ID of document in database
     */
    constructor(id) {
        super(new Database(vars.couchDB, vars.couchDB.db.users), id);
    }

    /**
     * Get data from cache by key
     * @param {string} key Key to get
     * @return {object} Contains data and expiration, ex: { data: 67,
     *     expiration: "2016-09-09T00:41:33+00:00" }
     */
    getFromCache(key) {
        return this.loadIfEmpty().then(() => {
            if (this.data.cache) {
                return this.data.cache[key];
            }
        });
    }

    /**
     * Add data to user cache
     * @param {string} key Key to store data under
     * @param {any} data Data to store
     * @param {Moment} expiration When data expires
     * @return {Promise} Fulfilled by results of `this.save()`
     */
    saveToCache(key, data, expiration) {
        return this.loadIfEmpty().then(() => {

            // Add cache property if does not exist
            if (!this.data.hasOwnProperty("cache")) {
                this.data.cache = {};
            }

            // Add data to user cache with expiration
            this.data.cache[key] = {
                data: data,
                expiration: expiration.toISOString(),
            };
            return this.save();
        });
    }

    /**
     * Create user in database
     * @param {string} name Unique ID of document
     * @param {object} data Document contents
     * @return {Promise} Fulfilled by object like the following:
     *     {data: {id: firstname.lastname, ok: true, rev: 1-longhash}}
     */
    static create(name, data) {
        return super.create(name, data, vars.couchDB.db.users);
    }
}

module.exports = User;
