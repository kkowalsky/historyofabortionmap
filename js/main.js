/****** GLOBAL VARIABLES *******/
var mapWidth = 850, mapHeight = 500;
var keyArray = ["1973", "1974", "1975", "1976", "1977", "1977","1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"];
var Category = ["gradeData", "prohibitedAfter", "counseling", "waitingPeriod", "consentData", "ultrasound"];
var expressed;
var yearExpressed;
var colorize;
var scale;
var currentColors = [];
var menuWidth = 200, menuHeight = 420;
var otherMenuWidth = 198, otherMenuHeight = 70;
var menuInfoWidth = 400, menuInfoHeight = 100;
var textArray = ["Explanation of Overview Henshaw travelled to France near the beginning of World War I, and returned to give speeches in favour of conscription and to raise money for ambulance services there. She particularly spoke to female audiences, some of whom had been granted the right to vote by the Wartime Elections Act of 1917, and hence to vote on the conscription question", "Explanation of Prohibited At Born in Yate, Gloucestershire, Rowling was working as a researcher and bilingual secretary for Amnesty International when she conceived the idea for the Harry Potter series on a delayed train from Manchester to London in 1990.", "Explanation of Mandated Counseling The university has three campuses: Streatham; St Luke's (both of which are in Exeter); and Tremough in Cornwall. The university is centred in the city of Exeter, Devon, where it is the principal higher education institution.", "Explanation of Waiting Period In 2007, Spears's much-publicized personal issues sent her career into hiatus. Her fifth studio album, Blackout, was released later that year, and spawned hits such as Gimme More and Piece of Me. ", "Explanation of Parental Consent Mad Men is set in the 1960s, initially at the fictional Sterling Cooper advertising agency on Madison Avenue in New York City, and later at the newly created firm, Sterling Cooper Draper Pryce (later Sterling Cooper & Partners), located nearby in the Time-Life Building, at 1271 Sixth Avenue.", "Explanation of Mandatory Ultrasound They have a lot of production meetings during pre-production. The day the script comes in we all meet for a first page turn, and Matt starts telling us how he envisions it. Then there's a tone meeting a few days later where Matt tells us how he envisions it. And then there's a final full crew production meeting where Matt again tells us how he envisions it....", "Explanation of CPCS Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", "Explanation of Abortion Providers Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."];
var removeCPC;
var removeAbortion;
var joinedJson; //Variable to store the USA json combined with all attribute data

//minorchange

// SET UP ARRAYS FOR CATEGORIES OF EACH VARIABLE
    //Variable array for Overview
    var arrayOverview = [  "F",       
                        "D",       
                        "C",          
                        "B",          
                        "A"   ];     

    //Variable array for Prohibited At
    var arrayProhibited = [ "12 weeks",     
                        "20 weeks",      
                        "22 weeks",      
                        "24 weeks",      
                        "3rd trimester",      
                        "Viability"   ]; 

    //Variable array for Mandated Counseling
    var arrayCounseling = [ "Yes",     
                        "No"   ];  

    //Variable array for Waiting Period
    var arrayWaitingPeriod = [  "72 hours",     
                            "48 hours",      
                            "24 hours",      
                            "18 hours",     
                            "None"   ];  

    //Variable array for Parental Consent
    var arrayConsent = [    "consent",    
                            "notice",      
                            "none"   ];  

    //Variable array for Ultrasound
    var arrayUltrasound = ["Must be performed, offer to view",      
                        "x",      
                        "o",      
                        "none"   ];  

// SET UP COLOR ARRAYS FOR EACH VARIABLE
    // Color array for Overview & Waiting Period
    var colorArrayOverview = [  "#252525",      //F     //72 hours
                            "#636363",      //D     //48 hours
                            "#969696",      //C     //24 hours
                            "#bbb",      //B     //18 hours
                            "#e6e6e6"   ];  //A     //None

    // Color array for Prohibited At
    var colorArrayProhibited = ["#252525",      //12 weeks
                            "#636363",      //20 weeks
                            "#969696",      //22 weeks
                            "#bdbdbd",      //24 weeks
                            "#d9d9d9",      //3rd trimester
                            "#e6e6e6"   ];  //Viability

    // Color array for Mandated Counseling
    var colorArrayCounseling = ["#252525",      //Yes
                            "#e6e6e6"   ];  //No

    // Color array for Parental Consent
    var colorArrayConsent = [   "#252525",      //Consent
                            "#969696",      //Notice
                            "#e6e6e6"   ];  //None

    // Color array for Ultrasound
    var colorArrayUltrasound = ["#252525",      //Must be performed, offer to view
                            "#636363",      //Must be performed
                            "#969696",      //Must be offered
                            "#e6e6e6"   ];  //None

