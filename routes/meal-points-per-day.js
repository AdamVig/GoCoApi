const DaysLeftInSemester = require("./days-left-in-semester");
const Endpoint = require("./endpoint");
const MealPoints = require("./meal-points");

/**
 * Meal points per day endpoint
 * @extends Endpoint
 */
module.exports = class MealPointsPerDay extends Endpoint {
    constructor(app) {
        super(app, {
            name: "mealpointsperday",
            cache: "user"
        });
    }

    /**
     * Get meal points per day
     * Uses the getter and processor functions from both meal points and days left
     *     in semester routes to prevent unncessary code duplication.
     * @param {string} location Unused
     * @param {object} auth Contains username and password in plaintext
     * @return {Promise}    Fulfilled by array containing meal points and
     *                      days left in semester
     */
    getter(location, auth) {
        const routeMealPoints = new MealPoints();
        const routeDaysLeft = new DaysLeftInSemester();
        const dataRequests = [
            routeMealPoints.getter("", auth)
                .then(routeMealPoints.processor),
            routeDaysLeft.model.get(
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
    processor(data) {
        const [mealPoints, daysLeft] = data;
        return Math.round(mealPoints / daysLeft) || 0;
    }
}
