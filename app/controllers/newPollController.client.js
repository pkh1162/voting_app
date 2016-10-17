"use strict";



(function(){
    
    var pollApiUri = appUrl + "/apiCall/polls";
    var addPoll = document.querySelector("#addPoll");
    var testAdd = document.querySelector("#testAdd");
    var addOption = document.querySelector("#addOption");
    var removeOption = document.querySelector("#removeOption");
    var options = document.querySelector("#options");
    
    
    
    function random (data){
        ////console.log("hello");
    }
    
    
    function showOptions() {
        $("#noOfOptions").text(getOptionLength);
    };
    
    function getOptionLength () {
        return $("#options input").length;    
    }
    
    function optionVal () {
        
    }
    
    function fewOptionWarning () {
        $("#optionWarning").show().text("You need at least two options").delay(1000).fadeOut();
     
    }
    
    function manyOptionWanring () {
        
    }
    
    
    $("input[type=textarea]").on("blur", function(){
      //  $("#options").append("<div>this is awesome</div>");
      
    })
    
  
    $("#addOption").on("click", function(event){
       event.preventDefault();
        if (getOptionLength => 2){
            $("#optionWarning").text("");
        }
        
        $("#options").append("<input type='textarea' name='option'/>");
        
    })
    
     $("#removeOption").on("click", function(){
        event.preventDefault();       
        if (getOptionLength() <= 2){
            fewOptionWarning();
        }
        else{
            $("#options input").last().remove();
        }
        
    });
    
    $("#addPoll").on("click", function(event){
      
        $("input").css("box-shadow", "none");
        
        if ($(".question").val().trim() === ""){
                event.preventDefault();
                ////console.log($(".question").val());
                $(".question").css("box-shadow", "0px 0px 20px 5px red");
                addWarning(".question");
                
        }
        
        $("input[name=option]").each(function(i, opt){
            if ($(opt).val().trim() == ""){
                event.preventDefault();
                ////console.log("You need to enter something");
                $(opt).css("box-shadow", "0px 0px 20px 5px red");
                addWarning(opt);
            }
        })
        
    })
    
    
    function addWarning (element){
        $(element).val("");
        $(element).attr("placeholder", "You need to enter something here");
    }
  
    
   // testAdd.addEventListener('click', function () {
   //     ajaxFunctions.ajaxRequest('POST', pollApiUri, random);

  // }, false);
    
    
    
})();