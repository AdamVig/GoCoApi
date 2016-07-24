const chalk = require("chalk");
const fs = require("fs");
const loadtest = require("loadtest");
const yargs = require("yargs");
const vars = require("../vars");

yargs.usage("$0 [args]")
    .option("requests", {
        alias: "r",
        describe: "How many requests to make total, default: 10"
    })
    .option("concurrency", {
        alias: "c",
        describe: "How many requests to make at a time, default: 5"
    })
    .help("help");


const version = "2.7.0";
const options = {
    body: {
        username: vars.test.username,
        password: new Buffer(vars.test.password)
            .toString("base64")
    },
    concurrency: yargs.argv.c || yargs.argv.concurrency || 5,
    contentType: "application/json",
    maxRequests: yargs.argv.r || yargs.argv.requests || 10,
    method: "POST",
    timeout: 20000 // 20 seconds
};

/**
 * Print the result of a load test to the console
 * @param {hash} test Contains totalRequests, totalErrors, totalTimeSeconds,
 *                    rps, meanLatencyMs, maxLatencyMs, minLatencyMs,
 *                    percentiles, errorCodes (hash of
 *                    error codes: occurrences)
 */
function printLoadTest(test) {

    // Round seconds to two decimal places
    const sec = test.totalTimeSeconds.toFixed(2);

    // Build error description if errors occured
    let err = "";
    if (test.totalErrors > 0) {
        err = ` with ${test.totalErrors} errors`;
    }

    console.log(`Made ${chalk.bold.blue(test.totalRequests + " requests")} ` +
                `in ${chalk.cyan(sec + " seconds")}${chalk.red(err)}.`);
    console.log(`LATENCY min: ${chalk.green(test.minLatencyMs + "ms")} ` +
                `/ mean: ${chalk.yellow(test.meanLatencyMs + "ms")} ` +
                `/ max: ${chalk.red(test.maxLatencyMs + "ms")}`);

    if (Object.keys(test.errorCodes).length > 0) {
        console.log("Error Codes:", test.errorCodes);
    }

    console.log("----------------------------------");
}

/**
 * Run load test on a route
 * @param {hash} endpoint Contains name, method, and other endpoint config
 */
function testRoute(endpoint) {
    const url = `/${version}/${endpoint.name}`;

    options.url = vars.server.url + url;

    if (endpoint.method) {
        options.method = endpoint.method.toUpperCase();
    } else {
        options.method = "POST";
    }

    loadtest.loadTest(options, (error, result) => {
        if (error) {
            console.error("Error running load test:", error);
        } else {
            console.log(chalk.bold.underline(endpoint.name));
            printLoadTest(result);
        }
    });
}

/**
 * Test all enabled routes
 */
function testAllRoutes() {
    // Get filenames of all routes (including filetype)
    fs.readdirSync("./routes/")
        .filter((routeName) => {
            // Ignore filenames starting with an underscore
            return routeName.charAt(0) !== "_";
        })
        .map((routeName) => {
            // Get endpoint configuration from file
            const endpoint = require(`../routes/${routeName}`);
            return testRoute(endpoint);
        });
}

testAllRoutes();
