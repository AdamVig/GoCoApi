const Forecast = require("forecast.io-bluebird");

const config = require("../config");
const Endpoint = require("./endpoint");
const vars = require("../vars");

module.exports = class Temperature extends Endpoint {
    constructor(app) {
        super(app, {
            name: "temperature",
            location: "",
            cache: "global",
            method: "get"
        });
    }

    /**
     * Get weather forecast from Forecast API
     * @return {promise} Resolved by forecast response
     */
    getter() {
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
    processor(forecast) {
        return Math.round(forecast.currently.temperature);
    }
}
