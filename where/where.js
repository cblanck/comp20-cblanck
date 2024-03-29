//Please excuse this disgusting string
horribleString = ["Red,RALEN,ALEWIFE NB,ALEWIFE,17,FALSE,TRUE,Trunk,NB,place-alfcl,,Alewife Station,,42.395428,-71.142483",
                        "Red,RDAVN,DAVIS NB,DAVIS,16,FALSE,FALSE,Trunk,NB,place-davis,,Davis Station,,42.39674,-71.121815",
                        "Red,RPORN,PORTER NB,PORTER,15,FALSE,FALSE,Trunk,NB,place-portr,,Porter Square Station,,42.3884,-71.119149",
                        "Red,RHARN,HARVARD NB,HARVARD,14,FALSE,FALSE,Trunk,NB,place-harsq,,Harvard Square Station,,42.373362,-71.118956",
                        "Red,RCENN,CENTRAL NB,CENTRAL,13,FALSE,FALSE,Trunk,NB,place-cntsq,,Central Square Station,,42.365486,-71.103802",
                        "Red,RKENN,KENDALL NB,KENDALL,12,FALSE,FALSE,Trunk,NB,place-knncl,,Kendall/MIT Station,,42.36249079,-71.08617653",
                        "Red,RMGHN,CHARLES MGH NB,CHARLES MGH,11,FALSE,FALSE,Trunk,NB,place-chmnl,,Charles/MGH Station,,42.361166,-71.070628",
                        "Red,RPRKN,PARK NB,PARK,10,FALSE,FALSE,Trunk,NB,place-pktrm,,Park St. Station,,42.35639457,-71.0624242",
                        "Red,RDTCN,DOWNTOWN CROSSING NB,DOWNTOWN CROSSING,9,FALSE,FALSE,Trunk,NB,place-dwnxg,,Downtown Crossing Station,,42.355518,-71.060225",
                        "Red,RSOUN,SOUTH STATION NB,SOUTH STATION,8,FALSE,FALSE,Trunk,NB,place-sstat,,South Station,,42.352271,-71.055242",
                        "Red,RBRON,BROADWAY NB,BROADWAY,7,FALSE,FALSE,Trunk,NB,place-brdwy,,Broadway Station,,42.342622,-71.056967",
                        "Red,RANDN,ANDREW NB,ANDREW,6,FALSE,FALSE,Trunk,NB,place-andrw,,Andrew Station,,42.330154,-71.057655",
                        "Red,RJFKN,JFK NB,JFK,5,FALSE,FALSE,Trunk,NB,place-jfkred,,JFK/UMass Station,,42.320685,-71.052391",
                        "Red,RSAVN,SAVIN HILL NB,SAVIN HILL,4,FALSE,FALSE,Ashmont,NB,place-shmnl,,Savin Hill Station,,42.31129,-71.053331",
                        "Red,RFIEN,FIELDS CORNER NB,FIELDS CORNER,3,FALSE,FALSE,Ashmont,NB,place-fldcr,,Fields Corner Station,,42.300093,-71.061667",
                        "Red,RSHAN,SHAWMUT NB,SHAWMUT,2,TRUE,FALSE,Ashmont,NB,place-smmnl,,Shawmut Station,,42.29312583,-71.06573796",
                        "Red,RNQUN,NORTH QUINCY NB,NORTH QUINCY,4,FALSE,FALSE,Braintree,NB,place-nqncy,,North Quincy Station,,42.275275,-71.029583",
                        "Red,RWOLN,WOLLASTON NB,WOLLASTON,3,FALSE,FALSE,Braintree,NB,place-wlsta,,Wollaston Station,,42.2665139,-71.0203369",
                        "Red,RQUCN,QUINCY CENTER NB,QUINCY CENTER,2,FALSE,FALSE,Braintree,NB,place-qnctr,,Quincy Center Station,,42.251809,-71.005409",
                        "Red,RQUAN,QUINCY ADAMS NB,QUINCY ADAMS,1,TRUE,FALSE,Braintree,NB,place-qamnl,,Quincy Adams Station,,42.233391,-71.007153",
                        "Red,RBRAS,BRAINTREE SB,BRAINTREE,17,FALSE,TRUE,Braintree,SB,place-brntn,,Braintree Station,,42.2078543,-71.0011385"].join("\n");

