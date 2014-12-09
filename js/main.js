/******* GLOBAL VARIABLES *******/
var mapWidth = 850, mapHeight = 500;
var menuWidth = 200, menuHeight = 420;
var otherMenuWidth = 198, otherMenuHeight = 70;
var menuInfoWidth = 400, menuInfoHeight = 100;
var textArray = ["Explanation of Overview", "Explanation of Prohibited At", "Explanation of Mandated Counseling", "Explanation of Waiting Period", "Explanation of Parental Consent", "Explanation of Mandatory Ultrasound", "Explanation of CPCS", "Explanation of Abortion Providers"];
var yearsArray = ["1973", "1974", "1975", "1976", "1977", "1977","1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"];
var removeCPC;
var removeAbortion;

// Color array for Overview & Waiting Period
var colorArrayOverview = [  "#252525",      //F     //72 hours
                        "#636363",      //D     //48 hours
                        "#969696",      //C     //24 hours
                        "#cccccc",      //B     //18 hours
                        "#f7f7f7"   ];  //A     //None

// Color array for Prohibited At
var colorArrayProhibited = ["#252525",      //12 weeks
                        "#636363",      //20 weeks
                        "#969696",      //22 weeks
                        "#bdbdbd",      //24 weeks
                        "#d9d9d9",      //3rd trimester
                        "#f7f7f7"   ];  //Viability

// Color array for Mandated Counseling
var colorArrayCounseling = ["#252525",      //Yes
                        "#f7f7f7"   ];  //No

// Color array for Parental Consent
var colorArrayConsent = [   "#252525",      //Consent
                        "#969696",      //Notice
                        "#f7f7f7"   ];  //None

// Color array for Ultrasound
var colorArrayUltrasound = ["#252525",      //Must be performed, offer to view
                        "#636363",      //Must be performed
                        "#969696",      //Must be offered
                        "#f7f7f7"   ];  //None

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
var arrayConsent = [    "Consent",    
                    "Notice",      
                    "None"   ];  

//Variable array for Ultrasound
var arrayUltrasound = ["Must be performed, offer to view",      
                    "Must be performed",      
                    "Must be offered",      
                    "None"   ];  

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
    setMap();
    createMenu(arrayOverview, colorArrayOverview, "Grading Scale: ");
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
    
    //creates menu [overview starts on load]
    drawMenu();
    drawMenuInfo();
        
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

        //creates choropleth
        var choropleth = map.selectAll(".states")
            .data(topojson.feature(usa, usa.objects.states).features)
            .enter()
            .append("g")
            .attr("class", "choropleth")
            .append("path")
            .attr("class", function(d){ return d.properties.postal})
            .attr("d", path);
        
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
    
        //calls overlay function
        overlay(path, cpcRadius, abortionRadius, map, cpc, abortionprovider);
    }; //END callback
}; //END setmap

//menu items function
function drawMenu(){
    $(".Overview").click(function(){ 
        d3.selectAll(".menu-options div").style({'background-color': '#00c6ff','color': '#fff','border-style': 'none'});
        createMenu(arrayOverview, colorArrayOverview, "Grading Scale: ");
        $(".Overview").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
    });
    
     $(".Prohibited").click(function(){ 
        d3.selectAll(".menu-options div").style({'background-color': '#00c6ff','color': '#fff','border-style': 'none'});
        createMenu(arrayProhibited, colorArrayProhibited, "Prohibited At: ");
            $(".Prohibited").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
     });
    
    $(".Counseling").click(function(){  
        d3.selectAll(".menu-options div").style({'background-color': '#00c6ff','color': '#fff','border-style': 'none'});
        createMenu(arrayCounseling, colorArrayCounseling, "Mandated Counseling: ")
        $(".Counseling").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
        });
    
    $(".Waiting").click(function(){  
        d3.selectAll(".menu-options div").style({'background-color': '#00c6ff','color': '#fff','border-style': 'none'});
        createMenu(arrayWaitingPeriod, colorArrayOverview, "Waiting Period: ")
        $(".Waiting").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
        });
    
    $(".Parental").click(function(){  
        d3.selectAll(".menu-options div").style({'background-color': '#00c6ff','color': '#fff','border-style': 'none'});
        createMenu(arrayConsent, colorArrayConsent, "Parental Consent: ")
        $(".Parental").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
});
    
    $(".Ultrasound").click(function(){
        d3.selectAll(".menu-options div").style({'background-color': '#00c6ff','color': '#fff','border-style': 'none'});
        createMenu(arrayUltrasound, colorArrayUltrasound, "Ultrasound: ")
        $(".Ultrasound").css({'background-color': '#fff','border-style': 'solid','border-color': '#00c6ff','border-width': '2px','color': '#00c6ff'});
});
}; //END drawMenu

function drawMenuInfo(){
    //creates menuBoxes
    menuInfoBox = d3.select(".menu-info")
            .append("svg")
            .attr("width", menuInfoWidth)
            .attr("height", menuInfoHeight)
            .attr("class", "menuInfoBox");
    
    //make menuInfoText Here
    var menuInfoText = menuInfoBox.selectAll(".menuInfoText")
        .data(textArray)
        .enter()
        .append("div")
        .attr("class", "menuInfoText")
        .text(function(d, i){
            for (var d = 0; d < textArray.length; d++){
                return textArray[i]
            }
        })
        .style({'font-size': '14px', 'font-family': 'Open Sans, sans-serif', 'float': 'left', 'color': '#000'});
    
    var dropdown = d3.select(".menu-info")
        .append("div")
        .attr("class", "dropdown")
        .append("select");
    
    dropdown.selectAll("options")
        .data(yearsArray)
        .enter()
        .append("option")
        .attr("value", function(d){ return d})
        .text(function(d){
            return d });
    
}; //End DrawMenuInfo

//creates the menu items 
function createMenu(arrayX, arrayY, title){
    var yArray = [50, 105, 160, 215, 270, 325];
    var oldItems = d3.selectAll(".menuBox").remove();
    
    //creates menuBoxes
    menuBox = d3.select(".menu-inset")
            .append("svg")
            .attr("width", menuWidth)
            .attr("height", menuHeight)
            .attr("class", "menuBox");
    
    //creates Menu Title
    var menuTitle = menuBox.append("text")
        .attr("x", 15)
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
            .attr("x", 20);
        
        menuItems.data(yArray)
            .attr("y", function(d, i){
                return d;
            });
    };
    
    var menuLabels = menuBox.selectAll(".menuLabels")
        .data(arrayX)
        .enter()
        .append("text")
        .attr("class", "menuLabels")
        .attr("x", 80)
        .text(function(d, i){
            for (var c = 0; c < arrayX.length; c++){
                return arrayX[i]
            }
        })
        .style({'font-size': '16px', 'font-family': 'Open Sans, sans-serif'});
    
        menuLabels.data(yArray)
            .attr("y", function(d, i){
                return d + 30;
            });
    
      /*  colorize function here
        menuItems.attr("fill", function(d, i){
        return colorize(legendArray[i]);
        })
    */
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
