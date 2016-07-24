const EMOJI = {
    "sad_face": "\uD83D\uDE2D",
    "sos": "\uD83C\uDD98",
    "clapping": "\uD83D\uDC4F",
    "information_desk_person": "\uD83D\uDC81",
    "crossed_swords": "\u2694"
};

const config = module.exports = {};
config.APP_NAME = "GoCoAPI";
config.PORT = "4626";
config.ERROR = {
    // Character measurement:
    //   0_____________________23
    500: "Something went wrong! " + EMOJI.sos,
    404: "Couldn't find data. " + EMOJI.sad_face,
    401: "Your login is wrong. " + EMOJI.information_desk_person,
    409: "Could not save data. " + EMOJI.crossed_swords
};
config.FORMAT = {
    date: "MMMM D, YYYY", // January 4, 2016
    time: "h:mm A", // 10:04 AM
    datetime: "MMM D h:mm A",   // Jan 4 10:04 AM
};
config.COORDINATES = {
    latitude: "42.587576",
    longitude: "-70.824631"
};
config.CACHE_DOC_NAME = "cache";
config.CACHE_LENGTH = {
    "default": {hours: 1},
    "temperature": {minutes: 15}
};
