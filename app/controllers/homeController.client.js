"use strict";


(function(){
    
    
     function userUpdate(userData){
       // //console.log("user data is: ", userData);
        var userInfoObj = JSON.parse(userData);
        $("#userName").html(userInfoObj.username);
     //   //console.log("username is ", userInfoObj.username);
     //   userName.innerHTML = userInfoObj.username;
    }
    
    $("#suggestOption").hide();
    
    
    
    function displayOptions(pollInfo) {
        
        var jsonInfo = JSON.parse(pollInfo);
        
        var numberOfVotes = jsonInfo.pollData.votes.reduce((prevVal, val) => {
            return prevVal + val.nbrVotes;
        }, 0); 
        
        
        $("#suggestOption").hide();    
        $("#googleChart").hide();    
            
        
        
        loadTheChart(jsonInfo, "googleChart");
        $(".selPollTitle").html(jsonInfo.pollData.pollName);
        $("#selectedPoll").empty();
        
        var pollId = jsonInfo._id;
        
        
         
        
        
        if (numberOfVotes !== 0){
            if ($("#googleChart").css("display") == "none"){
                $("#googleChart").slideDown(1500);    
            }
            
            
        }
        
        $("#selectedPoll").hide();
       
        
        for (var i in jsonInfo.pollData.votes){
            var poll = jsonInfo.pollData.votes[i];
            var name = poll.opt;
            var votes = poll.nbrVotes;
            var optId = poll._id;
            
            var option = "<button pollId='poll" + pollId + "' optId='opt" + optId + "' class='option btn btn-default'><p>" + name + "</p><span class='badge'>" + votes +"</span></button>";
            $("#selectedPoll").append(option);
        }
        
        $("#selectedPoll").slideDown(2000, function(){
            $("#suggestOption").show();
        });
        
        
        
        
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
                
               $("#sugOption").css("box-shadow", "none");

                
               // </span><span class='glyphicon glyphicon-ok' id='tick'></span>
                
                if($("#sugOption").val().trim().length !== 0){
                    var idea = $("#sugOption").val();
                    var pollId = $("#selectedPoll button").attr("pollId").slice(4);
                    
                        ajaxFunctions.ajaxRequest("POST", appUrl + "/sendSuggestion/" + encodeURI(idea) + "/" + pollId, function(){
                        $("#suggestions").empty();
                        $(".rmvSuggestions").html("");
                    //    //console.log("idea sent");
                    })
                }
                else {
                    $("#sugOption").css("box-shadow", "0px 0px 20px 5px red");
                      $("#sugOption").attr("placeholder", "You need to write something here");
                }            
                
            })
            
            
            
            
            
        })
        
        
        
        $(".option").on("click", function(){
            var pollId = $(this).attr("pollId").slice(4);
            var optId = $(this).attr("optId").slice(3);
           
           /* 
            ajaxFunctions.ajaxRequest("POST", appUrl + "/voteInc/" + optId + "/" + pollId, function(){
                ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + pollId, displayOptions)
            })
            */
            
            ajaxFunctions.ajaxRequest("GET", appUrl + "/cookie/" + pollId, function(votedOrNot){
                
                if (votedOrNot == "true"){
                    ajaxFunctions.ajaxRequest("POST", appUrl + "/voteInc/" + optId + "/" + pollId, function(data){
                        alert("Your vote has been cast!");
                        ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + pollId, displayOptions)
                    })
                }
                else {
                    alert("You can only vote once, and your vote has already been cast!");
                }
            })
            
            
            
        })
        
        
    }
    
    
    
    
    
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", appUrl + "/api/id:", userUpdate));
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", appUrl + "/getPolls", function(data){
    
       // //console.log("done");
//        $("#publicPolls").html(data);
        var jsonData = JSON.parse(data);
        
        
        for (var i in jsonData){
            var button = "<li><a href='' class='publicPoll' pollId='poll" + jsonData[i]._id + "'>" + jsonData[i].pollData.pollName + "</a></li>";
            $("#publicPolls").append(button);
        }
      
        
        $(".publicPoll").on("click", function(e){
            e.preventDefault();
            $("#suggestions").empty();
            $(".rmvSuggestions").html("");

            var id = $(this).attr("pollId").slice(4);
        //    //console.log($(this).attr("pollId"));
            ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + id, function(data){
            displayOptions(data);
               // $("#selectedPoll").html(data);
            })
            
        })
        
    }));
    
    /*
    $(".selPollTitle").on("click", function(){
        $(".pollSlider").fadeToggle(3000);
    })
    */
    
    
})()