var newFeatureArray = [];

for (var feature in joinedJson){
	var featureObj = joinedJson[feature];

	for (var i=1974; i<2015; i++){
		if (featureObj.properties[expressed][i] != featureObj.properties[expressed][i-1]){
			newFeatureArray.push({year: i, feature: featureObj}); //pushes the year and the feature object (state)
		}
	}
}

//[{year: 1980, feature: GEOJSON OBJECT}, {year: 1985, feature: GEOJSON OBJECT}]

//in selection, d == {year: 1980, feature: GEOJSON OBJECT}
	d.feature == geojson feature
	d.year == year changed (you can therefore send it to your scale as x(d.year))
    
    
    //copy html code
     <button type="button" class="btn btn-link btn-lg" aria-label="Step Backward Button">
                <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
            </button>
                
                 <button type="button" class="btn btn-link btn-lg" aria-label="Step Backward Button">
                <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
            </button>
                
    //copy js
    var textArray = ["The report card grade, created by NARAL, given to each state based on their policies regarding a woman's choice and access to abortions.", "States with laws that require biased-counseling to women seeking abortion services.", "States with laws that subject women seeking abortion services to biased-counseling requirements.", "States where a woman must wait a designated period of time after counseling before having an abortion.", "States with laws restricting young women's access to abortion services by mandating parental consent.", "States where an ultrasound either must be performed, offered, or advised prior to an abortion.", "Crisis Pregnancy Centers are facilities that provide women with services and counseling to pregnant women, but appose abortion. CPC's are known for intimidating women about the dangers of abortion with inaccurate information.", "Abortion Providers are facilites that help with family planning, reproductive health, and educate people about safe sex. They do not promote abortion, but help women in need of one"];
var linkArray = ["<a href = '#jumpoverview'> Read More</a>", "<a href = '#jumpprohibted'> Read More</a>", "<a href = '#jumpconsent'> Read More</a>", "<a href = '#jumpcounseling'> Read More</a>", "<a href = '#jumpultra'> Read More</a>", "<a href = '#jumpcpc'> Read More</a>"];

