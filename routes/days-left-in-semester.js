const endpoint = require('../helpers/endpoint');
const db = require('../helpers/db');
const moment = require('moment');

module.exports = routeDaysLeftInSemester = {};

/**
 * Get days left in semester from info document
 * @param {object}  infoDoc Contains global app information
 * @return {number}         Number of days left in semester
 */
routeDaysLeftInSemester.getDaysLeftInSemester = function (infoDoc) {
    const endDate = moment(infoDoc.lastDayOfSemester, "MM/DD/YYYY");
    const daysLeft = endDate.diff(moment(), "days");
    return daysLeft;
};

const ENDPOINT = {
    name: "daysleftinsemester",
    getter: db.get,
    location: "info",
    processor: routeDaysLeftInSemester.getDaysLeftInSemester,
    cache: false
};

routeDaysLeftInSemester.endpoint = (app) => {
    endpoint.make(app, ENDPOINT);
};
