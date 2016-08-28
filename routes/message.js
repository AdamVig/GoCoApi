const restify = require("restify");

const AppData = require("../models/app-data");
const Endpoint = require("./endpoint");
const utils = require("../helpers/utils");

/**
 * Message endpoint
 * @extends Endpoint
 */
module.exports = class Message extends Endpoint {
    constructor(app) {
        super(app, {
            name: "message",
            model: new AppData("message"),
            method: "get"
        });
    }

    /**
     * Register a PUT method for this endpoint on the app
     * @override Endpoint.create
     * @param {restify} app Restify server
     */
    create(app) {
        super.create(app);

        // Update message
        app.put(this.name, (req, res, next) => {
            if (!req.params.data) {
                throw new restify.UnprocessableEntityError("Missing data.");
            }
            new AppData("message").save(req.params.data).then((data) => {
                res.send({data: data});
            }).catch((err) => {
                utils.handleError(req, res, "Endpoint", this.name, err);
            }).then(next);
        });
    }

    /**
     * Pass data through without changing it
     * @param {object} message Message from database
     * @return {Promise} Fulfilled by message from database
     */
    processor(message) {
        return Promise.resolve(message);
    }
};
