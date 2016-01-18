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

app.on('InternalServerError', utils.handleError);
app.on('uncaughtException', utils.handleError);

require('./routes/chapel-credits.js')(app);

app.listen(8080, function() {
    console.log('%s listening at %s', app.name, app.url);
});
