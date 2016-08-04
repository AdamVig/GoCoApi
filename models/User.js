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
     * Add data to user cache
     * @param {string} key Key to store data under
     * @param {any} data Data to store
     * @return {Promise} Fulfilled by results of `this.save()`
     */
    cache(key, data) {
        return this.loadIfEmpty().then((userData) => {

            // Add cache property if does not exist
            if (!userData.hasOwnKey("cache")) {
                userData.cache = {};
            }

            userData.cache[key] = data;
            return this.save(userData);
        });
    }
}

module.exports = User;
