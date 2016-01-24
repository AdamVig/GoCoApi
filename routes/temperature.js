const config = require('../config');
const utils = require('../utils');
const endpoint = require('../endpoint');
const vars = require('../vars');
const Forecast = require('forecast.io-bluebird');

const ENDPOINT = {
    name: "temperature",
    getter: getForecast,
    location: "",
    processor: getTemperature,
    cache: "global"
};

module.exports = (app) => {
    endpoint.make(app, ENDPOINT);
};

/**
 * Get weather forecast from Forecast API
 * @return {promise} Resolved by forecast response
 */
function getForecast() {
    const forecast = new Forecast({
        key: vars.forecastio.key,
        timeout: 2500
    });
    return forecast.fetch(config.COORDINATES.latitude,
        config.COORDINATES.longitude);
}

/**
 * Get temperature from forecast
 * @param  {forecast} forecast Response from forecast API
 * @return {number}            Current temperature in degrees Fahrenheit,
 *                             rounded to nearest degree
 */
function getTemperature(forecast) {
    return Math.round(forecast.currently.temperature);
}
