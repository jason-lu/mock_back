$(document).ready(function(){
	$( "li" ).add( "<p id='new'>new paragraph</p>" )
  .css( "background-color", "red" );

  $("#bt").click(function(){
    var whenResult =  $.when($.ajax("m1"));
    whenResult.done(function(a1) {
        console.log(a1);
        $("#d").text("Hello");
    });
});

drawCHart();
});


var drawCHart = function() {
    var options = {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    };
    var chart = Highcharts.chart('container-rose', options);
}

var app = new Vue({
    el:'#app',
    data: {
        message: 'You loaded this page on ' + new Date().toLocaleString()
    }
});
