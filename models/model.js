const restify = require("restify");

const Database = require("./database");
const vars = require("../vars");

/**
 *  Model in a Database
 */
class Model {

    /**
     * Create a Model
     * @param {Database} database A database
     * @param {string} id Document id in database
     */
    constructor(database, id) {
        this.db = database;
        this.id = id;
        this.data = null;
    }

    /**
     * Delete document from database
     * @return {Promise} Fulfilled by object like the following:
     *     {data: {id: firstname.lastname, ok: true, rev: 1-longhash}}
     */
    delete() {
        return this.db.delete(this.id);
    }


    /**
     * Load data from database, store in `this.data`
     * If a load() is already in progress, return that; otherwise load from DB
     * @return {Promise} Fulfilled by model data
     */
    load() {
        if (!this.loadInProgress) {
            return this.loadInProgress = this.db.get(this.id)
                .then((body) => {
                    this.data = body;
                    this.loadInProgress = false;
                });
        } else {
            return this.loadInProgress;
        }
    }

    /**
     * Load model data if it has not been loaded yet
     * @return {Promise} Fulfilled by model data
     */
    loadIfEmpty() {
        if (!this.data) {
            return this.load();
        } else {
            return Promise.resolve(this.data);
        }
    }

    /**
     * Save data
     * @param {object} data (optional) Model data, can be passed if data is
     *                      modified outside of class
     * @return {Promise} Fulfilled by updated model data with latest `_rev`
     */
    save(data = this.data) {
        return this.db.save(data)
            .then(() => {
                return this.db.get(this.id);
            })
            .then(newData => this.data = newData)
            .catch((err) => {
                if (err.statusCode === 409) {
                    throw new restify.ConflictError(
                        `Document update conflict on ` +
                        `${this.db.couch.config.db}/${this.id}.`);
                } else {
                    throw err;
                }
            });
    }

    /**
     * Get value, loading model first if necessary
     * @param {string} key (optional) A key in `this.data`
     * @return {Promise} Fulfilled by value associated with key,
     *                   false if key does not exist, or
     *                   full model data if key is not provided
     */
    get(key) {
        return this.loadIfEmpty().then(() => {
            if (key) {
                return this.data[key] || false;
            } else {
                return this.data;
            }
        }).catch((err) => { throw err; });
    }

    /**
     * Set key to a value, loading model first if necessary and saving to
     * database when done
     * @param {string} key A key in `this.data`
     * @param {any} value Value to set
     * @return {Promise} Fulfilled by updated data
     */
    set(key, value) {
        return this.loadIfEmpty().then(() => {
            this.data[key] = value;
            return this.save();
        });
    }

    /**
     * Create document in database
     * @param {string} id Unique ID of document
     * @param {object} data Document contents
     * @param {string} dbName Name of database to use
     * @return {Promise} Fulfilled by object like the following:
     *     {data: {id: firstname.lastname, ok: true, rev: 1-longhash}}
     */
    static create(id, data, dbName) {
        return new Database(vars.couchDB, dbName)
            .create(id, data)
            .catch((err) => {
                if (err.error === "conflict") {
                    throw new restify.ConflictError(
                        `Document ${id} already exists.`);
                } else {
                    throw err;
                }
            });
    }
}

module.exports = Model;