//SET UP VARIABLES FOR COLORSCALE & CHOROPLETH FUNCTIONS
var currentColors = [];
var currentArray = [];

//SET UP VARIABLES FOR TIMELINE
var chartHeight = 200;
var chartWidth = 100;
var squareWidth = 20;
var squareHeight = 20;
var timelineFeatureArray = []; //this will hold the new feature objects that will include a value for which year a law changed

/*---*******---END OF GLOBAL VARIABLES---*******---*/
//--------------------------------------------------/

//changes active state
window.onload = initialize();

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
    expressed = Category[0];
    yearExpressed = keyArray[0];
    setMap();
    createMenu(arrayOverview, colorArrayOverview, "Grading Scale: ", textArray[0]);
    //$(".glyphicon-pause").hide();
    $(".Overview").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
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
        .defer(d3.csv, "data/grades.csv")
        .defer(d3.csv, "data/prohibitedAfter.csv")
        .defer(d3.csv, "data/counseling.csv")
        .defer(d3.csv, "data/waitingPeriod.csv")
        .defer(d3.csv, "data/consent.csv")
        .defer(d3.csv, "data/ultrasound.csv")
        .defer(d3.json, "data/usa.topojson")
        .defer(d3.json, "data/CPCS.geojson")
        .defer(d3.json, "data/AbortionProviders.geojson")
        .await(callback);
    
    //creates menu [overview starts on load]
    drawMenu();
    drawMenuInfo();
        
    //retrieve and process json file and data
    function callback(error, grade, prohibitedAfter, counseling, waitingPeriod, consent, ultrasound, usa, cpc, abortionprovider){

        //Variable to store the USA json with all attribute data
        joinedJson = topojson.feature(usa, usa.objects.states).features;
        console.log(joinedJson);
//        console.log(topojson.feature(usa, usa.objects.states).features);
        // colorize = colorScale(joinedJson);
//        console.log(colorize);

        //Create an Array with CSV's loaded
        var csvArray = [grade, prohibitedAfter, counseling, waitingPeriod, consent, ultrasound];
        //Names for the overall Label we'd like to assign them
        var attributeNames = ["gradeData", "prohibitedAfter", "counseling", "waitingPeriod", "consentData", "ultrasound"];
        //For each CSV in the array, run the LinkData function
        for (csv in csvArray){
            LinkData(usa, csvArray[csv], attributeNames[csv]);
        };

        function LinkData(topojson, csvData, attribute){

             var jsonStates = usa.objects.states.geometries;

            //loop through the csv and tie it to the json's via the State Abbreviation
             for(var i=0; i<csvData.length; i++){
                var csvState = csvData[i];
                var csvLink = csvState.adm;

                //loop through states and assign the data to the rigth state
                for(var a=0; a<jsonStates.length; a++){

                    //If postal code = link, we good
                    if (jsonStates[a].properties.postal == csvLink){
                        attrObj = {};

                        //one more loop to assign key/value pairs to json object
                        for(var key in keyArray){
                            var attr = keyArray[key];
                            var val = (csvState[attr]);
                            attrObj[attr] = val;
                        };

                    jsonStates[a].properties[attribute] = attrObj;
                 // console.log(jsonStates[a].properties)
                    break;
                    };
                };
             }; 
        }; //END linkData

    // console.log statement to show the contents of the joined json object
    // console.log(topojson.feature(usa, usa.objects.states).features);

        //Prep the states to be able to be styled according to the data
        var states = map.selectAll(".states")
            .data(joinedJson)
            .enter()
            .append("path")
            .attr("class", function(d){ 
                return "states " + d.properties.postal;
            })
            .style("fill", function(d){
                // console.log(choropleth(d, colorize));
                return choropleth(d, colorize);
            })
            .attr("d", function(d) {
                return path(d);
            })
            .on("mouseover", highlight)
            .on("mouseout", dehighlight);

        var statesColor = states.append("desc")
            .text(function(d) {
                return choropleth(d, colorize);
            })

// -- Grab State Abv. from TopoJSON -- (usa.objects.states.geometries[1].properties.postal)
        //data stuff for overlay
        var cpcCount = [];
        for (var a = 0; a < cpc.features.length; a++){
            var cpc_count = cpc.features[a].properties.Count;
            cpcCount.push(Number(cpc_count));
        }
        
        //creates min and max of cpcs
        var cpcMin = Math.min.apply(Math, cpcCount);
        var cpcMax = Math.max.apply(Math, cpcCount);

        //creates radius for CPC
        var cpcRadius = d3.scale.sqrt()
            .domain([cpcMin, cpcMax])
            .range([2, 20]);
        
        //for abortion provider
        var abortionCount = [];
        for (var b = 0; b < abortionprovider.features.length; b++){
            var abortion_count = abortionprovider.features[b].properties.Count;
            abortionCount.push(Number(abortion_count));
        }
        
        //creates min and max of abortion providers
        var abortionMin = Math.min.apply(Math, abortionCount);
        var abortionMax = Math.max.apply(Math, abortionCount);
        
        //creates radius 
        var abortionRadius = d3.scale.sqrt()
            .domain([abortionMin, abortionMax])
            .range([2, 23]);

//        colorScale(joinedJson);
        setChart(); //draw the chart
        //calls overlay function
        overlay(path, cpcRadius, abortionRadius, map, cpc, abortionprovider);
    }; //END callback
}; //END setmap

