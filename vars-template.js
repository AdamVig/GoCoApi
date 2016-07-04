module.exports = vars = {};
vars.couchDB = {
    ssl: false,    // Set to 'true' to use https, otherwise will use http
    url: "",       // URL to access database at (ex: accountname.cloudant.com)
    username: "",  // API key/username
    password: "",  // API key/password
    db: {         // Names of databases, ex: { genericName: "actualDBName" }
        info: "info",
        users: "users"
    }
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
