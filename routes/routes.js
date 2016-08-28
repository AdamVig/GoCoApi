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
    "message",
    "meta",
    "mock-error",
    "next-meal",
    "student-id",
    "temperature",
    "user",
];

/**
 * Create all enabled routes on the app object
 * @param {Restify} app The app
 */
routes.create = (app) => {
    routes.enabled.forEach((endpoint) => {
        const thisEndpoint = require(`./${endpoint}`);
        new thisEndpoint(app);
    });
};