//menu items function
function drawMenu(){
    $(".Overview").click(function(){ 
        expressed = Category[0];
        yearExpressed = keyArray[0];
        d3.selectAll(".menu-options div").style({'background-color': '#00c6ff','color': '#fff','border-style': 'none'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            });
        createMenu(arrayOverview, colorArrayOverview, "Grading Scale: ", textArray[0]);
        $(".Overview").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
    });
    
     $(".Prohibited").click(function(){ 
        expressed = Category[1];
        yearExpressed = keyArray[1];
        d3.selectAll(".menu-options div").style({'background-color': '#00c6ff','color': '#fff','border-style': 'none'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            });
        createMenu(arrayProhibited, colorArrayProhibited, "Prohibited At: ", textArray[1]);
            $(".Prohibited").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
     });
    
    $(".Counseling").click(function(){  
        expressed = Category[2];
        yearExpressed = keyArray[2];
        d3.selectAll(".menu-options div").style({'background-color': '#00c6ff','color': '#fff','border-style': 'none'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            });
        createMenu(arrayCounseling, colorArrayCounseling, "Mandated Counseling: ", textArray[2]);
        $(".Counseling").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
        });
    
    $(".Waiting").click(function(){ 
        expressed = Category[3];
        yearExpressed = keyArray[3];
        d3.selectAll(".menu-options div").style({'background-color': '#00c6ff','color': '#fff','border-style': 'none'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            });
        createMenu(arrayWaitingPeriod, colorArrayOverview, "Waiting Period: ", textArray[3]);
        $(".Waiting").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
        });
    
    $(".Parental").click(function(){  
        expressed = Category[4];
        yearExpressed = keyArray[4];
        d3.selectAll(".menu-options div").style({'background-color': '#00c6ff','color': '#fff','border-style': 'none'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            });
        createMenu(arrayConsent, colorArrayConsent, "Parental Consent: ", textArray[4])
        $(".Parental").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
});
    
    $(".Ultrasound").click(function(){
        expressed = Category[5];
        yearExpressed = keyArray[5];
        d3.selectAll(".menu-options div").style({'background-color': '#00c6ff','color': '#fff','border-style': 'none'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            });
        createMenu(arrayUltrasound, colorArrayUltrasound, "Mandatory Ultrasound: ", textArray[5]);
        $(".Ultrasound").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
});
}; //END drawMenu

//TODO: animate map with play/pause buttons

//TODO: have map year change with dropdown


