const Bunyan = require('bunyan');
const fs = require("fs");
const restify = require("restify");

const config = require("./config");
const npmConfig  = require("./package.json");
const utils = require("./helpers/utils");

// Check for existence of environment variables file
try {
    fs.accessSync("./vars.js", fs.F_OK);
} catch (e) {
    throw new Error('Could not start server: No vars file found. ' +
              'Check README for instructions.');
}
const vars = require("./vars.js");
const log = new Bunyan({
    name: config.APP_NAME,
    serializers: restify.bunyan.serializers,
    streams: [{
        type: 'rotating-file',
        path: vars.logFileName,
        period: '1d',   // daily rotation
        count: 3,        // keep 3 back copies
        level: "debug",
    },],
});

const app = restify.createServer({
    log: log,
    name: config.APP_NAME,
    version: npmConfig.version,
});

// Add CORS headers to all responses
// Send back CORS headers set in the request,
// otherwise use preset values for the headers
app.use(function corsHandler(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers",
               req.headers["access-control-request-headers"] ||
               "Accept, Content-Type");
    res.header("Access-Control-Allow-Methods",
               req.headers["access-control-request-method"] ||
               "POST, GET, PUT, DELETE, OPTIONS");

    next();
});

app.use(restify.bodyParser());
app.use(restify.queryParser());

app.on("InternalServerError", (req, res, route, error) => {
    utils.handleError(req, res, "Internal Server", route.spec.path, error);
});
app.on("MethodNotAllowed", (req, res, error) => {
    utils.handleError(req, res, "Method Not Allowed", req.url, error);
});
app.on("uncaughtException", (req, res, route, error) => {
    utils.handleError(req, res, "Uncaught", route.spec.path, error);
});

// Load all enabled routes
require("./routes/routes").create(app);

app.listen(config.PORT, () => {
    log.info("%s listening at %s", app.name, app.url);
});
