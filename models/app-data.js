const Database = require("./database");
const Model = require("./model");
const vars = require("../vars");

/**
 * Represents a document from the Info database
 * @extends Model
 */
class AppData extends Model {
    /**
     * Create a new Info instance
     * Uses the Info database; name specified in `vars.couchDB.db`
     * @param {string} id ID of document in database
     */
    constructor(id) {
        super(new Database(vars.couchDB, vars.couchDB.db.info), id);
    }
}

module.exports = AppData;
