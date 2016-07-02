const db = require("../helpers/db");

module.exports = {
    name: "meta",
    getter: db.get,
    location: "info",
    processor: (data) => data, // Pass data through
    cache: false,
    method: "get"
};
