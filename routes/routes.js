const Endpoint = require("./Endpoint");

const routes = module.exports = {};

// Filenames of enabled routes without extensions
routes.enabled = [
    "athletics-schedule",
    "chapel-credits",
    "chapel-events",
    "check-login",
    "days-left-in-semester",
    "highland-express",
    "meal-points-per-day",
    "meal-points",
    "meta",
    "mock-error",
    "next-meal",
    "student-id",
    "temperature"
];

/**
 * Create all enabled routes on the app object
 * @param {Restify} app The app
 */
routes.create = (app) => {
    routes.enabled.forEach((endpoint) => {
        new Endpoint(app, require(`./${endpoint}`));
    });
};
