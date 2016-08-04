const moment = require("moment");

const AppData = require("../models/app-data");
const Endpoint = require("./endpoint");

module.exports = class HighlandExpress extends Endpoint {
    constructor(app) {
        super(app, {
            name: "highlandexpress",
            model: new AppData("highlandexpress"),
            cache: false,
            method: "get"
        });
    }

    /**
     * Add data to Highland Express doc
     * @param  {object} highlandExpressDoc Contains announcement and schedule
     * @return {object}                    Contains announcement, day, days,
     *                                     and schedule
     */
    processor(highlandExpressDoc) {

        const weekdayNum = moment().day(); // Sunday = 0, Saturday = 6

        // Add key of today"s schedule
        if (weekdayNum < 0 && weekdayNum < 5) {
            highlandExpressDoc.day = "weekday";
        } else {
            highlandExpressDoc.day = moment().format("dddd").toLowerCase();
        }

        // Add list of schedule keys
        highlandExpressDoc.days = Object.keys(highlandExpressDoc.schedule);

        return highlandExpressDoc;
    }
}
