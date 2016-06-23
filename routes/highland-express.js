const endpoint = require("../helpers/endpoint");
const db = require("../helpers/db");
const moment = require("moment");

const routeHighlandExpress = module.exports = {};

/**
 * Add data to Highland Express doc
 * @param  {object} highlandExpressDoc Contains announcement and schedule
 * @return {object}                    Contains announcement, day, days, and schedule
 */
routeHighlandExpress.processHighlandExpress = function (highlandExpressDoc) {

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
};

routeHighlandExpress.ENDPOINT = {
    name: "highlandexpress",
    getter: db.get,
    location: "highlandexpress",
    processor: routeHighlandExpress.processHighlandExpress,
    cache: false,
    method: "get"
};

routeHighlandExpress.endpoint = (app) => {
    endpoint.make(app, routeHighlandExpress.ENDPOINT);
};
