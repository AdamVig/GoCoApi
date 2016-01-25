const endpoint = require('../helpers/endpoint');
const getters = require ('../helpers/getters');

const ENDPOINT = {
    name: "nextmeal",
    getter: getters.getGoGordon,
    location: "departments/dining",
    processor: getNextMeal,
    cache: "global"
};

module.exports = (app) => {
    endpoint.make(app, ENDPOINT);
};

/**
 * Get next meal from page
 * @param  {cheerio} $ Cheerio page object
 * @return {string}    Description of next meal
 */
function getNextMeal($) {
    const nextMeal = $("body").find("table")
        .last()
        .children().last()
        .children().last()
        .text()
        .replace(/(\n\r|\r)/g, "") // Remove extraneous whitespace
        .trim();

    return nextMeal;
}
