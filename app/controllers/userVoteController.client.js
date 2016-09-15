"use strict";

(function(){
    
    var userName = document.querySelector("#userName");
    var appURI = appUrl + "/api/id:";
    var pollApiUri = appUrl + "/apiCall/polls";
    
    $(".rmvPollBtn").hide();            //Hides remove button on page load, it will show when a poll is selected (Easier done with css)
    $(".editBtn").hide(); 
   
    function userUpdate(userData){
        
        var userInfoObj = JSON.parse(userData);
        userName.innerHTML = userInfoObj.username;
    }
    
    function displayNotifications(notificationData) {
        var jsonNotes = JSON.parse(notificationData)
        $(".nbrNotifications").html(jsonNotes.length);
        console.log(jsonNotes.length);
        //add on click function here for nitifications. Not sure whether or not to link them to graphs, or just displyay them all at once.
        //also add an implement or remove feature for each notification. Remove/Implement all also?
    }
    
    
    
    function pollCycle(arr, toHere) {
        $(toHere).empty();
        $("#optionButtons").empty();
        for (var i in arr){
            $(toHere).append("<button class='singlePoll btn' id='id" + arr[i].pollData.pollId + "'>" + arr[i].pollData.pollName + "</button>");
        }
    }
    

    function pollsUpdate(userPolls) {
        $("#votes").empty();
        $(".rmvPollBtn").hide();
        
        var pollsData = JSON.parse(userPolls);
        pollCycle(pollsData, "#myPolls");       //Adds polls to the DOM.
        configPolls();                          //Sets event listeners on each poll.
       
    }
    
    
    
    function configPolls () {
       //var singlePoll = document.querySelector(".singlePoll");
        $("#myPolls").ready(function(){
            $(".singlePoll").on("click", function(){
                var id = $(this).attr("id");                //Id is in form: id57d6c1f4002dfd0861904c67.
               
               
               
                $(".rmvPollBtn").show();
                $(".rmvPollBtn").attr("id", id);
                
                $(".editBtn").show();
                $(".editBtn").attr("id", id);
                
                
               
               
               
               
                ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + id.slice(2), showPoll)        //Remeber to slice off "id" from beginning.
            });
            
        });

    }
    
    
    
    function showVotes (data) {
        //Could be common function.
        
        var jsonData = JSON.parse(data);
      //  var t = document.createTextNode();
        $("#votes").empty();
        $("#votes").html(JSON.stringify(jsonData.pollData.votes));
    
        
    }
        
    


    function showPoll(pollToDisplay) {
        showVotes(pollToDisplay);
        var pollClicked = JSON.parse(pollToDisplay);
     
        $("#selectedPoll").html(pollClicked);
        
        $("#optionButtons").html("");
        showOptions(pollClicked.pollData.votes, pollClicked._id);
    }
    
    
    function showOptions(pollOptions, pollId) {
       
        for (var i in pollOptions){
            var newButton = document.createElement("BUTTON");
            var text = document.createTextNode(pollOptions[i].opt);
            newButton.appendChild(text);
            
            newButton.setAttribute("class", "pollOptions");
            newButton.setAttribute("pollId", "poll" + pollId);
            newButton.setAttribute("type", "submit");
            newButton.setAttribute("name", "pop");
            newButton.setAttribute("optionId", "opt" + pollOptions[i]._id);
          
            $("#optionButtons").append(newButton);
            
        }
        
        
        $.getScript("/controllers/userPollInteractController.client.js");

        //
    }




    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", appURI, userUpdate));
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", appUrl + "/getNotifications", displayNotifications));

    ajaxFunctions.ajaxRequest("GET", pollApiUri, pollsUpdate);
    
    
    
     $(".rmvPollBtn").on("click", function(){

        if ($(this).attr("id")){
           
            var pollId = $(this).attr("id").slice(2);
            
            ajaxFunctions.ajaxRequest("DELETE", appUrl + "/deletePoll/" + pollId, function(){
                ajaxFunctions.ajaxRequest("GET", appUrl + "/apiCall/polls", pollsUpdate);
            });
        }
        else {
            console.log("no id");
        }
    })
    
  /*  
    $(".editBtn").on("click", function(){
        var id = $(this).attr("id").slice(2);
        ajaxFunctions.ajaxRequest("GET", appUrl + "/editPoll/" + id, function(){
            console.log("on edit page");
        })
    })
    */
    
    
   
    
    
    
})();


