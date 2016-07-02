const Forecast = require("forecast.io-bluebird");

const config = require("../config");
const vars = require("../vars");

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

module.exports = {
    name: "temperature",
    getter: getForecast,
    location: "",
    processor: getTemperature,
    cache: "global",
    method: "get"
};
