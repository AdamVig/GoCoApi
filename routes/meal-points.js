const endpoint = require('../helpers/endpoint');
const getters = require ('../helpers/getters');

module.exports = routeMealPoints = {};

/**
 * Get meal points from page
 * @param  {cheerio} $ Cheerio page object
 * @return {number}    Meal points, rounded to the nearest dollar
 */
routeMealPoints.parseMealPoints = function ($) {
    const dataString = $("body").find("table")
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

const ENDPOINT = {
    name: "mealpoints",
    getter: getters.getMealpointsPage,
    location: "/ICS/Students/Mealpoints.jnz",
    processor: routeMealPoints.parseMealPoints,
    cache: "user"
};

routeMealPoints.endpoint = (app) => {
    endpoint.make(app, ENDPOINT);
};
