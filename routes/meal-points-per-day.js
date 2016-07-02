const routeDaysLeft = require("./days-left-in-semester");
const routeMealPoints = require("./meal-points");

const routeMealPointsPerDay = module.exports = {};

routeMealPointsPerDay.getMealPointsPerDay = function (location, auth) {
    const dataRequests = [
        routeMealPoints.ENDPOINT.getter("", auth)
            .then(routeMealPoints.ENDPOINT.processor),
        routeDaysLeft.ENDPOINT.getter(
                routeDaysLeft.ENDPOINT.location, auth)
            .then(routeDaysLeft.ENDPOINT.processor)
    ];
    return Promise.all(dataRequests);
};

/**
 * Calculate meal points per day
 * @param {array}   data Array of responses to data requests
 *                       0: mealPoints, 1: daysLeftInSemester
 * @return {number}      Meal points, rounded to the nearest dollar
 */
routeMealPointsPerDay.calculateMealPointsPerDay = function (data) {
    return Math.round(data[0] / data[1]);
};

routeMealPointsPerDay.ENDPOINT = {
    name: "mealpointsperday",
    getter: routeMealPointsPerDay.getMealPointsPerDay,
    location: "",
    processor: routeMealPointsPerDay.calculateMealPointsPerDay,
    cache: "user"
};