function drawMenuInfo(){
    var dropdown = d3.select(".sequence-buttons")
        .append("div")
        .attr("class", "dropdown")
        //.html("<h4>Select Year: </h4>")
        .append("select");
    
    dropdown.selectAll("options")
        .data(keyArray)
        .enter()
        .append("option")
        .attr("value", function(d){ return d})
        .text(function(d){
            return d });
    
}; //End DrawMenuInfo

//creates the menu items 
function createMenu(arrayX, arrayY, title, infotext){
    var yArray = [50, 105, 160, 215, 270, 325];
    var oldItems = d3.selectAll(".menuBox").remove();
    var oldItems2 = d3.selectAll(".menuInfoBox").remove();
    
    //creates menuBoxes
    menuBox = d3.select(".menu-inset")
            .append("svg")
            .attr("width", menuWidth)
            .attr("height", menuHeight)
            .attr("class", "menuBox");
    
    //creates Menu Title
    var menuTitle = menuBox.append("text")
        .attr("x", 12)
        .attr("y", 30)
        .attr("class","title")
        .text(title)
        .style("font-size", '16px');
    
    //draws and shades boxes for menu
    for (b = 0; b < arrayX.length; b++){  
       var menuItems = menuBox.selectAll(".items")
            .data(arrayX)
            .enter()
            .append("rect")
            .attr("class", "items")
            .attr("width", 50)
            .attr("height", 50)
            .attr("x", 12);
        
        menuItems.data(yArray)
            .attr("y", function(d, i){
                return d;
            });
        
        menuItems.data(arrayY)
            .attr("fill", function(d, i){ 
                return arrayY[i];
            });
    };
    
    var menuLabels = menuBox.selectAll(".menuLabels")
        .data(arrayX)
        .enter()
        .append("text")
        .attr("class", "menuLabels")
        .attr("x", 70)
        .text(function(d, i){
            for (var c = 0; c < arrayX.length; c++){
                return arrayX[i]
            }
        })
        .style({'font-size': '14px', 'font-family': 'Open Sans, sans-serif'});

//    if (title = "Mandatory Ultrasound: "){
//        menuLabels.style('font-size', '8px');
//    };
    
        menuLabels.data(yArray)
            .attr("y", function(d, i){
                return d + 30;
            });
    
     //creates menuBoxes
    menuInfoBox = d3.select(".menu-info")
        .append("div")
        .attr("width", menuInfoWidth)
        .attr("height", menuInfoHeight)
        .attr("class", "menuInfoBox")
        .text(infotext);
}; //end createMenu

//creates proportional symbol overlay
function overlay(path, cpcRadius, abortionRadius, map, cpc, abortionprovider){
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
            createInset(path, cpc, abortionprovider, cpcRadius, abortionRadius);
            cpcDiv.style.backgroundColor = "#fff";
            cpcDiv.style.borderStyle = "solid";
            cpcDiv.style.borderColor = "#c8e713";
            cpcDiv.style.borderWidth = "2px";
            cpcDiv.style.color = "#c8e713";
            cpcInsetDiv.style.visibility = "visible";
        }
    });
    
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
            abortionPoints(map, abortionprovider, path, abortionRadius);
            createInset(path, cpc, abortionprovider, cpcRadius, abortionRadius);
            abortionDiv.style.backgroundColor = "#fff";
            abortionDiv.style.borderStyle = "solid";
            abortionDiv.style.borderColor = "#9608cb";
            abortionDiv.style.borderWidth = "2px";
            abortionDiv.style.color = "#9608cb";
            insetDiv.style.visibility = "visible";
        }
    }); 
}; //END overlay function

//creates cpc point data
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

//creates abortion providers point data
function abortionPoints(map, abortionprovider, path, abortionRadius){
    map.selectAll(".abortionLocations")
            .data(abortionprovider.features)
            .enter()
            .append("path")
            .attr("class", "abortionLocations")
            .attr('d', path.pointRadius(function(d){
                return abortionRadius(d.properties.Count);
            }));
}; //end abortionPoints

