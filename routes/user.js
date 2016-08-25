const restify = require("restify");

const Endpoint = require("./endpoint");
const User = require("../models/user");
const utils = require("../helpers/utils");

module.exports = class UserRoute extends Endpoint {
    constructor(app) {
        super(app, {
            name: "user/:name",
        });
    }

    create(app) {
        // Get user
        app.get(this.name, (req, res, next) => {
            // Throw error if username not provided
            if (!req.params.name) {
                throw new restify.UnprocessableEntityError("Missing username.");
            }
            new User(req.params.name).get().then((userData) => {
                res.send({data: userData});
            }).catch(() => {
                // Throw error if getting user from database fails
                utils.handleError(req, res, "Endpoint",
                                  this.name,
                                  new restify.NotFoundError(
                                      "User does not exist."));
            }).then(next);
        });

        // Create user
        app.post(this.name, (req, res, next) => {
            // Throw error if username not provided
            if (!req.params.name) {
                throw new restify.UnprocessableEntityError("Missing username.");
            }
            const userData = req.params.data || {};
            User.create(req.params.name, userData).then((metaData) => {
                res.send({data: metaData});
            }).catch((err) => {
                utils.handleError(req, res, "Endpoint", this.name, err);
            }).then(next);
        });

        // Delete user
        app.del(this.name, (req, res, next) => {
            // Throw error if username not provided
            if (!req.params.name) {
                throw new restify.UnprocessableEntityError("Missing username.");
            }
            new User(req.params.name).delete().then((metaData) => {
                res.send({data: metaData});
            }).catch((err) => {
                utils.handleError(req, res, "Endpoint", this.name, err);
            }).then(next);
        });

        // Update user
        app.put(this.name, (req, res, next) => {
            // Throw errors if missing necessary data
            if (!req.params.name) {
                throw new restify.UnprocessableEntityError("Missing username.");
            } else if (!req.params.data) {
                throw new restify.UnprocessableEntityError("Missing data.");
            } else if (!req.params.data._rev) {
                throw new restify.UnprocessableEntityError(
                    "Missing revision field.");
            }
            // Add _id field if missing
            if (!req.params.data._id) {
                req.params.data._id = req.params.name;
            }
            new User(req.params.name).save(req.params.data).then((metaData) => {
                res.send({data: metaData});
            }).catch((err) => {
                utils.handleError(req, res, "Endpoint", this.name, err);
            }).then(next);
        });
    }
};
