const vars = require('../vars');
const config = require('../config');
const restify = require('restify');
const assert = require('assert');

const version = "2.7.0";
const timeout = 20000; // 20 seconds
const client = restify.createJsonClient({
    version: '*',
    url: 'http://127.0.0.1:8080',
    requestTimeout: timeout
});

/**
 * Test a route for a 200 response
 */
function testRoute() {
    it('should get a 200 response', function(done) {

        this.timeout(timeout);

        // Remove dashes from route name and build URL
        const endpoint = routeName.split("-").join("");
        const url = `/api/${version}/${endpoint}`;

        // Construct request body with encoded password
        const body = {
            username: vars.test.username,
            password: new Buffer(vars.test.password)
                .toString('base64')
        };

        client.post(url, body, function(err, req, res, data) {

            // Ignore errors from mock-error endpoint
            if (err && routeName != "mock-error") {
                throw new Error(err);
            } else if (typeof data.data != "object") {
                console.log(data.data); // Print data if simple
            }

            done();
        });
    });
}

var routeName;

// Test all enabled routes
for (var i = 0; i < config.ROUTES.length; i++) {
    routeName = config.ROUTES[i];
    describe(routeName, testRoute);
}