//TODO: finish overlay menus
//creates proportional symbol legend
function createInset(path, cpc, abortionprovider, cpcRadius, abortionRadius) {
  //creates menuBoxes
    cpcMenuBox = d3.select(".cpc-inset")
            .append("path")
            .attr("width", otherMenuWidth)
            .attr("height", otherMenuHeight)
            .attr("class", "menuBox");
    
    //draws and shades circles for menu
    cpcMenuBox.selectAll(".cpcMin")
        .append("circle")
        .attr("class", "cpcMin")
        .attr("r", function(d){
            //need to make circles
        })
        .style({'fill': '#c8e713','fill-opacity': '0.5', 'stroke': '#9fb80f', 'stroke-width': '0.75px'});  
    
    abortionMenuBox = d3.select("#abortion-inset")
            .append("svg")
            .attr("width", otherMenuWidth)
            .attr("height", otherMenuHeight)
            .attr("class", "menuBox");
    //labels circles
}; //END create inset
/* Katie's section end */

//---------------------------------------------//
/* BEAUTIFUL GREYSCALE RAINBOW COLOR GENERATOR */
//---------------------------------------------//
//         colorize = colorScale(consent, grade);
//SET UP COLOR ARRAYS FOR MAP + CHART
// Color array for Overview & Waiting Period   
function colorScale(value){
// this if/else statement determines which variable is currently being expressed and assigns the appropriate color scheme to currentColors
    if (expressed === "gradeData") {   
        currentColors = colorArrayOverview;
        currentArray = arrayOverview;
    } else if (expressed === "consentData") {
        currentColors = colorArrayConsent;
        currentArray = arrayConsent;
    } else if (expressed === "prohibitedAfter") {
        currentColors = colorArrayProhibited;
        currentArray = arrayProhibited;
    } else if (expressed === "counseling") {
        currentColors = colorArrayCounseling;
        currentArray = arrayCounseling;
    } else if (expressed === "waitingPeriod") {
         currentColors = colorArrayCounseling;
         currentArray = arrayWaitingPeriod;
    } else if (expressed === "ultrasound") {
        currentColors = colorArrayUltrasound;
        currentArray = arrayUltrasound;
    };

    scale = d3.scale.ordinal()
                .range(currentColors)
                .domain(currentArray); //sets the range of colors and domain of values based on the currently selected variable
    // console.log(currentColors);
    // console.log(currentArray);
    // console.log(scale(value[yearExpressed]));
    return scale(value[yearExpressed]);
};

// function choropleth(d, colorize){
//     var value = d.properties ? d.properties[expressed] : d[expressed];
//     return colorScale(value);
// };

function choropleth(d, colorize){
    var value = d.properties ? d.properties[expressed] : d.feature.properties[expressed];
    return colorScale(value);
};

function choroplethChart(d, colorize) {
    var valueChart = d.properties ? d.properties[expressed] : d.feature.properties[expressed];
    return colorScale(valueChart);
}


//---------------------------------------------//
/*              START CHART FUNCTIONS          */
//---------------------------------------------//
// Robin's section

