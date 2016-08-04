const Endpoint = require("./endpoint");
const getters = require("../helpers/getters");

module.exports = class NextMeal extends Endpoint {
    constructor(app) {
        super(app, {
            name: "nextmeal",
            location: "departments/dining",
            cache: "global"
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
     * Get next meal from page
     * @param  {cheerio} $ Cheerio page object
     * @return {string}    Description of next meal
     */
    processor($) {
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
    }
}
