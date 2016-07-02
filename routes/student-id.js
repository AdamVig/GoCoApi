const restify = require("restify");

const getters = require("../helpers/getters");

/**
 * Get student ID from page
 * @param  {cheerio} $ Cheerio page object
 * @return {string}    Student ID with space inserted after 4 digits
 */
function getStudentID($) {
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

module.exports = {
    name: "studentid",
    getter: getters.getGoGordonSecure,
    location: "general/whoami.cfm",
    processor: getStudentID,
    cache: false
};
