const restify = require("restify");

const AppData = require("../models/app-data");
const Endpoint = require("./endpoint");
const utils = require("../helpers/utils");
const View = require("../models/view");


module.exports = class StatisticsRoute extends Endpoint {
    constructor(app) {
        super(app, {
            name: "statistics/:type",
        });
    }

    create(app) {
        app.get(this.name, (req, res, next) => {
            let statisticsGetter;
            if (req.params.type === "usage") {
                statisticsGetter = this.getEndpointUsage;
            } else if (req.params.type === "users") {
                statisticsGetter = this.getActiveUsersCount;
            } else if (req.params.type === "versions") {
                statisticsGetter = this.getVersionUsage;
            } else if (req.params.type === "platforms") {
                statisticsGetter = this.getPlatformUsage;
            } else {
                throw new restify.UnprocessableEntityError(
                    "Missing or unsupported statistics type.");
            }
            statisticsGetter().then((viewData) => {
                res.send({data: viewData});
            }).catch((err) => {
                utils.handleError(req, res, "Endpoint", this.name, err);
            }).then(next);
        });
    }

    /**
     * Get usage of endpoints
     * @return {Promise.<Object>} Usage totals for all user-facing endpoints
     */
    getEndpointUsage() {
        return new View("test-usage", "all").get()
            .then((usage) => {
                return usage.rows[0].value;
            });
    }

    /**
     * Get number of active users
     * @return {Promise.<Object>} Contains number of active users and
     *     percentage of school
     */
    getActiveUsersCount() {
        let usersCount;
        return new View("test-counts", "users-count").get()
            .then((view) => {
                usersCount = view.rows[0].value;
                return new AppData("info").get();
            }).then((info) => {
                const usersPercentage = usersCount / info.totalStudents;
                return {
                    users: usersCount,
                    percentage: usersPercentage,
                }
            });
    }

        /**
     * Get number of active users on each platform
     * @return {Promise.<Object>} Contains number of active users on
     *     each platform
     */
    getPlatformUsage() {
        return new View("test-counts", "platforms", {group: true}).get()
            .then((view) => {
                let totalUsers = 0;
                return view.rows.map((platformData) => {
                    totalUsers += platformData.value;
                    return {
                        name: platformData.key,
                        value: platformData.value,
                        unit: '% of users',
                    };
                }).map((platformData) => {
                    platformData.percentage =  platformData.value / totalUsers;
                    return platformData;
                });
            });
    }

    /**
     * Get number of active users on each version
     * @return {Promise.<Object>} Contains number of active users on
     *     each version
     */
    getVersionUsage() {
        return new View("test-counts", "versions", {group: true}).get()
            .then((view) => {
                // Get version number of latest version and parse data
                let latestVersion;
                let usersOnLatestVersion;
                let totalUsers = 0;
                const versionUsage = {};

                versionUsage.data = view.rows.map((versionData) => {
                    const currVersion = Number.parseFloat(versionData.key);
                    if (!latestVersion || currVersion > latestVersion) {
                        latestVersion = currVersion;
                        usersOnLatestVersion = versionData.value;
                    }
                    totalUsers += versionData.value;
                    return {
                        name: versionData.key,
                        users: versionData.value,
                        unit: '% of users',
                    };
                }).map((versionData) => {
                    versionData.percentage =  versionData.users / totalUsers;
                    return versionData;
                });
                versionUsage.latestVersion = latestVersion;
                versionUsage.latestPercentage =
                    usersOnLatestVersion / totalUsers;
                return versionUsage;
            });
    }
}
