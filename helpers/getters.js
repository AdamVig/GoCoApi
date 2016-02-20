const request = require('request-promise');
const cheerio = require('cheerio');

module.exports = getters = {};

/**
 * Get a page from Go Gordon
 * @param  {string}  url    Partial URL,
 *                          ex: students/chapelcredits/viewattendance.cfm
 * @param  {object}  auth   Contains username and password in plaintext
 * @return {promise}        Resolved by webpage as Cheerio object
 */
getters.getGoGordon = function (url, auth) {
    url = "https://go.gordon.edu/" + url;
    return request({url: url, auth: auth, jar: true, transform: cheerio.load});
};

getters.getGoGordonSecure = function (url, auth) {
    const reauthURL = "https://go.gordon.edu/lib/auth/level3logon.cfm";
    const form = {
	action: "logon",
	password: auth.password
    };
    const requestConfig = {
        url: reauthURL,
        auth: auth,
        form: form,
        jar: true,
        simple: false
    };

    return request.post(requestConfig).then(() => {
	return getters.getGoGordon(url, auth);
    });
};
