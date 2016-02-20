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

require('./routes/chapel-credits.js')(app);
require('./routes/athletics-schedule.js')(app);
require('./routes/chapel-events.js')(app);
require('./routes/check-login.js')(app);
require('./routes/days-left-in-semester.js')(app);
require('./routes/highland-express.js')(app);
require('./routes/mock-error.js')(app);
require('./routes/next-meal.js')(app);
require('./routes/student-id.js')(app);
require('./routes/temperature.js')(app);

app.listen(8080, function() {
    console.log('%s listening at %s', app.name, app.url);
});
