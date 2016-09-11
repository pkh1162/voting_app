"use strict";



    

(function(){
    
    var voteInc = appUrl + "/voteInc/";
    
    
    
    var showVotes = function(data) {
        var jsonData = JSON.parse(data);
        console.log("juniper");
        console.log("data: " + data);
        console.log("jsonData: " + jsonData);
        var id = jsonData.pollData.pollId;
        var t = document.createTextNode(jsonData.pollData.pollVotes);
        document.body.appendChild(t);
        
        
       // ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + id, showPoll)       showPoll can't be accessed here/
;    }
    
    /*
    $("#optionButtons").on("change", function(){
        $(".pollOptions").on("click", function(){
            var id = $(this).attr("id").slice(-1);
            var pollId = $(this).attr("pollid");
            console.log("this is the button id pressed: " + id);
            console.log("This is is the pollId:" + pollId);
            console.log(voteInc);
            ajaxFunctions.ajaxRequest("GET", voteInc + id + "/" + pollId, showVotes);
        })
    })
    */
    
   /* 
    $("#optionButtons").on("click", function(){
        $(".pollOptions").on("click", function(){
            console.log("i hope it is alive");
        })
    })
    */
    
    $(".pollOptions").on("click", function(){
        var id = $(this).attr("id").slice(-1);
        var pollId = $(this).attr("pollid");
        console.log("this is the button id pressed: " + id);
        console.log("This is is the pollId:" + pollId);
        console.log(voteInc);
        ajaxFunctions.ajaxRequest("GET", voteInc + id + "/" + pollId, function(pop){
            console.log("rupert");
            var data = JSON.parse(pop);
            ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + data.pollData.pollId, showVotes)
        });
        console.log("It's aliiiiiiiivvvvvvveee!!!");
    })






})();

