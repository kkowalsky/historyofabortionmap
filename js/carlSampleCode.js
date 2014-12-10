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