//Initializes the entirety of the map and all markers within
function initialize() {
    var mapCanvas = document.getElementById("map_canvas");
    initMap();
    navigator.geolocation.getCurrentPosition(plotMap);
}

//Given the position of the client, creates a marker at their location,
//as well as all the markers for each station and the markers for Carmen
//and Waldo when possible
function plotMap(position){
	markers = [];
    var lineCoords = [];
    var closestStation = null;
    curLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var curLocMarker = 
        new google.maps.Marker({
            position: curLoc,
            map: stationMap,
        });
    stations = parseCSV(horribleString);
    var latLng = {
        lat: 0,
        long: 0
    };
    for(var i=0; i<stations.length; i++){
        latLng.lat = stations[i][13];
        latLng.long = stations[i][14];
        lineCoords.push(new google.maps.LatLng(stations[i][13], stations[i][14]));
        if(closestStation != null){
            var dist = getDist(latLng);
            if(dist < closestStation.dist){
                closestStation = {
                    station: stations[i],
                    dist: dist
                };
            }
        } else {
            closestStation = {
                station: stations[i],
                dist: getDist(latLng)
            };
        }
    }
    getTrainSchedule();
    getWaldoAndCarmen();
    google.maps.event.addListener(curLocMarker, 'click', function() {
        var infoWindow = new google.maps.InfoWindow({
            content: "<p>Current Location<br />Closest station is " + closestStation.station[11] + 
                "<br />" + closestStation.dist.toFixed(2) + " miles away"
        });
        infoWindow.open(stationMap, curLocMarker);
    });
    createPolyLine(lineCoords);
}

//Given a list of coordinates in google.maps.LatLng format, produces
//a red polyline connecting all locations (default map is stationMap)
function createPolyLine(lineCoords){
    var line = new google.maps.Polyline({
        path: lineCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 5
    });
    line.setMap(stationMap);
}

//Given a station in object format and a schedule for all stations, this
//will create and return a station marker with a listener that opens an
//info window displaying the station schedule upon clicking
function makeStationMarker(station, response){
    var image = "walrus.png";
    var stationSchedule = "<table class=\"schedule\" border=\"1\"><tr><th>Trip#</th><th>Direction</th><th>Time Remaining</th></tr>";
    var stationMarker = 
        new google.maps.Marker({
            position: new google.maps.LatLng(station[13], station[14]),
            map: stationMap,
            icon: image
        });
    for(var i=0; i<response.length; i++){
        if(response[i].PlatformKey.substr(0,4) == station[1].substr(0,4)){
            var direction;
            if(response[i].PlatformKey.substr(4,5) == "S"){
                direction = "Southbound";
            }else{
                direction = "Northbound";
            }
            stationSchedule += "<tr><td>" + response[i].Trip + "</td><td>" + direction + "</td><td>" + response[i].TimeRemaining + "</td></tr>";
        }
    }
    google.maps.event.addListener(stationMarker, 'click', function() {
        var infoWindow = new google.maps.InfoWindow({
            content: station[11] + "<p><ul>" + stationSchedule + "</ul>"
        });
        infoWindow.open(stationMap, stationMarker);
    });
    return stationMarker;
}

