"use strict";

(function(){
    
    $().dropdown('toggle')
    
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
        var numberOfNotes = jsonNotes.length;
        $(".notificationDropdown").empty();
        $(".nbrNotifications").html(numberOfNotes);
        
        $("#showNotifications").attr("data-toggle", "");
        
        if (numberOfNotes > 0) {
            $("#showNotifications").attr("data-toggle", "dropdown");
            //console.log("in noteifications");
            jsonNotes.map((note, index) => {
                if(index < 5){
                    var notification = "<li><a href='' class='myPoll' id='nI" + note.pollId + "'>" + note.message + "</a></li>";
                    $(".notificationDropdown").append(notification);    
                }
                
            })
        }
        
        
        //console.log(jsonNotes.length);
        //add on click function here for nitifications. Not sure whether or not to link them to graphs, or just displyay them all at once.
        //also add an implement or remove feature for each notification. Remove/Implement all also?
    }
    
    
    function displaySuggestions(userSuggestions){
        $("#suggestions").empty();
        var data = JSON.parse(userSuggestions);
        data.map((x) => $("#suggestions").append("<li pollId='poll" + x.pollId + "' class='noteButtons' id='id" + x._id + "'><p>" + x.message + "</p><span><button class='implementNote'>Implement</button></span><span><button class='deleteNote'>Delete</button></span></li>"));
        configNoteButtons();
        
    }
    
    function configNoteButtons(){
        $(".noteButtons").on("click", function(event){
            var clickedClass = $(event.target).attr("class");
            var noteId = $(this).attr("id").slice(2);
            var pollId = $(this).attr("pollId").slice(4);
        
            
            if (clickedClass === "implementNote"){
                ajaxFunctions.ajaxRequest("POST", appUrl + "/controlNote/" + noteId, function(data){
                    deleteNote(noteId, pollId);
                })
            }
            
            if (clickedClass === "deleteNote"){
                deleteNote(noteId, pollId);
            }
            
            
            
        })
    }
    
    
    
    
    function deleteNote(noteId, pollId){
        ajaxFunctions.ajaxRequest("DELETE", appUrl + "/controlNote/" + noteId, function(data){
             ajaxFunctions.ajaxRequest("GET", pollApiUri, pollsUpdate);
             ajaxFunctions.ajaxRequest("GET", appUrl + "/getNotifications", displayNotifications)
             ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + pollId, showPoll)
        })
    }
    
    
    
    
    
    function pollCycle(arr, toHere) {
        $(toHere).empty();
        $("#optionButtons").empty();
        

        for (var i in arr){
           // var pollButtons = "<div class='pollButtons btn-group btn-group-xs' role'group'><a href='editPoll/" + arr[i]._id + "'<button id='id" + arr[i]._id + "' class='editBtn btn btn-default'>Edit Poll</button></a><button id='id" + arr[i]._id + "' class='rmvPollBtn btn btn-danger'>Remove Poll</button></div>";
            
            var pollButtons = "<div class='pollButtons btn-group btn-group-xs' role'group'><button id='id" + arr[i]._id + "' class='rmvPollBtn btn btn-danger'>Remove Poll</button></div>";
            
            
            var userPoll = "<li><a href='#' class='myPoll' id='id" + arr[i]._id + "'>" + arr[i].pollData.pollName + "</a>"+ pollButtons +"</li>";
            $(toHere).append(userPoll);

           // $(toHere).append("<button class='singlePoll btn' id='id" + arr[i].pollData.pollId + "'>" + arr[i].pollData.pollName + "</button>");
        }
        
        
         $(".rmvPollBtn").on("click", function(){
             if ($(this).attr("id")){
                var pollId = $(this).attr("id").slice(2);
            
                ajaxFunctions.ajaxRequest("DELETE", appUrl + "/deletePoll/" + pollId, function(){
                    //console.log("update the polls");
                    ajaxFunctions.ajaxRequest("GET", pollApiUri, pollsUpdate);
                    ajaxFunctions.ajaxRequest("GET", appUrl + "/getNotifications", displayNotifications);
                    $("#selectedPoll, .selPollTitle, #suggestions, #googleChart").empty();
                    $("#suggestOption").hide();
                    //should be able to set initial html here.
                    
                    
                });
             }
             else {
              //  //console.log("no id");
             }
         })
        
        
           
             $(".editBtn").on("click", function(){
                 var id = $(this).attr("id").slice(2);
                 ajaxFunctions.ajaxRequest("GET", appUrl + "/editPoll/" + id, function(){
                 //console.log("on edit page");
                 })
              })
        
        
        
        
        
    }
    

    function pollsUpdate(userPolls) {
        $("#votes").empty();
        $(".rmvPollBtn").hide();
        
        var pollsData = JSON.parse(userPolls);
        pollCycle(pollsData, "#userPolls");       //Adds polls to the DOM.
        configPolls();                          //Sets event listeners on each poll.
       
    }
    
    
    
    function configPolls () {
       //var singlePoll = document.querySelector(".singlePoll");
        $("#userPolls").ready(function(){
            $(".myPoll").on("click", function(e){
                e.preventDefault();
                var id = $(this).attr("id");
                

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
        //showVotes(pollToDisplay);
        var pollClicked = JSON.parse(pollToDisplay);
        
        $("#suggestOption").show();
        loadTheChart(pollClicked, "googleChart");
        $(".selPollTitle").html(pollClicked.pollData.pollName);
        $("#selectedPoll").empty();
        
        var pollId = pollClicked._id;
        
        for (var i in pollClicked.pollData.votes){
            var poll = pollClicked.pollData.votes[i];
            var name = poll.opt;
            var votes = poll.nbrVotes;
            var optId = poll._id;
            
            var option = "<button pollId='poll" + pollId + "' optId='opt" + optId + "' class='option btn btn-default'><p>" + name + "</p><span class='badge'>" + votes +"</span></button>";
            $("#selectedPoll").append(option);
            
          //  matchHeight();
        
        }
        
        
        function matchHeight() {
            var height = $(".pollSlider").height();
            //console.log(height);
            $("#pollList").height(height + 35);
        }
        
        //notification logic here
        ajaxFunctions.ajaxRequest("GET", appUrl + "/getSuggestions/" + pollId, displaySuggestions);
        
       
         $("#suggestOption").show();
        configOptEvents();
        
        
     
        //$("#selectedPoll").html(pollClicked);
        
        $("#optionButtons").html("");
        showOptions(pollClicked.pollData.votes, pollClicked._id);
    }
    
    
    
    
    function configOptEvents() {
        
        $("#suggestOption label").on("click", function(){
            
            $("#suggestOption .rmvSuggestions").html("<span id='rmvSuggests' class='glyphicon glyphicon-minus'></span>")
            
            $(".rmvSuggestions").on("click", function(){
                $(this).html("");
                $("#addNewOption").empty();
                
            });
            $("#addNewOption").html("<input id='sugOption' type='textarea' rows='1' cols='50' wrap='hard' class='form-control' placeholder='Add new option'><span class='input-group-btn'><button class='btn btn-default' id='tick' type='button'>Add</button></span>")
            $("#tick").on("click", function(){
                    $("#sugOption").css("box-shadow", "0px 0px 20px 5px red");
               // </span><span class='glyphicon glyphicon-ok' id='tick'></span>
                
                if($("#sugOption").val().trim().length !== 0){
                    var idea = $("#sugOption").val();
                    var pollId = $("#selectedPoll button").attr("pollId").slice(4);
                    
                    ajaxFunctions.ajaxRequest("POST", appUrl + "/addOption/" + encodeURI(idea) + "/" + pollId, function(){
                    ajaxFunctions.ajaxRequest("GET", pollApiUri, pollsUpdate);
                    ajaxFunctions.ajaxRequest("GET", appUrl + "/getNotifications", displayNotifications)
                    ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + pollId, showPoll)
                        
                        $("#addNewOption").empty();
                        $(".rmvSuggestions").html("");
                        //console.log("idea sent");
                    })
                }
                else {
                    $("#sugOption").css("box-shadow", "0px 0px 20px 5px red");
                    $("#sugOption").attr("placeholder", "You need to enter something here");
                }
            })
        })
    
    
    }
    
    
    
    
    function showOptions(pollOptions, pollId) {
        
          $(".option").on("click", function(){
            var pollId = $(this).attr("pollId").slice(4);
            var optId = $(this).attr("optId").slice(3);
            
            ajaxFunctions.ajaxRequest("GET", appUrl + "/cookie/" + pollId, function(votedOrNot){
                
               
                if (votedOrNot == "true"){
                   
                    ajaxFunctions.ajaxRequest("POST", appUrl + "/voteInc/" + optId + "/" + pollId, function(data){
                        
                        alert("You just voted. Well done");
                        
                      
                    
                    ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + pollId, showPoll)
                })
                }
                else {
                    alert("Sorry, you have voted already");
                }
            })
            
           
        })
        
        
       /*
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
*/
        //
    }




    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", appUrl + "/getNotifications", displayNotifications));
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", appURI, userUpdate));
   

     ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", pollApiUri, pollsUpdate));
    
    
    
    
   
    
    
    
})();


