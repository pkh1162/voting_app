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
    },
   userPolls : {
      poll : [{
          type : mongoose.Schema.ObjectId,
          ref : "Poll"
        }]
    }
    
});

module.exports = mongoose.model("User", User);