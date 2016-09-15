"use strict";


    

(function(){
    
    var voteIncUrl = appUrl + "/voteInc/";
    
    
    
    var showVotes = function(data) {
        var jsonData = JSON.parse(data);
      //  var t = document.createTextNode();
        $("#votes").empty();
        $("#votes").html(JSON.stringify(jsonData.pollData.votes));
    //    document.body.appendChild(t);
        
    }


    $(".pollOptions").on("click", function(){
        var optionId = $(this).attr("optionId").slice(3);       //Slice 'opt' from optionId. (it is in form: opt57d6c1d6002dfd0861904c64)
        var pollId = $(this).attr("pollId").slice(4);           //Slice 'poll' from pollId.
       
        console.log(voteIncUrl);
        
        ajaxFunctions.ajaxRequest("POST", voteIncUrl + optionId + "/" + pollId, function(pop){
            var data = JSON.parse(pop);
            ajaxFunctions.ajaxRequest("GET", appUrl + "/getSingle/" + data.pollData.pollId, showVotes)
        });
      
    })
    
    
   
    
    






})();

