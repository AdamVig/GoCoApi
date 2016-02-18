const endpoint = require('../helpers/endpoint');
const getters = require ('../helpers/getters');

const ENDPOINT = {
    name: "checklogin",
    getter: getters.getGoGordon,
    location: "/",
    processor: () => { return true; },
    cache: false
};

module.exports = (app) => {
    endpoint.make(app, ENDPOINT);
};
