const config = require('../config');
const endpoint = require('../helpers/endpoint');
const getters = require('../helpers/getters');
const moment = require('moment');

const ENDPOINT = {
    name: "chapelevents",
    getter: getters.getGoGordon,
    location: "student/chapelcredits/viewupcoming.cfm",
    processor: getChapelEvents,
    cache: "global"
};

module.exports = (app) => {
    endpoint.make(app, ENDPOINT);
};

/**
 * Get chapel events from page
 * @param  {cheerio} $ Cheerio page object
 * @return {array}     Chapel events
 */
function getChapelEvents($) {
    const chapelEvents = [];
    const chapelEventsTable = $("body").find("table")
        .last()
        .children()
        .not("tr:first-child"); // Remove header row

    chapelEventsTable.each((index, element) => {
        const eventData = $(element).find("td");
        const event = {
            title: eventData.eq(1).text().trim(),
            date: eventData.eq(2).text().trim(),
            time: eventData.last().text().trim(),
        };

        const originalDateTime = moment(event.date + " " + event.time,
            "MM/DD/YYYY hh:mm A");

        event.datetime = originalDateTime.format(config.FORMAT.datetime);
        event.relative = originalDateTime.fromNow();
        event.time = originalDateTime.format(config.FORMAT.time);
        event.date = originalDateTime.format(config.FORMAT.date);

        chapelEvents.push(event);
    });

    return chapelEvents;
}
