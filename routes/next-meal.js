const getters = require("../helpers/getters");

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
              .split("\r\n")    // Split into array at newlines
              .map((item) => {    // Remove extraneous whitespace
                  return item
                      .replace(/(\r\n|\r)/g, "")
                      .trim();
              })
              .filter(item => (item !== ""));    // Remove empty lines

    return nextMeal;
};

routeNextMeal.ENDPOINT = {
    name: "nextmeal",
    getter: getters.getGoGordon,
    location: "departments/dining",
    processor: routeNextMeal.getNextMeal,
    cache: "global"
};
