const restify = require("restify");

const getters = require("../helpers/getters");

const noChapelCreditMessage = "No Christian Life and Worship Credit Found";

/**
 * Get chapel credits from page
 * @param  {cheerio} $ Cheerio page object
 * @return {number}    Chapel credits
 */
function getChapelCredits($) {

    // Return zero if message is displayed
    if ($.html().includes(noChapelCreditMessage)) {
        return 0;
    }

    const dataString = $("body").find("table")
              .last()
              .children().first()
              .children().last()
              .text();

    if (dataString.length === 0 || !dataString) {
        throw new restify.BadGatewayError(
            "Could not find chapel credits in HTML.");
    }

    const chapelCredits = Number.parseInt(dataString);

    if (isNaN(chapelCredits)) {
        throw new restify.NotAcceptableError(
            "Could not convert chapel credits into integer.");
    }

    return chapelCredits;
}


module.exports = {
    name: "chapelcredits",
    getter: getters.getGoGordon,
    location: "/student/chapelcredits/viewattendance.cfm",
    processor: getChapelCredits,
    cache: "user"
};
