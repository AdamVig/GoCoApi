const endpoint = require('../helpers/endpoint');
const db = require('../helpers/db');
const moment = require('moment');

const ENDPOINT = {
    name: "highlandexpress",
    getter: db.get,
    location: "highlandexpress",
    processor: processHighlandExpress,
    cache: false
};

module.exports = (app) => {
    endpoint.make(app, ENDPOINT);
};

/**
 * Add data to Highland Express doc
 * @param  {object} highlandExpressDoc Contains announcement and schedule
 * @return {object}                    Contains announcement, day, days, and schedule
 */
function processHighlandExpress(highlandExpressDoc) {

    const weekdayNum = moment().day(); // Sunday = 0, Saturday = 6

    // Add key of today's schedule
    if (weekdayNum < 0 && weekdayNum < 5) {
        highlandExpressDoc.day = "weekday";
    } else {
        highlandExpressDoc.day = moment().format("dddd").toLowerCase();
    }

    // Add list of schedule keys
    highlandExpressDoc.days = Object.keys(highlandExpressDoc.schedule);

    return highlandExpressDoc;
}