const fs = require("fs");
const restify = require("restify");

const config = require("./config");
const log = require("./helpers/log");
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
const app = restify.createServer({
    log: log,
    name: config.APP_NAME,
    version: npmConfig.version,
});

// Log every incoming request
app.pre((req, res, next) => {
  req.log.info({req}, 'start')
  return next()
})

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
    utils.handleError(req, res, "Internal Server", route, error);
});
app.on("uncaughtException", (req, res, route, error) => {
    utils.handleError(req, res, "Uncaught", route, error);
});

// Load all enabled routes
require("./routes/routes").create(app);

app.listen(config.PORT, () => {
    log.info("%s listening at %s", app.name, app.url);
});
