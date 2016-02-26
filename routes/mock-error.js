const config = require('../config.js');

module.exports = routeMockError = {};

// Returns a random integer between min (included) and max (excluded)
// From MDN reference on Math.random()
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

routeMockError.ENDPOINT = {
  name: "mockerror"
};

routeMockError.endpoint = (app) => {
    app.get(config.PREFIX + routeMockError.ENDPOINT.name,
            (req, res, next) => {

        const errorCodes = Object.keys(config.ERROR);
        const randomIndex = getRandomInt(0, errorCodes.length - 1);
        const errorCode = errorCodes[randomIndex];

        // Send response
        res.status(parseInt(errorCode, 10));
        res.send(config.ERROR[errorCode]);
    });
};
