const moment = require("moment");

const db = require("../helpers/db");

const routeDaysLeftInSemester = module.exports = {};

/**
 * Get days left in semester from info document
 * @param {object}  infoDoc Contains global app information
 * @return {number}         Number of days left in semester
 */
routeDaysLeftInSemester.getDaysLeftInSemester = function (infoDoc) {
    const endDate = moment(infoDoc.lastDayOfSemester, "MM/DD/YYYY");
    let daysLeft = endDate.diff(moment(), "days");

    // Correct negative numbers to zero
    if (daysLeft < 0) {
        daysLeft = 0;
    }

    return daysLeft;
};

routeDaysLeftInSemester.ENDPOINT = {
    name: "daysleftinsemester",
    getter: db.get,
    location: "info",
    processor: routeDaysLeftInSemester.getDaysLeftInSemester,
    cache: false,
    method: "get"
};
