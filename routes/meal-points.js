const endpoint = require('../helpers/endpoint');
const getters = require ('../helpers/getters');
const request = require('request-promise');
const cheerio = require('cheerio');

// Text content from the mealpoints iFrame on My Gordon, for matching purposes
const transfersEndedMessage = "Meal point transfers have ended";

module.exports = routeMealPoints = {};

/**
 * Get meal points page from My Gordon
 * Login, navigate to meal points viewing page, get token, use token to
 * make request to token-creation URL, then request actual meal points page
 * @param  {string}  url   Partial URL, ex: general/whoami.cfm
 * @param  {object}  auth  Contains username and password in plaintext
 * @return {promise}       Resolved by meal points webpage as Cheerio object
 */
routeMealPoints.getMealPointsPage = function (url, auth) {

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
        formData.__VIEWSTATE = $("#__VIEWSTATE").attr("value");
        formData.__VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR")
            .attr("value");
        return myRequest.post({url: URL, formData: formData});

    }).then((response) => {

        URL = "https://my.gordon.edu/ICS/Students/Mealpoints.jnz";
        return myRequest(URL);

    }).then((response) => {

        // Use src of iFrame to make request
        const $ = cheerio.load(response);
        URL = "https://my.gordon.edu" + $("#pg0_V_frame").attr("src");
        return myRequest(URL);

    }).then((response) => {

        URL = "https://my.gordon.edu/GMEX/";
        return myRequest.get(URL);

    }).then(cheerio.load);
};

/**
 * Get meal points from page
 * @param  {cheerio} $ Cheerio page object
 * @return {number}    Meal points, rounded to the nearest dollar
 */
routeMealPoints.parseMealPoints = function ($) {

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
        throw new Error("Could not find meal points in HTML.");
    }

    const mealPoints = Number.parseFloat(dataString);

    if (isNaN(mealPoints)) {
        throw new Error("Could not convert meal points into float.");
    }

    return Math.round(mealPoints);
};

routeMealPoints.ENDPOINT = {
    name: "mealpoints",
    getter: routeMealPoints.getMealPointsPage,
    location: "/ICS/Students/Mealpoints.jnz",
    processor: routeMealPoints.parseMealPoints,
    cache: "user"
};

routeMealPoints.endpoint = (app) => {
    endpoint.make(app, routeMealPoints.ENDPOINT);
};
