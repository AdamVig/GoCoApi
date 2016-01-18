const EMOJI = {
    "sad_face": "\uD83D\uDE2D",
    "sos": "\uD83C\uDD98",
    "clapping": "\uD83D\uDC4F",
    "information_desk_person": "\uD83D\uDC81",
    "crossed_swords": "\u2694"
};

module.exports = config = {};
config.APP_NAME = "GoCoAPI";
config.PREFIX = "/gocostudent/:version/";
config.ERROR = {
    // Character measurement: 0_____________________23
    "InternalServerError":    "Something went wrong! " + EMOJI.sos,
    "NotFound":               "Couldn't find data. " + EMOJI.sad_face,
    "Unauthorized":           "Your login is wrong. " + EMOJI.information_desk_person,
    "Conflict":               "Could not save data. " + EMOJI.crossed_swords
};
