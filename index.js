const config = require('./config');
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

require('./routes/chapel-credits.js')(app);

app.on('InternalServerError', (req, res, route, error) => {
    console.log("ERROR");
});

app.on('uncaughtException', (req, res, route, error) => {
    console.log("Error in %s: %s", route.spec.path, error);
});

app.listen(8080, function() {
    console.log('%s listening at %s', app.name, app.url);
});
