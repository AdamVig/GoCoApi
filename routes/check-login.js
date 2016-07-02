const getters = require("../helpers/getters");

const routeCheckLogin = module.exports = {};

routeCheckLogin.ENDPOINT = {
    name: "checklogin",
    getter: getters.getGoGordon,
    location: "/",
    processor: () => { return true; },
    cache: false
};
