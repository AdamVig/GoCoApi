const routeDaysLeft = require("./days-left-in-semester");
const routeMealPoints = require("./meal-points");

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
    return Math.round(data[0] / data[1]);
}

module.exports = {
    name: "mealpointsperday",
    getter: getMealPointsPerDay,
    location: "",
    processor: calculateMealPointsPerDay,
    cache: "user"
};
