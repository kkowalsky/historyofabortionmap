/******* GLOBAL VARIABLES *******/
var mapWidth = 850, mapHeight = 600;
var menuWidth = 200, menuHeight = 350;
var yearsArray = ["grade", "Pre-1973", "1973", "1974", "1975", "1976", "1977", "1977","1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"];
var removeCPC;
var removeAbortion;

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

//changes active state of navbar
$(function(){
    $('.nav li a').on('click', function(e){
        var $thisLi = $(this).parent('li');
        var $ul = $thisLi.parent('ul');

        if (!$thisLi.hasClass('active')){
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
        .defer(d3.json, "data/CPCS.geojson")
        .defer(d3.json, "data/AbortionProviders.geojson")
        .await(callback);
    
    drawMenu();
    
    //retrieve and process json file and data
    function callback(error, consent, grade, usa, cpc, abortionprovider){
        var states = map.append("path") //create SVG path element
            .datum(topojson.feature(usa, usa.objects.states))
            .attr("class", "states") //class name for styling
            .attr("d", path); //project data as geometry in svg
        
        
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
                            var attr = yearsArray[key];
                            var val = (csvState[attr]);
                            attrObj[attr] = val;
                        };

                    jsonStates[a].properties[attribute] = attrObj;
                    //console.log(jsonStates[a].properties)

                    break;
                    };
                };
             }; 
        }; //END linkData

        var choropleth = map.selectAll(".states")
            .data(topojson.feature(usa, usa.objects.states).features)
            .enter()
            .append("g")
            .attr("class", "choropleth")
            .append("path")
            .attr("class", function(d){ return d.properties.postal})
            .attr("d", path);
/*            .append("desc")
                .text(function(d){
                    return choropleth(d, colorize);
                })
*/
// -- Grab State Abv. from TopoJSON -- (usa.objects.states.geometries[1].properties.postal)
        
        //data stuff for overlay
        var cpcCount = [];
        for (var a = 0; a < cpc.features.length; a++){
            var cpc_count = cpc.features[a].properties.Count;
            cpcCount.push(Number(cpc_count));
        }
        
        var cpcMin = Math.min.apply(Math, cpcCount);
        var cpcMax = Math.max.apply(Math, cpcCount);
        
        var cpcRadius = d3.scale.sqrt()
            .domain([cpcMin, cpcMax])
            .range([2, 15]);
        
        //for abortion provider
        var abortionCount = [];
        for (var b = 0; b < abortionprovider.features.length; b++){
            var abortion_count = abortionprovider.features[b].properties.Count;
            abortionCount.push(Number(abortion_count));
        }
        
        var abortionMin = Math.min.apply(Math, abortionCount);
        var abortionMax = Math.max.apply(Math, abortionCount);
    
        overlay(path, cpcRadius, map, cpc, abortionprovider);
    }; //END callback
}; //END setMAP

/* Katie's section start */
//TODO: Resizable SVG?

//menu items function
function drawMenu(){
    $(".overview").click(function(){  
        createMenu(arrayOverview, colorArrayOverview)});
    
     $(".prohibited").click(function(){  
        createMenu(arrayProhibited, colorArrayProhibited)});
    
    $(".counseling").click(function(){  
        createMenu(arrayCounseling, colorArrayCounseling)});
    
    $(".parental").click(function(){  
        createMenu(arrayConsent, colorArrayConsent)});
    
    $(".ultrasound").click(function(){  
        createMenu(arrayUltrasound, colorArrayUltrasound)});
    
    //TODO: add legend titles
    
    //TODO: add legend labels

}; //END drawMenu

function createMenu(arrayX, arrayY){
    var yArray = [50, 100, 150, 200, 250, 300];
    var menuBox = d3.select(".menu-inset")
            .append("svg")
            .attr("width", menuWidth)
            .attr("height", menuHeight)
            .attr("class", "menuBox");
    
    //draws and shades boxes for menu
    for (b = 0; b < arrayX.length; b++){  
       var menuItems = menuBox.selectAll(".items")
            .data(arrayX)
            .enter()
            .append("rect")
            .attr("class", function(d){
                return d;
            })
            .attr("width", 30)
            .attr("height", 30)
            .attr("x", 30);
        
        menuItems.data(yArray)
            .attr("y", function(d, i){
                return d;
            });
        
        //colorize function here
    };
    console.log(menuItems);
    
    
}; //end createMenu

