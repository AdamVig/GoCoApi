// Dependencies are in order based on dependency on each other
const vars = require("../vars");

// Build database URL, encoding parts that could have illegal chars
const protocol = vars.db.ssl ? "https://" : "http://";
const dbURL = `${protocol}${encodeURIComponent(vars.db.user)}:` +
          `${encodeURIComponent(vars.db.password)}@${vars.db.url}`;

const nano = require("nano")(dbURL);
const couch = nano.use(vars.db.name);

const db = module.exports = {};

/**
 * Get document from database
 * @param  {string} key _id of doc to get
 * @return {promise}     Resolved by doc object
 */
db.get = function (key) {
    return new Promise((resolve, reject) => {
        couch.get(key, (err, body) => {
            if (!err) {
                resolve(body);
            } else {
                reject(err);
            }
        });
    });
};

/**
 * Save document in database
 * @param {object} doc CouchDB document, containing _id and _rev
 * @return {Promise}   Fulfilled by inserted doc
 */
db.save = function (doc) {
    return new Promise((resolve, reject) => {
        couch.insert(doc, (err, body) => {
            if (!err) {
                resolve(body);
            } else {
                reject(err);
            }
        });
    });
};
