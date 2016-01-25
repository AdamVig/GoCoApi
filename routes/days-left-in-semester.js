const endpoint = require('../helpers/endpoint');
const db = require('../helpers/db');
const moment = require('moment');

const ENDPOINT = {
    name: "daysleftinsemester",
    getter: db.get,
    location: "info",
    processor: getDaysLeftInSemester,
    cache: false
};

module.exports = (app) => {
    endpoint.make(app, ENDPOINT);
};


function getDaysLeftInSemester(infoDoc) {
    const endDate = moment(infoDoc.lastDayOfSemester, "MM/DD/YYYY");
    const daysLeft = endDate.diff(moment(), "days");
    return daysLeft;
}
