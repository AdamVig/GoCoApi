const moment = require("moment");

const AppData = require("../models/app-data");
const Endpoint = require("./endpoint");

/**
 * Days left in semester endpoint
 * @extends Endpoint
 */
module.exports = class DaysLeftInSemester extends Endpoint {
    constructor(app) {
        super(app, {
            name: "daysleftinsemester",
            model: new AppData("info"),
            location: "lastDayOfSemester",
            method: "get"
        });
    }

    /**
     * Get days left in semester from info document
     * @param {string} lastDayOfSemester Last day of semester in MM/DD/YYYY format
     * @return {number} Number of days left in semester
     */
    processor(lastDayOfSemester) {
        const endDate = moment(lastDayOfSemester, "MM/DD/YYYY");
        let daysLeft = endDate.diff(moment(), "days");

        // Correct negative numbers to zero
        if (daysLeft < 0) {
            daysLeft = 0;
        }

        return daysLeft;
    }
}
