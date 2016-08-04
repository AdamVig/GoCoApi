const Endpoint = require("./endpoint");
const getters = require("../helpers/getters");

module.exports = class CheckLogin extends Endpoint {
    constructor(app) {
        super(app, {
            name: "checklogin",
            location: "/",
            cache: false
        });
    }

    /**
     * Get Go Gordon pages
     * @return {function} Getter for Go Gordon pages
     */
    getter(...args) {
        return getters.getGoGordon(...args);
    }


    /**
     * If the processor is called, that means the getter succeeded, so the login
     *     is valid. If it fails, an error will be thrown before the processor
     *     is called.
     * @return {boolean} Always true
     */
    processor() {
        return true;
    }
};
