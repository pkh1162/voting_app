"use strict";


(function(){
    
    
    $("#suggestOption").hide();
    
    function displayOptions(pollInfo) {
        
        var jsonInfo = JSON.parse(pollInfo);
        
        loadTheChart(jsonInfo, "googleChart");
        $("#selectedPoll").empty();
        
        var pollId = jsonInfo._id;
        
        for (var i in jsonInfo.pollData.votes){
            var poll = jsonInfo.pollData.votes[i];
            var name = poll.opt;
            var votes = poll.nbrVotes;
            var optId = poll._id;
            
            var option = "<button pollId='poll" + pollId + "' optId='opt" + optId + "' class='option'>" + name + "</button><span> " + votes + "   </span>";
            $("#selectedPoll").append(option);
        }
        
        $("#suggestOption").show();
        
        configOptEvents();
        
        
    }
    
    
    
    function configOptEvents() {
        
        $("#suggestOption label").on("click", function(){
            $("#suggestions").html("<input type='textarea' id='sugOption'/><p id='tick'>_/</p>")
            $("#tick").on("click", function(){
                
                if($("#sugOption").val().length !== 0){
                    var idea = $("#sugOption").val();
                    var pollId = $("#selectedPoll button").attr("pollId").slice(4);
                    
                    ajaxFunctions.ajaxRequest("POST", appUrl + "/sendSuggestion/" + encodeURI(idea) + "/" + pollId, function(){
                        $("#suggestions").empty();
                        console.log("idea sent");
                    })
                }
            })
        })
        
        
        
        $(".option").on("click", function(){
            var pollId = $(this).attr("pollId").slice(4);
            var optId = $(this).attr("optId").slice(3);
            
            ajaxFunctions.ajaxRequest("POST", appUrl + "/voteInc/" + optId + "/" + pollId, function(){
                ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + pollId, displayOptions)
            })
        })
    }
    
    
    
    
    
    
    
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", appUrl + "/getPolls", function(data){
        console.log("done");
//        $("#publicPolls").html(data);
        var jsonData = JSON.parse(data);
        
        for (var i in jsonData){
            var button = "<button class='publicPoll' pollId='poll" + jsonData[i]._id + "'>" + jsonData[i].pollData.pollName + "</button><br/>";
            $("#publicPolls").append(button);
        }
        
        $(".publicPoll").on("click", function(){
            var id = $(this).attr("pollId").slice(4);
            console.log($(this).attr("pollId"));
            ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + id, function(data){
            displayOptions(data);
               // $("#selectedPoll").html(data);
            })
            
        })
        
    }))
    
    
    
    
    
    
})()