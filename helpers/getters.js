const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = getters = {};

/**
 * Get a page from Go Gordon
 * @param  {string} url  Partial URL,
 *                       ex: students/chapelcredits/viewattendance.cfm
 * @param  {object} auth Contains username and password in plaintext
 * @return {promise}     Resolved by webpage as Cheerio object
 */
getters.getGoGordon = function (url, auth) {
    url = "https://go.gordon.edu/" + url;
    return rp({url: url, auth: auth, transform: cheerio.load});
};
