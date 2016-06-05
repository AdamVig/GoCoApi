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

// Import files for all enabled routes
for (var i = 0; i < config.ROUTES.length; i++) {
    var routeName = config.ROUTES[i];

    // Pass app object to the endpoint function on the route
    require(`./routes/${routeName}.js`).endpoint(app);
}

app.listen(config.PORT, function() {
    console.log('%s listening at %s', app.name, app.url);
});
