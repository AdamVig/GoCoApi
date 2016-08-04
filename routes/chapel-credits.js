const restify = require("restify");

const Endpoint = require("./endpoint");
const getters = require("../helpers/getters");

const noChapelCreditMessage = "No Christian Life and Worship Credit Found";

/**
 * Chapel credits endpoint
 * @extends Endpoint
 */
module.exports = class ChapelCredits extends Endpoint {
    constructor(app) {
        super(app, {
            name: "chapelcredits",
            location: "/student/chapelcredits/viewattendance.cfm",
            cache: "user"
        });
    }

    /**
     * Get Go Gordon pages
     * @return {function} Getter for Go Gordon pages
     */
    getter(...args) {
        return getters.getGoGordon(...args);
    }

    /**
     * Get chapel credits from page
     * @param  {cheerio} $ Cheerio page object
     * @return {number}    Chapel credits
     */
    processor($) {

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
}
