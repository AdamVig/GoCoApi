const agents = require("browser-agents");
const cheerio = require("cheerio");
const moment = require("moment");
const rp = require("request-promise");

const config = require("../config");
const Endpoint = require("./endpoint");

/**
 * Athletics schedule endpoint
 * @extends Endpoint
 */
module.exports = class AthleticsSchedule extends Endpoint {
    constructor(app) {
        super(app, {
            name: "athleticsschedule",
            location: "http://athletics.gordon.edu/calendar.ashx/calendar.rss",
            cache: "global",
            method: "get"
        });
    }

    /**
     * Get athletics schedule
     *
     * Note: Must spoof user agent to get an actual response.
     * Cheerio options:
     * 	xmlMode: enable stricter parsing
     * 	normalizeWhitespace: replace blocks of whitespace with a single space
     *
     * @param  {string} url Location of schedule
     * @return {promise}    Resolved by RSS feed object
     */
    getter(url) {
        return rp({
            url: url,
            headers: { "User-Agent": agents.random() },
            transform: (feed) => cheerio.load(feed, {
                xmlMode: true,
                normalizeWhitespace: true
            })
        });
    }

    /**
     * Parse athletics schedule RSS feed
     *
     * Each <item> tag represents an athletic event and contains the following:
     * title, description, link, ev:gameid, ev:location, ev:startdate, ev:enddate,
     * s:localstartdate, s:localenddate, s:teamlogo, s:opponentlogo
     *
     * Title is prefixed by the date in M/D format.
     * Description is suffixed by a newline and a permalink.
     * Dates are in either YYYY-MM-DD or Unix timestamp format.
     *
     * @param  {Cheerio} $ Contains RSS feed of athletics events
     * @return {array}     List of athletics events, each containing title, url,
     *                     location, opponentLogoURL, datetime, and relative time
     */
    processor($) {

        const athleticsEvents = [];

        $("channel").children("item").each((index, element) => {

            const eventData = $(element);

            // Namespaced XML tags must be escaped, ex: ns\\:tagname
            const event = {
                title: eventData.find("description").text().trim(),
                opponentLogoURL: eventData.find("s\\:opponentlogo").text().trim(),
                location: eventData.find("ev\\:location").text().trim(),
                datetime: eventData.find("s\\:localstartdate").text().trim()
            };

            // Remove newline and URL from end of event title
            event.title = event.title.substr(0, event.title.indexOf("\\n")).trim();

            const originalDateTime = moment(event.datetime);
            event.datetime = originalDateTime.format(config.FORMAT.datetime);
            event.relative = originalDateTime.fromNow();

            // Filter out events already occurred
            if (originalDateTime.isSameOrAfter(moment(), "day")) {
                athleticsEvents.push(event);
            }
        });

        return athleticsEvents;
    }
}
