const Bunyan = require("bunyan");
const bunyanFormat = require("bunyan-format")
const restify = require("restify");

const config = require("../config");
const vars = require("../vars");

module.exports = new Bunyan({
    name: config.APP_NAME,
    streams: [
      {
          level: "trace",
          stream: bunyanFormat({outputMode: "long"}, process.stdout)
      },
      {
        path: vars.logFileName,
        type: "rotating-file",
        level: "debug",
        period: "1d",  // Daily rotation
        count: 3  // Keep three back copies
      }
    ],
    serializers: restify.bunyan.serializers
})
