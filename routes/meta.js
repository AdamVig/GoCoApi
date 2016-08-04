const AppData = require("../models/app-data");
const Endpoint = require("./endpoint");

module.exports = class Meta extends Endpoint {
    constructor(app) {
        super(app, {
            name: "meta",
            model: new AppData("info"),
            cache: false,
            method: "get"
        });
    }

    /**
     * Pass data through
     * TODO remove the need to define a no-op function here
     * @param {object} data Data from getter
     * @return {object} Data from getter
     */
    processor(data) {
        return data;
    }
}
