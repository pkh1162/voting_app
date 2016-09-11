"use strict";


// This is an immediately invoked function express (IIFE) - variables declared in the function below won't conflict with other variables declared,
// throughout the app, with the same name.

(function () {
    
    var addButton = document.querySelector('.btn-add');
    var deleteButton = document.querySelector('.btn-delete');
    var clickNbr = document.querySelector('#click-nbr');
    
    var apiUrl = appUrl + '/api/:id/clicks';
    
  
    
    
    
   
   
    function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }
   
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));
    
    
    
    addButton.addEventListener('click', function () {
        ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
        ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount)
      });

   }, false);
   
   
    deleteButton.addEventListener('click', function () {
        ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
        ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);


})();