//Sets up map before asking for the users location (default center near Tufts)
function initMap(){
    var mapOptions = {
        center: new google.maps.LatLng(42.405207,-71.119823),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    stationMap = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

function parseCSV (csv) {
    var stationInfo = csv.split("\n");
    for(var i=0; i<stationInfo.length; i++){
        var singleStation = stationInfo[i].split(",");
        stationInfo[i] = singleStation;
    }
    return stationInfo;
}

function getDist (dest){
    var R = 6371;
    var sLat = dest.lat;
    var sLong = dest.long;
    var cLat = curLoc.lat();
    var cLong = curLoc.lng();
    var x1 = sLat-cLat;
    var dLat = toRad(x1);
    var x2 = sLong-cLong;
    var dLon = toRad(x2);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                    Math.cos(toRad(cLat)) * Math.cos(toRad(sLat)) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

function toRad(num) {
    return num * Math.PI / 180;
};

function makeRequestObject(){
    var request;
    try {
      request = new XMLHttpRequest();
    }
    catch (ms1) {
      try {
        request = new ActiveXObject("Msxml2.XMLHTTP");
      }
      catch (ms2) {
        try {
          request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (ex) {
          request = null;
        }
      }
    }
    return request;
}

//Sets up the AJAX request for the location of Waldo and Carmen
function getWaldoAndCarmen(){
    var request = makeRequestObject();
    if (request == null) {
        alert("Error creating request object --Ajax not supported?");
    } else {
        request.onreadystatechange = waldoCallback;
        request.onerror = waldoFailureNotice;
        request.open("get", "http://messagehub.herokuapp.com/a3.json", true);
        request.send(null);
    }
}

//Upon failure, notifies the client that it could not find either person
function waldoFailureNotice(){
    var infowindow = new google.maps.InfoWindow({
        content: "Cannot find Waldo or Carmen!",
        position: new google.maps.LatLng(42.36032,-71.037941)
    });
    infowindow.open(stationMap);
}

//Sets up the AJAX request for retrieving the train schedules
function getTrainSchedule() {
    var request = makeRequestObject();
    if (request == null) {
        alert("Error creating request object --Ajax not supported?");
    } else {
        request.onreadystatechange = stationCallback;
        request.onerror = requestFailure;
        request.open("get", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", true);
        request.send(null);
    }
}

//Upon a successful AJAX request for the location of Waldo and Carmen,
//this function will parse the response and place markers at where they
//are located, as well as how far away they are
function waldoCallback(){
    if (this.readyState === 4 && this.status == 200){
        var str = this.responseText;
        var waldopic = 'waldo.png';
        var carmenpic = 'carmen.png';
        var waldodist = "Did not find Waldo";
        var carmendist = "Did not find Carmen";
        try{
            var response = JSON.parse(str);
            debug2 = response;
            for(var i=0; i<response.length; i++){
                var curImage;
                var latLng = {
                    lat: response[i].loc.latitude,
                    long: response[i].loc.longitude
                }
                if(response[i].name == "Waldo"){
                    curImage = waldopic;
                    waldodist = "Waldo found " + getDist(latLng).toFixed(2) + " miles away from you";
                } else {
                    curImage = carmenpic;
                    carmendist = "Carmen found " + getDist(latLng).toFixed(2) + " miles away from you";
                }
                var personMarker = 
                    new google.maps.Marker({
                        position: new google.maps.LatLng(response[i].loc.latitude,
                                    response[i].loc.longitude),
                        map: stationMap,
                        icon: curImage,
                    });
            }
            var infowindow = new google.maps.InfoWindow({
                content: waldodist + " and " + carmendist,
                position: new google.maps.LatLng(42.36032,-71.037941),
                maxWidth: 200
            });
            infowindow.open(stationMap);
        } catch (error){
            console.log("Failed to parse JSON string");
        }
    }
}

//Upon a successful AJAX request for the station schedule, this function
//will parse the response create a marker for each station
function stationCallback(){
    if (this.readyState === 4 && this.status == 200){
        var str = this.responseText;
        try{
            var response = JSON.parse(str);
            for (var i=0; i<stations.length; i++){
                markers.push(makeStationMarker(stations[i], response));
            }            
        } catch (error){
             console.log("Failed to parse JSON string");
        }
    }
}

function requestFailure () {
    alert("failed to receive AJAX response");
}
