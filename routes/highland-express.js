const moment = require("moment");
const restify = require("restify");

const AppData = require("../models/app-data");
const Endpoint = require("./endpoint");
const utils = require("../helpers/utils");

const highlandExpressDocID = "highlandexpress";

module.exports = class HighlandExpress extends Endpoint {
    constructor(app) {
        super(app, {
            name: "highlandexpress",
            model: new AppData(highlandExpressDocID),
            cache: false,
            method: "get"
        });

        app.put(this.name, (req, res, next) => {
            // Throw errors if missing necessary data
            if (!req.params.data) {
                throw new restify.UnprocessableEntityError("Missing data.");
            } else if (!req.params.data._rev) {
                throw new restify.UnprocessableEntityError(
                    "Missing revision field.");
            }
            new AppData(highlandExpressDocID).save(req.params.data)
                .then((metaData) => {
                    res.send({data: metaData});
                }).catch((err) => {
                    utils.handleError(req, res, "Endpoint", this.name, err);
                }).then(next);
        });
    }

    /**
     * Add data to Highland Express doc
     * @param  {object} highlandExpressDoc Contains announcement and schedule
     * @return {object}                    Contains announcement, day, days,
     *                                     and schedule
     */
    processor(highlandExpressDoc) {

        const weekdayNum = moment().day(); // Sunday = 0, Saturday = 6

        // Add key of today"s schedule
        if (weekdayNum < 0 && weekdayNum < 5) {
            highlandExpressDoc.day = "weekday";
        } else {
            highlandExpressDoc.day = moment().format("dddd").toLowerCase();
        }

        // Add list of schedule keys
        highlandExpressDoc.days = Object.keys(highlandExpressDoc.schedule);

        return highlandExpressDoc;
    }
}
