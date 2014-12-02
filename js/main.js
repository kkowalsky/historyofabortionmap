//global variables
var mapWidth = 800, mapHeight = 600;

window.onload = initialize();

function initialize(){
// TODO: mmenu isn't 100% working yet...
//      $("#my-menu").mmenu({
//          header: true
//      });
    
    setMap();
}; //END initialize
//creates map
function setMap(){
    var map = d3.select("body")
        .append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        .attr("class", "usmap");
    
    //Create a Albers equal area conic projection
    var projection = d3.geo.albersUsa();
    
    //create svg path generator using the projection
    var path = d3.geo.path()
        .projection(projection);
    
    queue()
        .defer(d3.json, "data/usa.json")
        .await(callback);
    
    
    //retrieve and process json file and data
    function callback(error, usa){
        console.log(usa);
       //TODO: draw map
        
         //add usa geometry
        var states = map.append("path") //create SVG path element
            .datum(topojson.feature(usa, usa.objects.usa))
            .attr("class", "states") //class name for styling
            .attr("d", path); //project data as geometry in svg
        
        
    }; //END callback
    // Testing one two testing
}; //END setMAP

//TODO: animated sequence buttons