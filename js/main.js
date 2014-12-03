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
    var map = d3.select(".usmap")
        .append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        .attr("class", "map");
    
    //Create a Albers equal area conic projection
    var projection = d3.geo.albersUsa()
        .scale(1000)
        .translate([mapWidth / 2, mapHeight / 2]);
    
    //create svg path generator using the projection
    var path = d3.geo.path()
        .projection(projection);
    
    queue()
        .defer(d3.json, "data/usa.topojson")
        .await(callback);
    
    
    //retrieve and process json file and data
    function callback(error, usa){
       //TODO: draw map
        console.log(usa);
        // add usa geometry
        var states = map.append("path") //create SVG path element
            .datum(topojson.feature(usa, usa.objects.states))
            .attr("class", "states") //class name for styling
            .attr("d", path); //project data as geometry in svg
        
        
    }; //END callback
    // Testing one two testing
}; //END setMAP

//color generator for country choropleth
function colorScale(csvData){
    var color = d3.scale.quantile()
        .range([
            "#f7f7f7",
            "#cccccc",
            "#969696",
            "#636363",
            "#252525"
            ]);
//!! Below area temporarly commented out until we write the [expressed] value !!//

//  var domainArray = [];
//  for (var i in csvData){
//    if(csvData[i][expressed] != 0){
//    domainArray.push(Number(csvData[i][expressed]));
//    };
//  };
//  color.domain(domainArray);
//  return color; 
};

//TODO: animated sequence buttons

