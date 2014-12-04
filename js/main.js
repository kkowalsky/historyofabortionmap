/******* GLOBAL VARIABLES *******/
var mapWidth = 850, mapHeight = 600;
var keyArray = ["grades", "tacos"]
var yearsArray = ["Pre-1973", "1973"];
var expressed = keyArray[0];

window.onload = initialize();

//SET UP COLOR ARRAYS FOR MAP + CHART

// Color array for Overview
// Waiting Period also uses this color array
colorArrayOverview = [  "#252525",      //F
                        "#636363",      //D
                        "#969696",      //C
                        "#cccccc",      //B
                        "#f7f7f7"   ];  //A

// Color array for Prohibited At
colorArrayProhibited = ["#252525",      //12 weeks
                        "#636363",      //20 weeks
                        "#969696",      //22 weeks
                        "#bdbdbd",      //24 weeks
                        "#d9d9d9",      //3rd trimester
                        "#f7f7f7"   ];  //Viability

// Color array for Mandated Counseling
colorArrayCounseling = ["#252525",      //Yes
                        "#f7f7f7"   ];  //No

// Color array for Parental Consent
colorArrayConsent = [   "#252525",      //Consent
                        "#969696",      //Notice
                        "#f7f7f7"   ];  //None

// Color array for Ultrasound
colorArrayConsent = [   "#252525",      //Must be performed, offer to view
                        "#636363",      //Must be performed
                        "#969696",      //Must be offered
                        "#f7f7f7"   ];  //None

//changes active state
$(function(){
    $('.nav li a').on('click', function(e){

        var $thisLi = $(this).parent('li');
        var $ul = $thisLi.parent('ul');

        if (!$thisLi.hasClass('active'))
        {
            $ul.find('li.active').removeClass('active');
                $thisLi.addClass('active');
        }
    })
});

function initialize(){
    setMap();
}; //END initialize
//creates map
function setMap(){
    var map = d3.select(".map")
        .append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        .attr("class", "us-map");
    
    //Create a Albers equal area conic projection
    var projection = d3.geo.albersUsa()
        .scale(1000)
        .translate([mapWidth / 2, mapHeight / 2]);
    
    //create svg path generator using the projection
    var path = d3.geo.path()
        .projection(projection);
    
    queue()
        .defer(d3.csv, "data/consent.csv")
        .defer(d3.csv, "data/Grades.csv")
        .defer(d3.json, "data/usa.topojson")
        .await(callback);
    
    //retrieve and process json file and data
    function callback(error, consent, grade, usa){

        //Create an Array with CSV's loaded
        var csvArray = [consent, grade];
        //Names for the overall Label we'd like to assign them
        var attributeNames = ["ConsentData", "gradeData"];
        //For each CSV in the array, run the LinkData function
        for (csv in csvArray){
            LinkData(usa, csvArray[csv], attributeNames[csv]);
        };

        function LinkData(topojson, csvData, attribute){

             var jsonStates = usa.objects.states.geometries;

            //loop through the csv and tie it to the json's via the State Abreviation
             for(var i=0; i<csvData.length; i++){
                var csvState = csvData[i];
                var csvLink = csvState.adm;

                //loop through states and assign the data to the rigth state
                for(var a=0; a<jsonStates.length; a++){

                    //If postal code = link, we good
                    if (jsonStates[a].properties.postal == csvLink){
                        attrObj = {};

                        //one more loop to assign key/value pairs to json object
                        for(var key in yearsArray){
                            var attr = keyArray[key];
                            var val = parseFloat(csvState[attr]);
                            attrObj[attr] = val;
                        };

                    jsonStates[a].properties[attribute] = attrObj;
                    };
                };
             };

 /*           for (var i=0; i<csvData.length; i++){
                var csvState = csvData[i]
                var csvLink = csvState.adm  };
 */         

//            for(var a=0; a<jsonStates.length; a++){
//                if(jsonStates[a].properties. )))
        };

// -- Grab State Abv. from TopoJSON -- (usa.objects.states.geometries[1].properties.postal)

       //TODO: draw map
        // add usa geometry
        var states = map.append("path") //create SVG path element
            .datum(topojson.feature(usa, usa.objects.states))
            .attr("class", "states") //class name for styling
            .attr("d", path); //project data as geometry in svg
        
        
    }; //END callback
    // Testing one two testing
}; //END setMAP

//TODO: Resizable SVG?


//TODO: animated sequence buttons

//color generator for country choropleth
function colorScale(csvData){
    var color = d3.scale.ordinal() //use ordinal scale since the variables are all specific value
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
