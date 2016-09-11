"use strict";

(function(){
    
    var userName = document.querySelector("#userName");
    var appURI = appUrl + "/api/id:";
    var pollApiUri = appUrl + "/apiCall/polls";
    
    
    function userUpdate(userData){
        var userInfoObj = JSON.parse(userData);
        userName.innerHTML = userInfoObj.username;
    }
    
    
    function pollCycle(arr, toHere) {
        for (var i in arr){
            console.log(arr[i].pollData.pollName);
            $(toHere).append("<button class='singlePoll btn' id='id" + arr[i].pollData.pollId + "'>" + arr[i].pollData.pollName + "</button>");
        }
    }
    

    
    function pollsUpdate(userObject) {
        var pollsData = JSON.parse(userObject);
        console.log("in pollsUpdate");
        console.log(pollsData.userPolls);
        pollCycle(pollsData.userPolls.poll, "#myPolls");
       // $("#myPolls").text("hello");
       configPolls();
       
    }
    
    
    
    function configPolls () {
        var singlePoll = document.querySelector(".singlePoll");
    
    
        $("#myPolls").ready(function(){
            $(".singlePoll").on("click", function(){
                console.log($(this).attr("id"));
                var id = $(this).attr("id");
                $(".rmvPollBtn").attr("id", id);
                ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + id, showPoll)
            });
            
        });

    }
    
    
    
    


    function showPoll(id) {
        var newId = JSON.parse(id);
      //  console.log(typeof newId);
       // console.log(newId.pollOptions[0]);
        $("#selectedPoll").html(id);
         $("#optionButtons").html("");
        showOptions(newId.pollData.pollOptions, newId);
    }
    
    
    function showOptions(pollOptions, newId) {
      
        var pollId = newId._id;
        $("#optionButtons").empty();
       
        for (var i in pollOptions){
            var newButton = document.createElement("BUTTON");
            var text = document.createTextNode(pollOptions[i]);
            newButton.appendChild(text);
            
            newButton.setAttribute("class", "pollOptions");
            newButton.setAttribute("pollId", pollId);
            newButton.setAttribute("id", "opt" + i);
            //document.body.appendChild(newButton);
            $("#optionButtons").append(newButton);
          //  $("#optionButtons").append("<button pollid='" + pollId + "' class='pollOptions' id=opt" + i + ">" + pollOptions[i] + "</button>");  
        }
        
        
        $.getScript("/controllers/userPollInteractController.client.js");

        //
    }




    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", appURI, userUpdate));

    ajaxFunctions.ajaxRequest("GET", pollApiUri, pollsUpdate);
    
    $(".rmvPollBtn").on("click", function(){

        if ($(this).attr("id") !== ""){
            console.log("this id is: " + $(this).attr("id"));
            ajaxFunctions.ajaxRequest("GET", appUrl + "/deletePoll/" + $(this).attr("id"), function(deletedPoll){
                console.log("success in deleting");
            })
        }
        else {
            console.log("no id");
        }
    })
    
    
    
   
    
    
    
})();


