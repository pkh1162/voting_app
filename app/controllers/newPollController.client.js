"use strict";



(function(){
    
    var pollApiUri = appUrl + "/apiCall/polls";
    var addPoll = document.querySelector("#addPoll");
    var testAdd = document.querySelector("#testAdd");
    var addOption = document.querySelector("#addOption");
    var removeOption = document.querySelector("#removeOption");
    var options = document.querySelector("#options");
    
    
    
    function random (data){
        console.log("hello");
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
    
  
    addOption.addEventListener("click", function(){
        if (getOptionLength => 2){
            $("#optionWarning").text("");

        }
        $("#options").append("<input type='textarea' name='option'/>");
        showOptions();
    });
    
     removeOption.addEventListener("click", function(){
        if (getOptionLength() <= 2){
            fewOptionWarning();
        }
        else{
            $("#options input").last().remove();
            showOptions();    
        }
        
    });
  
    
    testAdd.addEventListener('click', function () {
        ajaxFunctions.ajaxRequest('POST', pollApiUri, random);

   }, false);
    
    
    
})();