/******* GLOBAL VARIABLES *******/
var mapWidth = 850, mapHeight = 600;
var keyArray = ["grades", "tacos"]
var yearsArray = ["Pre-1973", "1973"];
var expressed = keyArray[0];

window.onload = initialize();

//SET UP COLOR ARRAYS FOR MAP + CHART

// Color array for Overview & Waiting Period
colorArrayOverview = [  "#252525",      //F     //72 hours
                        "#636363",      //D     //48 hours
                        "#969696",      //C     //24 hours
                        "#cccccc",      //B     //18 hours
                        "#f7f7f7"   ];  //A     //None

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
colorArrayUltrasound = ["#252525",      //Must be performed, offer to view
                        "#636363",      //Must be performed
                        "#969696",      //Must be offered
                        "#f7f7f7"   ];  //None

// SET UP ARRAYS FOR CATEGORIES OF EACH VARIABLE

//Variable array for Overview
arrayOverview = [  "F",       
                    "D",       
                    "C",          
                    "B",          
                    "A"   ];     

//Variable array for Prohibited At
arrayProhibited = [ "12 weeks",     
                    "20 weeks",      
                    "22 weeks",      
                    "24 weeks",      
                    "3rd trimester",      
                    "Viability"   ]; 

//Variable array for Mandated Counseling
arrayCounseling = [ "Yes",     
                    "No"   ];  

//Variable array for Waiting Period
arrayWaitingPeriod = [  "72 hours",     
                        "48 hours",      
                        "24 hours",      
                        "18 hours",     
                        "None"   ];  

//Variable array for Parental Consent
arrayConsent = [    "Consent",    
                    "Notice",      
                    "None"   ];  

//Variable array for Ultrasound
arrayUltrasound = ["Must be performed, offer to view",      
                    "Must be performed",      
                    "Must be offered",      
                    "None"   ];  

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

        var states = map.append("path") //create SVG path element
            .datum(topojson.feature(usa, usa.objects.states))
            .attr("class", "states") //class name for styling
            .attr("d", path); //project data as geometry in svg
        
        
    }; //END callback
    // Testing one two testing
}; //END setMAP

//TODO: Resizable SVG?


//menu items function
function drawMenu(){
    var overviewArray = [A, B, C, D, F];
    var prohibitedArray = ["12 weeks", "20 weeks", "22 weeks", "24 weeks", "3rd Trimester", "Viability"];
    var counselingArray = ["Yes", "No"];
    var waitingArray = ["72", "48", "24", "18", "None"];
    var parentalArray = ["Consent", "Notice", "None"];
    var ultrasoundArray = ["Must be performed, offer to view", "Must be performed", "Must be offered", "None"];
    
} //END drawMenu

//TODO: animated sequence buttons

//change policy attribute based on click on left-hand menu
function changeAttribute(attribute, data) {

};

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
}; //END colorScale

//TODO: animated sequence buttons
