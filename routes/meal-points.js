const cheerio = require("cheerio");
const request = require("request-promise");
const restify = require("restify");


// Text content from the mealpoints iFrame on My Gordon, for matching purposes
const transfersEndedMessage = "Meal point transfers have ended";

/**
 * Get meal points page from My Gordon
 * Login, navigate to meal points viewing page, get token, use token to
 * make request to token-creation URL, then request actual meal points page
 * @param  {string}  url   Partial URL, ex: general/whoami.cfm
 * @param  {object}  auth  Contains username and password in plaintext
 * @return {promise}       Resolved by meal points webpage as Cheerio object
 */
function getMealPointsPage(url, auth) {

    const formData = {
        "userName": auth.username,
        "password": auth.password,
        "_scriptManager_HiddenField": "",
        "__EVENTTARGET": "",
        "__EVENTARGUMENT": "",
        "__VIEWSTATEGENERATOR": "",
        "__VIEWSTATE": "",
        "___BrowserRefresh": "53f2afd3-60a1-4181-ae9a-d77b45d5915c",
        "btnLogin": "Login"
    };

    let URL = "https://my.gordon.edu/ics";
    const myRequest = request.defaults({jar: true, simple: false});

    return myRequest(URL).then((response) => {

        const $ = cheerio.load(response);

        /* eslint-disable no-underscore-dangle */
        formData.__VIEWSTATE = $("#__VIEWSTATE").attr("value");
        formData.__VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR")
            .attr("value");
        /* eslint-enable no-underscore-dangle */

        return myRequest.post({url: URL, formData: formData});

    }).then(() => {

        URL = "https://my.gordon.edu/ICS/Students/Mealpoints.jnz";
        return myRequest(URL);

    }).then((response) => {

        // Use src of iFrame to make request
        const $ = cheerio.load(response);
        URL = "https://my.gordon.edu" + $("#pg0_V_frame").attr("src");
        return myRequest(URL);

    }).then(() => {

        URL = "https://my.gordon.edu/GMEX/";
        return myRequest.get(URL);

    }).then(cheerio.load);
}

/**
 * Get meal points from page
 * @param  {cheerio} $ Cheerio page object
 * @return {number}    Meal points, rounded to the nearest dollar
 */
function parseMealPoints($) {

    // Skip processing if meal point transfers are closed
    // Return zero because it makes more sense than an error message
    //   when tranfsers are closed (during summer and first month of semester)
    if ($.html().includes(transfersEndedMessage)) {
        return 0;
    }

    const dataString = $("body")
              .find("table")
              .last()
              .children().first()
              .children().last()
              .text()
              .replace(",", "")
              .substring(1); // Remove dollar sign

    if (dataString.length === 0 || !dataString) {
        throw new restify.BadGatewayError(
            "Could not find meal points in HTML.");
    }

    const mealPoints = Number.parseFloat(dataString);

    if (isNaN(mealPoints)) {
        throw new restify.NotAcceptableError(
            "Could not convert meal points into float.");
    }

    return Math.round(mealPoints);
}

module.exports = {
    name: "mealpoints",
    getter: getMealPointsPage,
    location: "/ICS/Students/Mealpoints.jnz",
    processor: parseMealPoints,
    cache: "user"
};
