const config = require('../config');
const utils = require('../utils');
const rp = require('request-promise');
const cheerio = require('cheerio');

const URL = "https://go.gordon.edu/student/chapelcredits/viewattendance.cfm";

module.exports = (app) => {
    app.get(config.PREFIX + 'chapelcredits', (req, res, next) => {

        const auth = utils.getAuth(req, res, next);

        rp({url: URL, auth: auth, transform: cheerio.load})
            .then(extractChapelCredits)
            .then((chapelCredits) => {
                res.send({data: chapelCredits});
            }).catch((e) => {
                utils.handleError(req, res, 'chapelcredits', e);
            }).finally(next);
    });
};

/**
 * Extract chapel credits from page
 * @param  {cheerio} $ Cheerio page object
 * @return {number}    Chapel credits
 */
function extractChapelCredits($) {
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
