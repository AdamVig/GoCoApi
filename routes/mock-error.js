const restify = require('restify');
const config = require('../config.js');

module.exports = routeMockError = {};

// Returns a random integer between min (included) and max (excluded)
// From MDN reference on Math.random()
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Get error codes from configuration
 * Note: this method is not async, but returns a Promise because
 *       endpoint.make() expects it to
 * @return {promise} Resolves to array containing error codes as numbers
 */
routeMockError.getErrorCodes = function () {
    return Promise.resolve(Object.keys(config.ERROR)
                               .map((code) => parseInt(code, 10)));
};

/**
 * Pick a random error
 * Note: this method is not async, but returns a Promise because
 *       endpoint.make() expects it to
 * @param {array} errorCodes Contains error codes as numbers
 * @return {promise}         Rejects with random error
 */
routeMockError.pickRandomError = function (errorCodes) {
    const randomIndex = getRandomInt(0, errorCodes.length - 1);
    const errorCode = errorCodes[randomIndex];
    const error = restify.errors.codeToHttpError(errorCode);
    error.message = error.body.message = "This is a random error message.";

    return Promise.reject(error);
};

routeMockError.ENDPOINT = {
    getter: routeMockError.getErrorCodes,
    method: "get",
    name: "mockerror",
    processor: routeMockError.pickRandomError
};

routeMockError.endpoint = (app) => {
    endpoint.make(app, routeMockError.ENDPOINT);
};
