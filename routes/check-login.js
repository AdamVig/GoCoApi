const getters = require("../helpers/getters");

module.exports = {
    name: "checklogin",
    getter: getters.getGoGordon,
    location: "/",
    processor: () => { return true; },
    cache: false
};
