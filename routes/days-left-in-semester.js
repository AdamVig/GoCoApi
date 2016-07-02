const moment = require("moment");

const db = require("../helpers/db");

/**
 * Get days left in semester from info document
 * @param {object}  infoDoc Contains global app information
 * @return {number}         Number of days left in semester
 */
function getDaysLeftInSemester(infoDoc) {
    const endDate = moment(infoDoc.lastDayOfSemester, "MM/DD/YYYY");
    let daysLeft = endDate.diff(moment(), "days");

    // Correct negative numbers to zero
    if (daysLeft < 0) {
        daysLeft = 0;
    }

    return daysLeft;
}

module.exports = {
    name: "daysleftinsemester",
    getter: db.get,
    location: "info",
    processor: getDaysLeftInSemester,
    cache: false,
    method: "get"
};
