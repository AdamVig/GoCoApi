const db = require("../helpers/db");

const routeMeta = module.exports = {};

routeMeta.ENDPOINT = {
    name: "meta",
    getter: db.get,
    location: "info",
    processor: (data) => data, // Pass data through
    cache: false,
    method: "get"
};
