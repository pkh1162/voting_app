"use strict";

google.charts.load('current', {'packages':['corechart']});





var loadTheChart = function(pollData, element){
    
    var pie = new google.visualization.PieChart(document.getElementById((element)));
    /*
    Can choose whatever chart type I want
    var bar = new google.visualization.BarChart(document.getElementById(element));
    */
    var type = pie;
    
    google.charts.setOnLoadCallback(drawChart(pollData, element, type));
  
    
    
}

var drawChart = function(pollData, element, type){
    prepareTheData(pollData, element, type);
    
   

}

var prepareTheData = function(chartData, element, type){
    
    
    
    var data = new google.visualization.DataTable();
    
    
        data.addColumn('string', 'Options');
        data.addColumn('number', 'Votes');
        
        var x = objToArray(chartData.pollData.votes, data);
        /*data.addRows([
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Olives', 1],
          ['Zucchini', 1],
          ['Pepperoni', 2]
        ]);
*/
       // //console.log(x.toObject());
        //data.addRow(x);
       
        // Set chart options
        var options = {
                       'width':"350",
                       'height':"300",
                        colors: ['#337ab7', '#eee', 'red', 'green', 'yellow'],
                        is3D: true
            
        };

    //
     
     var chart = type;
     //console.log("type of chart: " + typeof chart);
     
      //  google.visualization.events.addListener(chart, 'select', selectHandler);
        chart.draw(data, options);
}

var selectHandler = function(chart){
    
    ////console.log(chart.getSelection());
}

var selectChartType = function(){
    
}


var objToArray = function(votesObj, data) {
    var arr = [];
    for (var i in votesObj){
        ////console.log(votesObj[i]);
        var str = votesObj[i].opt.toString();
        var num = parseInt(votesObj[i].nbrVotes);
        //var temp = ([str, num]);
        //arr = temp;
        data.addRow([str, num]);
        
    }
    //console.dir(arr);
    //console.log(arr);
    return arr;
}