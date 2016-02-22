const config = require('./config');
const utils = require('./helpers/utils');
const responseFormatter = require('./helpers/response-formatter');
const fs = require('fs');
const restify = require('restify');

// Check for existence of environment variables file
try {
    fs.accessSync("./vars.js", fs.F_OK);
} catch (e) {
    throw new Error("Could not start server: No vars file found. " +
        "Check README for instructions.");
}

const app = restify.createServer({
    name: config.APP_NAME,
    formatters: {
        "application/json": responseFormatter
    }
});

app.use(restify.CORS());
app.use(restify.bodyParser());

app.on('InternalServerError', (req, res, route, error) => {
    utils.handleError(req, res, "Internal Server", route.spec.path, error);
});
app.on('uncaughtException', (req, res, route, error) => {
    utils.handleError(req, res, "Uncaught", route.spec.path, error);
});

// Names of files for enabled routes
const enabledRoutes = [
    "athletics-schedule",
    "chapel-credits",
    "chapel-events",
    "check-login",
    "days-left-in-semester",
    "highland-express",
    "meal-points",
    "mock-error",
    "next-meal",
    "student-id",
    "temperature"
];

// Import files for all enabled routes
for (var i = 0; i < enabledRoutes.length; i++) {
    var routeName = enabledRoutes[i];

    // Pass app object to the endpoint function on the route
    require(`./routes/${routeName}.js`).endpoint(app);
}

app.listen(8080, function() {
    console.log('%s listening at %s', app.name, app.url);
});