// setChart function sets up the timeline chart and calls the updateChart function
function setChart() {

    var margin = {top: 100, right: 40, bottom: 30, left:80};

    var x = d3.scale.linear()
        .domain([keyArray[0], keyArray[keyArray.length-1]]) //domain is an array of 2 values: the first and last years in the keyArray (1973 and 2014)
        .rangeRound([0, window.innerWidth - margin.left - margin.right]); //range determines the x value of the square; it is an array of 2 values: the furthest left x value and the furthest right x value (on the screen)
    
    var axis = d3.svg.axis()

    var chart = d3.select(".graph")
        .append("svg")
        .attr("width", chartWidth+"%")
        .attr("height", chartHeight+"px")
        .attr("class", "chart")
        .append("g")
        .attr("transform", "translate(" + margin.left + ', ' + margin.top + ')');

    //need a loop to create a new array of feature objects that holds the value of each time the law was changed in a particular state; possibly add a property to that object that would be year changed
    
    //for-loop creates an array of feature objects that stores three values: thisYear (for the year that a law was implemented), newLaw (the categorization of the new policy) and a feature object (the state that the law changed in)
    for (var feature in joinedJson) {
        // console.log(feature);
        // console.log(joinedJson[feature]);
        var featureObject = joinedJson[feature];
        // console.log(featureObject.properties[expressed]);
        for (var thisYear=keyArray[1]; thisYear<keyArray[keyArray.length-1]; thisYear++){
            // console.log(featureObject.properties[expressed][i]);
            var lastYear = thisYear - 1;

            if (featureObject.properties[expressed][thisYear] != featureObject.properties[expressed][lastYear] && featureObject.properties[expressed][thisYear] != undefined && featureObject.properties[expressed][lastYear] != undefined) { // have to account for the value not being undefined since the grade data is part of the linked data, and that's not relevant for the timeline
            //     console.log(lastYear, thisYear);
            // console.log(featureObject.properties[expressed][lastYear], featureObject.properties[expressed][thisYear]);
            timelineFeatureArray.push({yearChanged: thisYear, newLaw: featureObject.properties[expressed][thisYear], feature: featureObject}); //each time a law is passed in a given year, a new feature object is pushed to the timelineFeatureArray
            }
        }
    }
    // console.log(timelineFeatureArray);

    var rect = chart.selectAll(".rect")
        .data(timelineFeatureArray) //use data from the timelineFeatureArray, which holds all of the states that had some change in law 
        .enter()
        .append("rect") //create a rectangle for each state
        .attr("class", function(d) {
            return "rect " + d.feature.properties.postal;
        })
        .attr("width", squareWidth+"px")
        .attr("height", squareHeight+"px")
        .attr("transform", function(d) {
            // console.log(d.yearChanged);
            // console.log(d.newLaw);
            // console.log(d.feature.properties.name);
            // console.log(d.feature.properties[expressed]);
            return "translate(" + x(d.yearChanged) + ")"; //this moves the rect along the x axis according to the scale, depending on the corresponding year that the law changed
        })
        .attr("y", function(d,i) {
            "transform"
        })
        .style("fill", function(d) {
            // console.log(d);
            // console.log(d.newLaw);
            // console.log(d.feature.properties[expressed]);
            return "#000";
            // return choroplethChart(d, colorize); // can't get it to fill based on attribute
        })
        .on("mouseover", highlightChart)
        .on("mouseout", dehighlightChart);

    var axis = chart.append("svg")
        .attr("class", "axis")
        .attr("width", 90+"%")
        .attr("height", 10+"px");

    // var timeline = axis.axis()
    //     .scale(x)
    //     .orient('bottom')
    //     .tickValues(timelineArray)
    //     .attr("class", "timeline");
        // .tickFormat(d3.time.format('%y'))
        // .tickSize(0)
    // updateChart(joinedJson);
};

// updateChart function is called when the variable is changed
function updateChart(currentVariable) {
    var xValue = 0; //holds the x position of each square in the timeline
    var yValue = 0; //holds the y position of each square in the timeline
    var curentYear; //year the for-loop is currently looking at
    var previousYear; //previous year, used for comparison to see if there was a change from the previous year to the current year, and thus whether a square should be drawn in currentYear

    // for (i in currentVariable)
}
/* ------------END CHART FUNCTIONS------------ */


//---------------------------------------------//
/*          START HIGHLIGHT FUNCTIONS          */
//---------------------------------------------//
// Robin's section
//Highlighting for the map
function highlight(joinedJson) {
    //holds the currently highlighted feature
    var feature = joinedJson.properties ? joinedJson.properties : joinedJson.feature.properties[expressed];

    d3.selectAll("."+feature.postal)
        // .style({"border-style": "solid", "border-color": "#00C6FF", "border-width": 4+"px"});
        .style("fill", "#00C6FF");
};

//Highlighting for the chart
function highlightChart(timelineFeatureArray) {
    var feature = timelineFeatureArray.feature.properties;

    d3.selectAll("."+feature.postal)
        .style("fill", "#00C6FF");
}

//Dehlighting for the map
function dehighlight(joinedJson) {
    var feature = joinedJson.properties ? joinedJson.properties : joinedJson.feature.properties[expressed];

    var selection = d3.selectAll("."+feature.postal);
    var fillColor = selection.select("desc").text();
    selection.style("fill", fillColor);
}

//Dehlighting for the chart
function dehighlightChart(joinedJson) {
    var feature = timelineFeatureArray.feature.properties;

    var selection = d3.selectAll("."+feature.postal);
    var fillColor = selection.select("desc").text();
    selection.style("fill", fillColor);
}



/* ----------END HIGHLIGHT FUNCTIONS--------- */