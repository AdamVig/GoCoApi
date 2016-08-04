const moment = require("moment");

const config = require("../config");
const Endpoint = require("./endpoint");
const getters = require("../helpers/getters");

module.exports = class ChapelEvents extends Endpoint {
    constructor(app) {
        super(app, {
            name: "chapelevents",
            location: "student/chapelcredits/viewupcoming.cfm",
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
     * Get chapel events from page
     * @param  {cheerio} $ Cheerio page object
     * @return {array}     Chapel events
     */
    processor($) {
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
                time: eventData.last().text().trim()
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
}
