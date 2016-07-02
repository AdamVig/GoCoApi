const fs = require("fs");
const restify = require("restify");

const config = require("./config");
const Endpoint = require("./helpers/Endpoint");
const utils = require("./helpers/utils");

// Check for existence of environment variables file
try {
    fs.accessSync("./vars.js", fs.F_OK);
} catch (e) {
    throw new Error("Could not start server: No vars file found. " +
        "Check README for instructions.");
}

const app = restify.createServer({
    name: config.APP_NAME
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

app.on("InternalServerError", (req, res, route, error) => {
    utils.handleError(req, res, "Internal Server", route.spec.path, error);
});
app.on("MethodNotAllowed", (req, res, error) => {
    utils.handleError(req, res, "Method Not Allowed", req.url, error);
});
app.on("uncaughtException", (req, res, route, error) => {
    utils.handleError(req, res, "Uncaught", route.spec.path, error);
});

// Get filenames of all routes (including filetype)
fs.readdirSync("./routes/")
    .filter((routeName) => {
        // Ignore filenames starting with an underscore
        return routeName.charAt(0) !== "_";
    })
    .map((routeName) => {
        // Pass app object to the endpoint function on the route
        const routeConfig = require(`./routes/${routeName}`);
        new Endpoint(app, routeConfig);
    });

app.listen(config.PORT, function() {
    console.log("%s listening at %s", app.name, app.url);
});
