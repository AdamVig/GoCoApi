const vars = require('../vars');
const nano = require('nano')("https://" + vars.db.user + ":" +
        vars.db.password + "@" + vars.db.url);

const couch = nano.use(vars.db.name);

module.exports = db = {};

/**
 * Get document from database
 * @param  {string} key _id of doc to get
 * @return {promise}     Resolved by doc object
 */
db.get = function (key) {
    return new Promise((resolve, reject) => {
        couch.get(key, (err, body)  => {
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
