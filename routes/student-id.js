const restify = require("restify");
const endpoint = require("../helpers/endpoint");
const getters = require ("../helpers/getters");

const routeStudentID = module.exports = {};

/**
 * Get student ID from page
 * @param  {cheerio} $ Cheerio page object
 * @return {string}    Student ID with space inserted after 4 digits
 */
routeStudentID.getStudentID = function ($) {
    const studentID = $("body").find("table")
        .last()
        .children().last()
        .children().last()
        .text();

    if (studentID.length === 0 || !studentID) {
        throw new restify.BadGatewayError("Could not find student ID in HTML.");
    }

    return studentID.substring(0, 4) + " " + studentID.substring(4);
};

routeStudentID.ENDPOINT = {
    name: "studentid",
    getter: getters.getGoGordonSecure,
    location: "general/whoami.cfm",
    processor: routeStudentID.getStudentID,
    cache: false
};

routeStudentID.endpoint = (app) => {
    endpoint.make(app, routeStudentID.ENDPOINT);
};
