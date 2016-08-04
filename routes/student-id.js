const restify = require("restify");

const Endpoint = require("./endpoint");
const getters = require("../helpers/getters");

module.exports = class StudentID extends Endpoint {
    constructor(app) {
        super(app, {
            name: "studentid",
            location: "general/whoami.cfm",
            cache: false
        });
    }

    /**
     * Get Go Gordon pages behind the secure second login
     * @return {function} Getter for secure Go Gordon pages
     */
    getter(...args) {
        return getters.getGoGordonSecure(...args);
    }

    /**
     * Get student ID from page
     * @param  {cheerio} $ Cheerio page object
     * @return {string}    Student ID with space inserted after 4 digits
     */
    processor($) {
        const studentID = $("body").find("table")
                  .last()
                  .children().last()
                  .children().last()
                  .text();

        if (studentID.length === 0 || !studentID) {
            throw new restify.BadGatewayError("Could not find student ID in HTML.");
        }

        return studentID.substring(0, 4) + " " + studentID.substring(4);
    }
}
