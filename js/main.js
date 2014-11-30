//global variables
var mapWidth = 800, mapHeight = 600;

window.onload = initialize();

function initialize(){
   $(document).ready(function() {
      $("#map-menu").mmenu({
          //don't need to add click events? wow much magic
          //this might be the hardest for me to code. but maybe not? Cider's on me if I'm wrong
          header: true
          classes: "mm-light"
      });
   });
    
    setMap();
}
   //creates map
function setMap(){
    var map = d3.select("body")
        .append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        .attr("class", "map");
    
    //Create a Albers equal area conic projection
    var projection = d3.geo.albersUsa();
    
    //create svg path generator using the projection
    var path = d3.geo.path()
        .projection(projection);
    
    queue()
        .defer(d3.json, "data/us.json")
        .await(callback);
    
    
    //retrieve and process json file and data
    function callback(error, us){
        
    };
}
