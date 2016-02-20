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

/**
 * Get a page from Go Gordon that requires reauthentication
 * Sets reauthentication cookie, then lets getGoGordon handle getting
 * the actual page.
 * @param  {string}  url   Partial URL, ex: general/whoami.cfm
 * @param  {object}  auth  Contains username and password in plaintext
 * @return {promise}       Resolved by result of getGoGordon() for same URL
 */
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


getters.getMealpointsPage = function (url, auth) {

    const formData = {
        "userName": auth.username,
        "password": auth.password,
        "_scriptManager_HiddenField": "",
        "__EVENTTARGET": "",
        "__EVENTARGUMENT": "",
        "__VIEWSTATEGENERATOR": "",
        "__VIEWSTATE": "",
        "___BrowserRefresh": "53f2afd3-60a1-4181-ae9a-d77b45d5915c",
        "btnLogin": "Login"
    };

    var URL = "https://my.gordon.edu/ics";
    const myRequest = request.defaults({jar: true, simple: false});

    return myRequest(URL).then((response) => {

        const $ = cheerio.load(response);
        formData.__VIEWSTATE = $("#__VIEWSTATE").attr("value");
        formData.__VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR")
            .attr("value");
        return myRequest.post({url: URL, formData: formData});

    }).then((response) => {

        URL = "https://my.gordon.edu/ICS/Students/Mealpoints.jnz";
        return myRequest(URL);

    }).then((response) => {

        // Use src of iFrame to make request
        const $ = cheerio.load(response);
        URL = "https://my.gordon.edu" + $("#pg0_V_frame").attr("src");
        return myRequest(URL);

    }).then((response) => {

        URL = "https://my.gordon.edu/GMEX/";
        return myRequest.get(URL);

    }).then(cheerio.load);
};
