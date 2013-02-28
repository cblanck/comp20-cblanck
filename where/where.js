function initialize() {
    var mapCanvas = document.getElementById("map_canvas");
    initMap();
    navigator.geolocation.getCurrentPosition(plotMap);
}

function plotMap(position){
	var curLocMarkerOpts = {
			map: stationMap,
			
		};
	var curLocMarker = new google.maps.Marker()
}

function initMap(){
		var mapOptions = {
            center: new google.maps.LatLng(42.405207,-71.119823),
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
		stationMap = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}
