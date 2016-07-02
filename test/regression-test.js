const vars = require("../vars");
const config = require("../config");
const fs = require("fs");
const restify = require("restify");

const version = "2.7.0";
const timeout = 20000; // 20 seconds
const client = restify.createJsonClient({
    version: "*",
    url: `http://localhost:${config.PORT}`,
    requestTimeout: timeout
});

/**
 * Test a route for a 200 response
 * @param {hash} endpoint Contains lowercase name of endpoint,
 *                        data type to get,
 *                        location of data to get,
 *                        processor function to extract/transform data,
 *                        and cache settings (user, global, or false)
 */
function testRoute(endpoint) {
    it("should get a 200 response", (done) => {

        // Set test-specific timeout
        setTimeout(done, timeout);

        // Remove dashes from route name and build URL
        const url = `/${version}/${endpoint.name}`;

        // Construct request body with encoded password
        const body = {
            username: vars.test.username,
            password: new Buffer(vars.test.password)
                .toString("base64")
        };

        /**
         * Handle response
         * @param {restify.HttpError|restify.RestError} err When status >= 400,
         * will be RestError when data has keys "code" and "message"
         * @param {http.ClientRequest} req Request
         * @param {http.IncomingMessage} res Response
         * @param {hash} data JSON payload, if exists
         */
        function resHandler(err, req, res, data) {
            // Handle intentional errors from mock-error endpoint
            if (err && endpoint.name !== "mockerror") {
                throw new Error(err);

            // Print data if simple
            } else if (typeof data.data !== "undefined" &&
                       typeof data.data !== "object") {
                console.log("Received the following data:", data.data);

            // Print only type of data
            } else {
                console.log(`Received ${typeof data} ` +
                            `containing keys: ${Object.keys(data)}.`);
            }

            done();
        }

        // Make request, using specified method or defaulting to POST
        if (endpoint.method === "get") {
            client.get(url, resHandler);
        } else {
            client.post(url, body, resHandler);
        }
    });
}

// Test all enabled routes
// Get filenames of all routes (including filetype)
fs.readdirSync("./routes/")
    .filter((routeName) => {
        // Ignore filenames starting with an underscore
        return routeName.charAt(0) !== "_";
    })
    .map((routeName) => {

        // Get endpoint configuration from file
        const endpoint = require(`../routes/${routeName}`);

        // testRoute() must be wrapped in a function call to use endpoint
        return describe(endpoint.name, () => { testRoute(endpoint); });
    });
