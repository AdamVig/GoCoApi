const endpoint = require('../helpers/endpoint');
const db = require('../helpers/db');

module.exports = routeMeta = {};

routeMeta.ENDPOINT = {
    name: "meta",
    getter: db.get,
    location: "info",
    processor: (data) => data, // Pass data through
    cache: false,
    method: "get"
};

routeMeta.endpoint = (app) => {
    endpoint.make(app, routeMeta.ENDPOINT);
};