const config = require("../config");
const vars = require("../vars");
const endpoint = require("../helpers/endpoint");
const Forecast = require("forecast.io-bluebird");

const routeTemperature = module.exports = {};

/**
 * Get weather forecast from Forecast API
 * @return {promise} Resolved by forecast response
 */
routeTemperature.getForecast = function () {
    const forecast = new Forecast({
        key: vars.forecastio.key,
        timeout: 2500
    });
    return forecast.fetch(config.COORDINATES.latitude,
        config.COORDINATES.longitude);
};

/**
 * Get temperature from forecast
 * @param  {forecast} forecast Response from forecast API
 * @return {number}            Current temperature in degrees Fahrenheit,
 *                             rounded to nearest degree
 */
routeTemperature.getTemperature = function (forecast) {
    return Math.round(forecast.currently.temperature);
};

routeTemperature.ENDPOINT = {
    name: "temperature",
    getter: routeTemperature.getForecast,
    location: "",
    processor: routeTemperature.getTemperature,
    cache: "global",
    method: "get"
};

routeTemperature.endpoint = (app) => {
    endpoint.make(app, routeTemperature.ENDPOINT);
};
