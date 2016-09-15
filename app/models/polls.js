"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Poll = new Schema({
    user : {
        id : String
    },
    pollData : {
        pollId : String,
        pollName : String,
        pollOptions : [String],
        pollVotes : [Number],
        votes : [{
            opt : String,
            nbrVotes : Number
        }]
    }
});

module.exports = mongoose.model("Poll", Poll);



//pollOptions : [String]