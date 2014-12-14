/****** GLOBAL VARIABLES *******/
var mapWidth = 750, mapHeight = 400;
var keyArray = ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"];
var Category = ["gradeData", "prohibitedAfter", "counseling", "waitingPeriod", "consentData", "ultrasound"];
var expressed;
var yearExpressed;
var yearExpressedText;
var colorize;
var scale;
var currentColors = [];
var menuWidth = 200, menuHeight = 300;
var otherMenuWidth = 198, otherMenuHeight = 70;
var menuInfoWidth = 400, menuInfoHeight = 100;
var textArray = ["The report card grade, created by NARAL, given to each state based on their policies regarding a woman's choice and access to abortions.", "States with laws that require biased-counseling to women seeking abortion services.", "States with laws that subject women seeking abortion services to biased-counseling requirements.", "States where a woman must wait a designated period of time after counseling before having an abortion.", "States with laws restricting young women's access to abortion services by mandating parental consent.", "States where an ultrasound either must be performed, offered, or advised prior to an abortion.", "Crisis Pregnancy Centers are facilities that provide women with services and counseling to pregnant women, but appose abortion. CPC's are known for intimidating women about the dangers of abortion with inaccurate information.", "Abortion Providers are facilites that help with family planning, reproductive health, and educate people about safe sex. They do not promote abortion, but help women in need of one"];
var linkArray = ["<a href = '#overview'> Read More</a>", "<a href = '#prohibited'> Read More</a>", "<a href = '#counseling'> Read More</a>", "<a href = '#waiting'> Read More</a>", "<a href = '#consent'> Read More</a>", "<a href = '#ultrasound'> Read More</a>"];
var removeCPC;
var removeAbortion;
var joinedJson; //Variable to store the USA json combined with all attribute data

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
    var arrayUltrasound = ["Must be performed",      
                        "Must be offered",      
                        "Must be informed",      
                        "none"   ];  

// SET UP COLOR ARRAYS FOR EACH VARIABLE
    // Color array for Overview & Waiting Period
    var colorArrayOverview = [  "#252525",      //F     //72 hours
                            "#636363",      //D     //48 hours
                            "#969696",      //C     //24 hours
                            "#cccccc",      //B     //18 hours
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
var timelineFeatureArray = [];
var colorizeChart; // colorScale generator for the chart
var removeChart;
var chartHeight = 200;
var chartWidth = 100;
var squareWidth = 20;
var squareHeight = 20;
var chartRect;
var margin = {top: 100, right: 40, bottom: 30, left:150};
var rectColor;

/*---*******---END OF GLOBAL VARIABLES---*******---*/
//--------------------------------------------------/

//loads everythang
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
});//end active navbar function

function initialize(){
    expressed = Category[0];
    yearExpressed = keyArray[keyArray.length-1];
    animateMap(yearExpressed, colorize, yearExpressedText);
    setMap();
    createMenu(arrayOverview, colorArrayOverview, "Grading Scale: ", textArray[0], linkArray[0]);
    createInset();
    $(".sequence-buttons").hide();
    //$(".Overview").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
}; //End initialize

//creates map
function setMap(){
    var map = d3.select(".map")
        .append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        .attr("class", "us-map");
    
    //Create a Albers equal area conic projection
    var projection = d3.geo.albersUsa()
        .scale(900)
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
        
    //retrieve and process json file and data
    function callback(error, grade, prohibitedAfter, counseling, waitingPeriod, consent, ultrasound, usa, cpc, abortionprovider){

        //Variable to store the USA json with all attribute data
        joinedJson = topojson.feature(usa, usa.objects.states).features;
 //       console.log(joinedJson);
        colorize = colorScale(joinedJson);

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

        //Style the states to be styled according to the data
        var states = map.selectAll(".states")
            .data(joinedJson)
            .enter()
            .append("path")
            .attr("class", function(d){ 
                return "states " + d.properties.postal;
            })
            .style("fill", function(d){
                return choropleth(d, colorize);
            })
            .attr("d", function(d) {
                return path(d);
            })
            .on("mouseover", highlight)
            .on("mouseout", dehighlight)
            .on("mousemove", moveLabel);

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
        removeChart();
        setChart(); //draw the chart
        //calls overlay function
        overlay(path, cpcRadius, abortionRadius, map, cpc, abortionprovider);
        drawMenuInfo(colorize, yearExpressed);
    }; //END callback
}; //END setmap

