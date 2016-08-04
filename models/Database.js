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
     * Get document from database
     * @param  {string} key _id of doc to get
     * @return {promise}     Resolved by doc object
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
     * Save document in database
     * @param {object} doc CouchDB document, containing _id and _rev
     * @return {Promise}   Fulfilled by inserted doc
     */
    save(doc) {
        return new Promise((resolve, reject) => {
            this.couch.insert(doc, (err, body) => {
                if (!err) {
                    resolve(body);
                } else {
                    reject(err);
                }
            });
        });
    }
}

module.exports = Database;
