const routeDaysLeft = require("./days-left-in-semester");
const routeMealPoints = require("./meal-points");

/**
 * Get meal points per day
 * Uses the getter and processor functions from both meal points and days left
 *     in semester routes to prevent unncessary code duplication.
 * @param {string} location Unused
 * @param {object} auth Contains username and password in plaintext
 * @return {Promise}    Fulfilled by array containing meal points and
 *                      days left in semester
 */
function getMealPointsPerDay(location, auth) {
    const dataRequests = [
        routeMealPoints.getter("", auth)
            .then(routeMealPoints.processor),
        routeDaysLeft.getter(
                routeDaysLeft.location, auth)
            .then(routeDaysLeft.processor)
    ];
    return Promise.all(dataRequests);
}

/**
 * Calculate meal points per day
 * @param {array}   data Array of responses to data requests
 *                       0: mealPoints, 1: daysLeftInSemester
 * @return {number}      Meal points, rounded to the nearest dollar
 */
function calculateMealPointsPerDay(data) {
    const [mealPoints, daysLeftInSemester] = data;
    return Math.round(mealPoints / daysLeftInSemester);
}

module.exports = {
    name: "mealpointsperday",
    getter: getMealPointsPerDay,
    location: "",
    processor: calculateMealPointsPerDay,
    cache: "user"
};
