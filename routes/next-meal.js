const endpoint = require("../helpers/endpoint");
const getters = require ("../helpers/getters");

const routeNextMeal = module.exports = {};

/**
 * Get next meal from page
 * @param  {cheerio} $ Cheerio page object
 * @return {string}    Description of next meal
 */
routeNextMeal.getNextMeal = function ($) {
    const nextMeal = $("body").find("table")
        .last()
        .children().last()
        .children().last()
        .text()
        .replace(/(\n\r|\r)/g, "") // Remove extraneous whitespace
        .trim();

    return nextMeal;
};

routeNextMeal.ENDPOINT = {
    name: "nextmeal",
    getter: getters.getGoGordon,
    location: "departments/dining",
    processor: routeNextMeal.getNextMeal,
    cache: "global"
};

routeNextMeal.endpoint = (app) => {
    endpoint.make(app, routeNextMeal.ENDPOINT);
};
