/**
 * Get the endpoint"s data
 * @param {string} location Where to get the data from
 * @param {hash}   auth     Contains username and password in plaintext
 * @return {promise}        Will return data
 */
function getter(location, auth) {
    return [location, auth]; // Replace with actual data
}

/**
 * Process the data into a format suitable for the endpoint"s response
 * @param {varies} data Data from getter function
 * @return {varies} Processed data
 */
function processor(data) {
    return data;
}


module.exports = {

    /**
     * Name of route, all lowercase, used for URL definition
     */
    name: "routename",

    /**
     * HTTP method to use for route, defaults to POST if not set
     */
    method: "POST",

    /**
     * Function that retrieves data, returns promise
     * Either a getter or a model must be present or an error will be thrown.
     * @param {string} location (see comment on "location" property below)
     * @param {hash}   auth     Contains username and password in plaintext
     * @return {promise} Will return data
     */
    getter: getter,

    /**
     * Location of data, first parameter passed to getter
     * Likely to be a full URL, partial URL, or database document ID
     */
    location: "",

    /**
     * A Model or a class that extends Model
     * Either a getter or a model must be present or an error will be thrown.
     */
    //model: new Model("docName")

    /**
     * Function that transforms data into the correct format
     * @param {varies} data Data retrieved by getter
     * @return {varies} Transformed data
     */
    processor: processor,

    /**
     * Possible Values:
     * "user" (data is specific to user)
     * "global" (data is applicable to all users)
     * false (do not cache)
     */
    cache: "global"
};
