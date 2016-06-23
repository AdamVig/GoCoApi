const db = require("../helpers/db");
const endpoint = require("../helpers/endpoint");

const routeMeta = module.exports = {};

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
