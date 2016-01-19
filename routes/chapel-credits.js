const config = require('../config');
const utils = require('../utils');

const ENDPOINT = "chapelcredits";
const URL = "https://go.gordon.edu/student/chapelcredits/viewattendance.cfm";

module.exports = (app) => {
    utils.makeGetEndpoint(app, ENDPOINT, URL, getChapelCredits);
};

/**
 * Get chapel credits from page
 * @param  {cheerio} $ Cheerio page object
 * @return {number}    Chapel credits
 */
function getChapelCredits($) {
    const dataString = $("body").find("table")
        .last()
        .children().first()
        .children().last()
        .text();

    if (dataString.length === 0 || !dataString) {
        throw new Error("Could not find chapel credits in HTML.");
    }

    const chapelCredits = Number.parseInt(dataString);

    if (isNaN(chapelCredits)) {
        throw new Error("Could not convert chapel credits into integer.");
    }

    return chapelCredits;
}
