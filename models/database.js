const nano = require("nano");

/**
 * CouchDB database
 */
class Database {

    /**
     * Create a database.
     * @param {object} config Contains ssl, url, username, password, and
     *                        names of databases
     * @param {string} name Name of database to use
     */
    constructor(config, name) {
        const url = this.buildURL(config.ssl, config.username,
                             config.password, config.url);
        this.couch = nano(url).use(name);
        this.couch.info((err) => {
            if (err) {
                throw new Error(`Could not connect to ` +
                                `database ${name} at ${config.url}`)
            }
        });
    }

    /**
     * Build CouchDB instance URL
     * @param {boolean} ssl Use https:// if true, http:// otherwise
     * @param {string} username Database username
     * @param {string} password Database password
     * @param {string} url URL to CouchDB, ex: myapp.cloudant.com
     * @return {string} URL of CouchDB instance, including authentication
     *                  ex: https://user:password@myapp.cloudant.com/
     */
    buildURL(ssl, username, password, url) {
        username = encodeURIComponent(username);
        password = encodeURIComponent(password);
        const protocol = (ssl ? "https://" : "http://");

        return `${protocol}${username}:${password}@${url}`;
    }

    /**
     * Create document in database
     * @param {string} id Unique ID for document
     * @param {object} data Contents of document
     * @return {Promise} Fulfilled by object like the following:
     *     {data: {id: firstname.lastname, ok: true, rev: 1-longhash}}
     */
    create(id, data) {
        data._id = id;
        return this.save(data);
    }

    /**
     * Delete document in database
     * @param {string} id Unique ID for document
     * @return {Promise} Fulfilled by deleted doc object
     */
    delete(id) {
        return this.get(id)
            .then((doc) => {
                return this.destroy(id, doc._rev);
            });
    }

    /** Delete document at a certain rev in the database
     * @param {string} id Unique ID for document
     * @param {string} rev Revision hash of document
     * @return {Promise} Fulfilled by object like the following:
     *     {data: {id: firstname.lastname, ok: true, rev: 1-longhash}}
     */
    destroy(id, rev) {
        return new Promise((resolve, reject) => {
            this.couch.destroy(id, rev, (err, body) => {
                if (!err) {
                    resolve(body);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * Get document from database
     * @param  {string} key _id of doc to get
     * @return {Promise} Fulfilled by doc object
     */
    get(key) {
        return new Promise((resolve, reject) => {
            this.couch.get(key, (err, body) => {
                if (!err) {
                    resolve(body);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * Create or update document in database
     * Document will be updated, not created, if it contains the _rev field.
     * @param {object} doc CouchDB document, containing _id and optionally _rev
     * @return {Promise} Fulfilled by inserted doc
     */
    save(doc) {
        return new Promise((resolve, reject) => {
            if (doc._rev) {
                this.couch.insert(doc, (err, body) => {
                    if (!err) {
                        resolve(body);
                    } else {
                        reject(err);
                    }
                });
            } else {
                this.couch.insert(doc, (err, body) => {
                    if (!err) {
                        resolve(body);
                    } else {
                        reject(err);
                    }
                });
            }
        });
    }
}

module.exports = Database;
