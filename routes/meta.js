const AppData = require("../models/AppData");

module.exports = {
    name: "meta",
    model: new AppData("info"),
    processor: (data) => data, // Pass data through
    cache: false,
    method: "get"
};
