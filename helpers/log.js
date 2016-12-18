const Bunyan = require("bunyan");
const restify = require("restify");

const config = require("../config");
const vars = require("../vars");

module.exports = new Bunyan({
    name: config.APP_NAME,
    streams: [
      {
        stream: process.stdout,
        level: 'debug'
      },
      {
        path: vars.logFileName,
        type: "rotating-file",
        level: "trace",
        period: "1d",  // Daily rotation
        count: 3  // Keep three back copies
      }
    ],
    serializers: restify.bunyan.serializers
})
