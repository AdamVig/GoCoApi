const moment = require("moment");

const AppData = require("../models/AppData");

/**
 * Get days left in semester from info document
 * @param {string} lastDayOfSemester Last day of semester in MM/DD/YYYY format
 * @return {number} Number of days left in semester
 */
function getDaysLeftInSemester(lastDayOfSemester) {
    const endDate = moment(lastDayOfSemester, "MM/DD/YYYY");
    let daysLeft = endDate.diff(moment(), "days");

    // Correct negative numbers to zero
    if (daysLeft < 0) {
        daysLeft = 0;
    }

    return daysLeft;
}

module.exports = {
    name: "daysleftinsemester",
    model: new AppData("info"),
    location: "lastDayOfSemester",
    processor: getDaysLeftInSemester,
    cache: false,
    method: "get"
};
