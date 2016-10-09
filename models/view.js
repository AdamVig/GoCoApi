const Database = require("./database");
const vars = require("../vars");

class View {
    /**
     * Create a database view
     * @param {string} id _id of design doc to get
     * @param {string} viewName Name of view to get
     * @param {object} params Parameters to pass with view request
     */
    constructor(id, viewName, params = {}) {
        this.db = new Database(vars.couchDB, vars.couchDB.db.users);
        this.id = id;
        this.viewName = viewName;
        this.params = params;
    }

    /**
     * Get view from database
     * @return {Promise.<Object>} Fulfilled by result of view
     */
    get() {
        return this.db.view(this.id, this.viewName, this.params);
    }
}

module.exports = View;
