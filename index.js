const config = require('./config');
const utils = require('./utils');
const responseFormatter = require('./response-formatter');
const restify = require('restify');

const app = restify.createServer({
    name: config.APP_NAME,
    formatters: {
        "application/json": responseFormatter
    }
});

app.use(restify.CORS());
app.use(restify.bodyParser());

app.on('InternalServerError', (req, res, route, error) => {
    utils.handleError(req, res, route.spec.path, error);
});
app.on('uncaughtException', (req, res, route, error) => {
    utils.handleError(req, res, route.spec.path, error);
});

require('./routes/chapel-credits.js')(app);

app.listen(8080, function() {
    console.log('%s listening at %s', app.name, app.url);
});
