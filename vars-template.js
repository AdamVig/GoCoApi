const vars = module.exports = {};
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
vars.log = {
    paperTrailURL: "", // PaperTrail URL to log to, ex: logs.papertrailapp.com
    paperTrailPort: 99999, // PaperTrail port to log to
    traceLogPath: "", // File path to log traces to, ex: trace.log
};
vars.server = {
    url: "https://example.com/api" // Full URL to your server, no trailing slash
};
vars.test = {
    username: "", // Must be firstname.lastname
    password: ""
};
