module.exports = vars = {};
vars.db = {
    ssl: false,  // Set to 'true' to use https, otherwise will use http
    name: "",    // Name of database
    url: "",     // URL to access database at (ex: accountname.cloudant.com)
    user: "",    // API key username
    password: "" // API key password
};
vars.forecastio = {
    key: "" // Register at https://developer.forecast.io/
};
vars.server = {
    url: "https://example.com/api" // Full URL to your server, no trailing slash
};
vars.test = {
    username: "", // Must be firstname.lastname
    password: ""
};
