"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var User = new Schema({
    github : {
        id : String,
        displayName : String,
        username : String,
        publicRepos : Number
    },
    nbrClicks : {
        clicks : Number
    },
    nbrPolls : {
        polls : Number
        //Can provide validator function to limit no of polls, or ensure no negatives.
    },
   userPolls : {
      poll : [{
          type : mongoose.Schema.ObjectId,
          ref : "Poll"
        }]
    },
    
    notifications : [{
        message : String,
        pollId : String
    }]
    
});

module.exports = mongoose.model("User", User);