/*
colorize = colorScale(csvData);
    
    var legendTitle = legendBox.append("text")
        .attr("x", 20)
        .attr("y", 25)
        .attr("class","subtitle")
        .text(label(expressed));
    
    legendItems.attr("fill", function(d, i){
        return colorize(legendArray[i]);
    })
    
    //do this
    var legendLabels = legendBox.selectAll(".legendLabels")
        .data(xArray)
        .enter()
        .append("text")
        .attr("class", "legendLabels")
        .attr("y", 80)
        .attr("x", function(d, i){
            for (var k = 0; k <= 4; k++){
                xCoords = coordinateArray[i+1];   
                return xCoords;
            }
        })
        .text(function(d, i){
            for (var j = 0; j <= 4; j++){
                legendNums = quantile[i];   
                return legendNums;
            }
        });
*/

function cpcPoints(map, cpc, path, cpcRadius){
    map.selectAll(".cpcLocations")
        .data(cpc.features)
        .enter()
        .append("path")
        .attr("class", "cpcLocations")
        .attr('d', path.pointRadius(function(d){
            return cpcRadius(d.properties.Count);
        }));   
}; //end cpcPoints

function abortionPoints(map, abortionprovider, path, cpcRadius){
    map.selectAll(".abortionLocations")
            .data(abortionprovider.features)
            .enter()
            .append("path")
            .attr("class", "abortionLocations")
            .attr('d', path.pointRadius(function(d){
                return cpcRadius(d.properties.Count);
            }));
}; //end abortionPoints


//TODO: proportional symbol map overlay
function overlay(path, cpcRadius, map, cpc, abortionprovider){
    $(".cpc-section").click(function(){
        var cpcDiv = document.getElementById('cpc-centers');
        var cpcInsetDiv = document.getElementById('cpc-inset');
        if (d3.selectAll(".cpcLocations")[0].length > 0){
            removeCPC = d3.selectAll(".cpcLocations").remove();
            cpcDiv.style.backgroundColor = "#c8e713";
            cpcDiv.style.color = "#fff";
            cpcDiv.style.border = "none";
            cpcInsetDiv.style.visibility = "hidden";
        } else {
            cpcPoints(map, cpc, path, cpcRadius);
            cpcDiv.style.backgroundColor = "#fff";
            cpcDiv.style.borderStyle = "solid";
            cpcDiv.style.borderColor = "#c8e713";
            cpcDiv.style.borderWidth = "2px";
            cpcDiv.style.color = "#c8e713";
            cpcInsetDiv.style.visibility = "visible";
        }
    })
    
    $(".abortion-section").click(function(){  
        var abortionDiv = document.getElementById('abortion-centers');
        var insetDiv = document.getElementById('abortion-inset');
        if (d3.selectAll(".abortionLocations")[0].length > 0){
            removeAbortion = d3.selectAll(".abortionLocations").remove();
            abortionDiv.style.backgroundColor = "#9608cb";
            abortionDiv.style.color = "#fff";
            abortionDiv.style.border = "none";
            insetDiv.style.visibility = "hidden";
        } else {
            abortionPoints(map, abortionprovider, path, cpcRadius);
            abortionDiv.style.backgroundColor = "#fff";
            abortionDiv.style.borderStyle = "solid";
            abortionDiv.style.borderColor = "#9608cb";
            abortionDiv.style.borderWidth = "2px";
            abortionDiv.style.color = "#9608cb";
            insetDiv.style.visibility = "visible";
        }
    })
    
    
    
}//END overlay

/* Katie's section end */

//change policy attribute based on click on left-hand menu (who did this??)
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
