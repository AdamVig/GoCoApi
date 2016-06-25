const endpoint = require("../helpers/endpoint");
const getters = require("../helpers/getters");

const routeCheckLogin = module.exports = {};

routeCheckLogin.ENDPOINT = {
    name: "checklogin",
    getter: getters.getGoGordon,
    location: "/",
    processor: () => { return true; },
    cache: false
};

routeCheckLogin.endpoint = (app) => {
    endpoint.make(app, routeCheckLogin.ENDPOINT);
};
