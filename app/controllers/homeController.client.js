"use strict";


(function(){
    
    
     function userUpdate(userData){
        
        var userInfoObj = JSON.parse(userData);
        $("#userName").html(userInfoObj.username);
        console.log("username is ", userInfoObj.username);
     //   userName.innerHTML = userInfoObj.username;
    }
    
    
    
    $("#suggestOption").hide();
    
    function displayOptions(pollInfo) {
        
        var jsonInfo = JSON.parse(pollInfo);
        
        loadTheChart(jsonInfo, "googleChart");
        $(".selPollTitle").html(jsonInfo.pollData.pollName);
        $("#selectedPoll").empty();
        
        var pollId = jsonInfo._id;
        
        for (var i in jsonInfo.pollData.votes){
            var poll = jsonInfo.pollData.votes[i];
            var name = poll.opt;
            var votes = poll.nbrVotes;
            var optId = poll._id;
            
            var option = "<button pollId='poll" + pollId + "' optId='opt" + optId + "' class='option btn btn-default'><p>" + name + "</p><span class='badge'>" + votes +"</span></button>";
            $("#selectedPoll").append(option);
        }
        
        $("#suggestOption").show();
        
        configOptEvents();
        
        
    }
    
    
    
    function configOptEvents() {
        
        $("#suggestOption label").on("click", function(){
            
            $("#suggestOption .rmvSuggestions").html("<span id='rmvSuggests' class='glyphicon glyphicon-minus'></span>")
            
            $(".rmvSuggestions").on("click", function(){
                $(this).html("");
                $("#suggestions").empty();
                
            });
            $("#suggestions").html("<input id='sugOption' type='textarea' rows='1' cols='50' wrap='hard' class='form-control' placeholder='Make a pleasant suggestion'><span class='input-group-btn'><button class='btn btn-default' id='tick' type='button'>Suggest</button></span>")
            $("#tick").on("click", function(){
                
                

                
               // </span><span class='glyphicon glyphicon-ok' id='tick'></span>
                
                if($("#sugOption").val().length !== 0){
                    var idea = $("#sugOption").val();
                    var pollId = $("#selectedPoll button").attr("pollId").slice(4);
                    
                    ajaxFunctions.ajaxRequest("POST", appUrl + "/sendSuggestion/" + encodeURI(idea) + "/" + pollId, function(){
                        $("#suggestions").empty();
                        $(".rmvSuggestions").html("");
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
    
    
    
    
    
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", appUrl + "/api/id:", userUpdate));
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", appUrl + "/getPolls", function(data){
        console.log("done");
//        $("#publicPolls").html(data);
        var jsonData = JSON.parse(data);
        
        for (var i in jsonData){
            var button = "<li><a href='#' class='publicPoll' pollId='poll" + jsonData[i]._id + "'>" + jsonData[i].pollData.pollName + "</a></li>";
            $("#publicPolls").append(button);
        }
        
        $(".publicPoll").on("click", function(e){
            e.preventDefault();
            $("#suggestions").empty();
            $(".rmvSuggestions").html("");

            var id = $(this).attr("pollId").slice(4);
            console.log($(this).attr("pollId"));
            ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + id, function(data){
            displayOptions(data);
               // $("#selectedPoll").html(data);
            })
            
        })
        
    }))
    
    /*
    $(".selPollTitle").on("click", function(){
        $(".pollSlider").fadeToggle(3000);
    })
    */
    
    
})()