//menu items function
function drawMenu(){
    $(".Overview").click(function(){ 
        expressed = Category[0];
        yearExpressed = keyArray[keyArray.length-1];
        $(".sequence-buttons").hide();
        d3.selectAll(".menu-options div").style({'background-color': '#e1e1e1','color': '#969696'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
        createMenu(arrayOverview, colorArrayOverview, "Grading Scale: ", textArray[0], linkArray[0]);
        $(".Overview").css({'background-color': '#CCCCCC','color': '#333333'});
        //robin's code
        var oldChart = d3.selectAll(".chart").remove();
        var oldRects = d3.selectAll(".chartRect").remove();
    });
    
     $(".Prohibited").click(function(){ 
        expressed = Category[1];
        $(".sequence-buttons").show();
        d3.selectAll(".menu-options div").style({'background-color': '#e1e1e1','color': '#969696'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
        createMenu(arrayProhibited, colorArrayProhibited, "Prohibited At: ", textArray[1], linkArray[1]);
            $(".Prohibited").css({'background-color': '#CCCCCC','color': '#333333'});
        //robin's code
        var oldChart = d3.select(".chart").remove();
        var oldRects = d3.selectAll(".chartRect").remove();
        setChart();
     });
    
    $(".Counseling").click(function(){  
        expressed = Category[2];
        $(".sequence-buttons").show();
        d3.selectAll(".menu-options div").style({'background-color': '#e1e1e1','color': '#969696'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
        createMenu(arrayCounseling, colorArrayCounseling, "Mandated Counseling: ", textArray[2], linkArray[2]);
        $(".Counseling").css({'background-color': '#CCCCCC','color': '#333333'});
        //robin's code
        var oldChart = d3.select(".chart").remove();
        var oldRects = d3.selectAll(".chartRect").remove();
        setChart();
        });
    
    $(".Waiting").click(function(){ 
        expressed = Category[3];
        $(".sequence-buttons").show();
        d3.selectAll(".menu-options div").style({'background-color': '#e1e1e1','color': '#969696'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
        createMenu(arrayWaitingPeriod, colorArrayOverview, "Waiting Period: ", textArray[3], linkArray[3]);
        $(".Waiting").css({'background-color': '#CCCCCC','color': '#333333'});
        //robin's code
        var oldChart = d3.select(".chart").remove();
        var oldRects = d3.selectAll(".chartRect").remove();
        setChart();
        });
    
    $(".Parental").click(function(){  
        expressed = Category[4];
        $(".sequence-buttons").show();
        d3.selectAll(".menu-options div").style({'background-color': '#e1e1e1','color': '#969696'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
        createMenu(arrayConsent, colorArrayConsent, "Parental Consent: ", textArray[4], linkArray[4])
        $(".Parental").css({'background-color': '#CCCCCC','color': '#333333'});
        //robin's code
        var oldChart = d3.select(".chart").remove();
        var oldRects = d3.selectAll(".chartRect").remove();
        setChart();
});
    $(".Ultrasound").click(function(){
        expressed = Category[5];
        $(".sequence-buttons").show();
        d3.selectAll(".menu-options div").style({'background-color': '#e1e1e1','color': '#969696'});
        d3.selectAll(".states").style("fill", function(d){
                return choropleth(d, colorize);
            })
            .select("desc")
                .text(function(d) {
                    return choropleth(d, colorize);
            });
        createMenu(arrayUltrasound, colorArrayUltrasound, "Mandatory Ultrasound: ", textArray[5], linkArray[5]);
        $(".Ultrasound").css({'background-color': '#CCCCCC','color': '#333333'});
        //robin's code
        var oldChart = d3.select(".chart").remove();
        var oldRects = d3.selectAll(".chartRect").remove();
        setChart();
});
}; //END drawMenu

//creates dropdown menu
function drawMenuInfo(colorize, yearExpressed){
    yearExpressedText = d3.select(".menu-info")
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", "yearExpressedText menu-info")
        .text(yearExpressed)
        .style({'font-size':'36px', 'font-weight': 'strong'}); 
}; //End DrawMenuInfo

//TODO: animate map with play/pause buttons
function animateMap(yearExpressed, colorize, yearExpressedText){
    $(".stepBackward").click(function(){
        if (yearExpressed <= keyArray[keyArray.length-1] && yearExpressed > keyArray[0]){
            yearExpressed--;
            changeAttribute(yearExpressed, colorize);
        } else {
            var newYearExpressed = keyArray[keyArray.length-1];
            changeAttribute(newYearExpressed, colorize);
        }; 
    });
    
    $(".play").click(function(){
            timer.play();
    });
    
    $(".pause").click(function(){
        timer.pause();
    });
    
    $(".stepForward").click(function(){
        if (yearExpressed < keyArray[keyArray.length-1]){
            yearExpressed++;
            changeAttribute(yearExpressed, colorize);
        } else {
            yearExpressed = keyArray[0];
            changeAttribute(yearExpressed, colorize);
        }; 
    });
}; //end AnimateMAP

function timeMapSequence(yearsExpressed) {
    if (yearsExpressed < keyArray[keyArray.length-1]){
        yearExpressed++; 
    };
        changeAttribute(yearExpressed, colorize);
};

//changes year displayed on map
function changeAttribute(year, colorize){
    var removeOldYear = d3.selectAll(".yearExpressedText").remove();
    
    for (x = 0; x < keyArray.length; x++){
        if (year == keyArray[x]) {
             yearExpressed = keyArray[x];
        }
    }
    
    d3.selectAll(".states")
        .style("fill", function(year){
            return choropleth(year, colorize);
        })
        .select("desc")
            .text(function(d) {
                return choropleth(d, colorize);
        });
    
     drawMenuInfo(colorize, yearExpressed);
}; //END changeAttribute


//creates the menu items 
function createMenu(arrayX, arrayY, title, infotext, infolink){
    var yArray = [40, 85, 130, 175, 220, 265];
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
        .attr("x", 10)
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
            .attr("width", 40)
            .attr("height", 40)
            .attr("x", 15);
        
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
        .attr("x", 60)
        .text(function(d, i){
            for (var c = 0; c < arrayX.length; c++){
                return arrayX[i]
            }
        })
        .style({'font-size': '14px', 'font-family': 'Open Sans, sans-serif'});
    
        menuLabels.data(yArray)
            .attr("y", function(d, i){
                return d + 30;
            });
    
     //creates menuBoxes
    menuInfoBox = d3.select(".menu-info")
        .append("div")
        .attr("width", menuInfoWidth)
        .attr("height", menuInfoHeight)
        .attr("class", "menuInfoBox textBox")
        .html(infotext + infolink);
}; //end createMenu

//creates proportional symbol overlay
function overlay(path, cpcRadius, abortionRadius, map, cpc, abortionprovider){
    $(".cpc-section").click(function(){
        var cpcDiv = document.getElementById('cpc-centers');
        var cpcInsetDiv = document.getElementById('cpc-inset');
        if (d3.selectAll(".cpcLocations")[0].length > 0){
            removeCPC = d3.selectAll(".cpcLocations").remove();
            removeCPCInfo = d3.selectAll(".cpcMenuInfoBox").remove();
            cpcInsetDiv.style.visibility = "hidden";
        } else {
            cpcPoints(map, cpc, path, cpcRadius);
            cpcInsetDiv.style.visibility = "visible";
        }
    });
    
    $(".abortion-section").click(function(){  
        var abortionDiv = document.getElementById('abortion-centers');
        var insetDiv = document.getElementById('abortion-inset');
        if (d3.selectAll(".abortionLocations")[0].length > 0){
            removeAbortion = d3.selectAll(".abortionLocations").remove();
            removeAbortionInfo = d3.selectAll(".abortionMenuInfoBox").remove();
            insetDiv.style.visibility = "hidden";
        } else {
            abortionPoints(map, abortionprovider, path, abortionRadius);
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
    
    //creates menuBoxes
    var menuInfoBox = d3.select(".map")
        .append("div")
        .attr("width", menuInfoWidth)
        .attr("height", menuInfoHeight)
        .attr("class", "cpcMenuInfoBox")
        .text(textArray[6]);
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
    
    //creates menuBoxes
    var menuInfoBox = d3.select(".map")
        .append("div")
        .attr("width", menuInfoWidth)
        .attr("height", menuInfoHeight)
        .attr("class", "abortionMenuInfoBox")
        .text(textArray[7]);
}; //end abortionPoints

//creates proportional symbol legend
function createInset() {
    var oldItems3 = d3.selectAll(".cpcCircles").remove();
    var oldItems4 = d3.selectAll(".abortionCircles").remove();
    var cpcRadiusArray = [2, 11.85, 20];
    var cpcLabelArray = [1, 4, 8];
    var abortionRadiusArray = [2, 16.23, 20];
    var abortionLabelArray = [1, 6, 11];
    
    //creates menuBoxes
    cpcMenuBox = d3.select(".cpc-inset")
            .append("svg")
            .attr("width", otherMenuWidth)
            .attr("height", otherMenuHeight)
            .attr("class", "cpcmenuBox");
    
    //draws and shades circles for menu
   var cpcCircles = cpcMenuBox.selectAll(".cpcCircles")
        .data(cpcRadiusArray)
        .enter()
        .append("circle")
        .attr("cy", 30)
        .attr("cx", function(d, i){
            return (2*d)+(i*50)+10;
        })
        .attr("r", function(d, i){
            return d;
        })
        .attr("class", "cpcCircles")
        .style({'fill': '#c8e713','fill-opacity': '0.5', 'stroke': '#9fb80f', 'stroke-width': '0.75px'});  
    
    //labels cpc circles
    var cpcLabels = cpcMenuBox.selectAll(".cpcOverlayLabels")
        .data(cpcLabelArray)
        .enter()
        .append("text")
        .attr("class", "cpcOverlayLabels")
        .attr("y", 35)
        .text(function(d, i){
            for (var k = 0; k < cpcLabelArray.length; k++){
                return cpcLabelArray[i]
            }
        })
        .style({'font-size': '14px', 'font-family': 'Open Sans, sans-serif'});
    
        cpcLabels.data(cpcRadiusArray)
            .attr("x", function(d, i){
                return (3*d)+(i*50)+15;
            });
    
    abortionMenuBox = d3.select(".abortion-inset")
        .append("svg")
        .attr("width", otherMenuWidth)
        .attr("height", otherMenuHeight)
        .attr("class", "abortionMenuBox");
    
     //draws and shades circles for menu
    var abortionCircles = abortionMenuBox.selectAll(".abortionCircles")
        .data(abortionRadiusArray)
        .enter()
        .append("circle")
        .attr("cy", 30)
        .attr("cx", function(d, i){
            return (2*d)+(i*50)+10;
        })
        .attr("r", function(d, i){
            return d;
        })
        .attr("class", "abortionCircles")
        .style({'fill': '#9608cb','fill-opacity': '0.5', 'stroke': '#72069a', 'stroke-width': '0.75px'}); 
    
    //labels abortion circles
    var abortionLabels = abortionMenuBox.selectAll(".abortionOverlayLabels")
        .data(abortionLabelArray)
        .enter()
        .append("text")
        .attr("class", "abortionOverlayLabels")
        .attr("y", 35)
        .text(function(d, i){
            for (var k = 0; k < abortionLabelArray.length; k++){
                return abortionLabelArray[i]
            }
        })
        .style({'font-size': '14px', 'font-family': 'Open Sans, sans-serif'});
    
        abortionLabels.data(abortionRadiusArray)
            .attr("x", function(d, i){
                return (3*d)+(i*50)+15;
            });  
}; //END create inset
/* Katie's section end */

//---------------------------------------------//
/* BEAUTIFUL GREYSCALE RAINBOW COLOR GENERATOR */
//---------------------------------------------//
//SET UP COLOR ARRAYS FOR MAP + CHART  
function colorScale(data){
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
         currentColors = colorArrayOverview;
         currentArray = arrayWaitingPeriod;
    } else if (expressed === "ultrasound") {
        currentColors = colorArrayUltrasound;
        currentArray = arrayUltrasound;
    };

    scale = d3.scale.ordinal()
                .range(currentColors)
                .domain(currentArray); //sets the range of colors and domain of values based on the currently selected 
    return scale(data[yearExpressed]);
};

function colorScaleChart(data) {
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
         currentColors = colorArrayOverview;
         currentArray = arrayWaitingPeriod;
    } else if (expressed === "ultrasound") {
        currentColors = colorArrayUltrasound;
        currentArray = arrayUltrasound;
    };

    scale = d3.scale.ordinal()
                .range(currentColors)
                .domain(currentArray); 

    return scale(data);
}; //end Colorscale

function choropleth(d, colorize){
    var data = d.properties ? d.properties[expressed] : d;
    return colorScale(data);
};

function choroplethChart(d, colorize) {
    return colorScaleChart(d);
};

//---------------------------------------------//
/*              START CHART FUNCTIONS          */
//---------------------------------------------//
// Robin's section

// setChart function sets up the timeline chart and calls the updateChart function
function setChart() {
    // var oldChart = d3.selectAll(".chart").remove();
    // var moreOldStuff = d3.selectAll(".rectStyle").remove();
    timelineFeatureArray = []; //this will hold the new feature objects that will include a value for which year a law changed
    colorizeChart = colorScaleChart(timelineFeatureArray);
    // $(".menu-options").click(function() {     
    
    var axis = d3.svg.axis();

    var chart = d3.select(".graph")
        .append("svg")
        .attr("width", chartWidth+"%")
        .attr("height", chartHeight+"px")
        .attr("class", "chart")
        .append("g")
        .attr("transform", "translate(" + margin.left + ', ' + margin.top + ')');

    //for-loop creates an array of feature objects that stores three values: thisYear (for the year that a law was implemented), newLaw (the categorization of the new policy) and a feature object (the state that the law changed in)
    for (var feature in joinedJson) {
        var featureObject = joinedJson[feature];
        for (var thisYear = 1; thisYear<=keyArray.length-1; thisYear++){
            var lastYear = thisYear - 1;
            if (featureObject.properties[expressed][keyArray[thisYear]] != featureObject.properties[expressed][keyArray[lastYear]]) { //have to account for the value not being undefined since the grade data is part of the linked data, and that's not relevant for the timeline
                timelineFeatureArray.push({yearChanged: Number(keyArray[thisYear]), newLaw: featureObject.properties[expressed][keyArray[thisYear]], feature: featureObject}); //each time a law is passed in a given year, a new feature object is pushed to the timelineFeatureArray
            };
        };
    };
    
    //console.log(timelineFeatureArray);

    var yearObjectArray = []; //will hold a count for how many features should be drawn for each year, the following for-loop does that

    for (key in keyArray) {
        var yearCount = 1;
        for (i = 0; i < timelineFeatureArray.length; i++) {
            //loop through here to see which year it matches and up
            // console.log(keyArray[key]);
            // console.log(timelineFeatureArray[i].yearChanged);
            // console.log(key)
            if (timelineFeatureArray[i].yearChanged == keyArray[key]) {
                //countYears++;
                yearObjectArray.push({"year": Number(keyArray[key]), "count":yearCount});
                yearCount = yearCount++;
            };
        };   
    };

    chartRect = chart.selectAll(".chartRect")
        .data(timelineFeatureArray) //use data from the timelineFeatureArray, which holds all of the states that had some change in law 
        .enter()
        .append("rect") //create a rectangle for each state
        .attr("class", function(d) {
            return "chartRect " + d.feature.properties.postal;
        })
        .attr("width", squareWidth+"px")
        .attr("height", squareHeight+"px");
    
    var x = d3.scale.linear()
        .domain([keyArray[0], keyArray[keyArray.length-1]]) //domain is an array of 2 values: the first and last years in the keyArray (1973 and 2014)
        .rangeRound([0, window.innerWidth - margin.left - margin.right]); //range determines the x value of the square; it is an array of 2 values: the furthest left x value and the furthest right x value (on the screen)

    var rectStyle = chartRect.attr("transform", function(d) {
            // console.log(d.yearChanged);
            // console.log(d.newLaw);
            // console.log(d.feature.properties.name);
            // console.log(d.feature.properties[expressed]);
            return "translate(" + x(d.yearChanged) + ")"; //this moves the rect along the x axis according to the scale, depending on the corresponding year that the law changed
        })
        .attr("y", function(d,i) {
            var yValue = 0;
            for (i = 0; i < yearObjectArray.length; i++) {
                if (yearObjectArray[i].year == d.yearChanged) {
                    yValue = yearObjectArray[i].count*(squareHeight+1);
                    yearObjectArray[i].count-=1;
                };
            };
            return yValue;
        })
        .style("fill", function(d) {
            return choroplethChart(d.newLaw, colorize); //apply the color according to what the new law is in that year
        })
        .on("mouseover", highlightChart)
        .on("mouseout", dehighlightChart);

    rectColor = rectStyle.append("desc")
            .text(function(d) {
                return choropleth(d, colorize);
            });


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
};

function removeChart() {
    if ($(".chartRect").length > 0) {
    removeChart = d3.selectAll(".chart").remove();
    }
}

/* ------------END CHART FUNCTIONS------------ */


//---------------------------------------------//
/*       START HIGHLIGHT & LABEL FUNCTIONS     */
//---------------------------------------------//
// Robin's section
//Highlighting for the map
function highlight(joinedJson, timelineFeatureArray) {
    //holds the currently highlighted feature
    var feature = joinedJson.properties ? joinedJson.properties : timelineFeatureArray.feature.properties;
    // console.log(feature.name);
    // console.log(feature.postal);
    d3.selectAll("."+feature.postal)
        // .style({"border-style": "solid", "border-color": "#00C6FF", "border-width": 4+"px"});
        .style("fill", "#00C6FF");

    var labelName = feature.name;

    var infoLabel = d3.select("body")
        .append("div")
        .attr("class", "infoLabel")
        .attr("id",feature.postal+"label")
        .html(labelName);
};

//Highlighting for the chart
function highlightChart(timelineFeatureArray) {
    var feature = timelineFeatureArray.feature.properties;
    d3.selectAll("."+feature.postal)
        .style("fill", "#00C6FF");
}

//Dehlighting for the map
function dehighlight(joinedJson) {
    var selectedFeature = joinedJson.properties;

    var selection = d3.selectAll("."+selectedFeature.postal);
    var fillColor = selection.select("desc").text();
    selection.style("fill", fillColor);

    var deselect = d3.select("#"+selectedFeature.postal+"label").remove();
}

//Dehlighting for the chart
function dehighlightChart(timelineFeatureArray) {
    var feature = timelineFeatureArray.feature.properties;

    var selection = d3.selectAll("."+feature.postal);
    var fillColor = selection.select("desc").text();
    selection.style("fill", function(d,i) {
        for (i=0; i < selection.length; i++) {
            return fillColor;
        }
    })
}

function moveLabel(data) {
    //horizontal label coordinate based mouse position stored in d3.event
    var x = d3.event.clientX < window.innerWidth - 245 ? d3.event.clientX+10 : d3.event.clientX-210; 
    //vertical label coordinate
    var y = d3.event.clientY < window.innerHeight - 100 ? d3.event.clientY-75 : d3.event.clientY-175; 
    
    d3.select(".infoLabel") //select the label div for moving
        .style("margin-left", x+"px") //reposition label horizontal
        .style("margin-top", y+"px"); //reposition label vertical
};

/* ----------END HIGHLIGHT FUNCTIONS--------- */
var timer = $.timer(function() {
            timeMapSequence(yearExpressed);  
	});
timer.set({ time : 500, autostart : false });