debug = null;
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

function initialize() {
    var mapCanvas = document.getElementById("map_canvas");
    initMap();
    navigator.geolocation.getCurrentPosition(plotMap);
}

function plotMap(position){
	markers = [];
    var lineCoords = [];
    var closestStation = null;
    var curLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var curLocMarker = 
        new google.maps.Marker({
            position: curLoc,
            map: stationMap,
        });
    stations = parseCSV(horribleString);
    for(var i=0; i<stations.length; i++){
        lineCoords.push(new google.maps.LatLng(stations[i][13], stations[i][14]));
        if(closestStation != null){
            var dist = getDist(curLoc, stations[i]);
            if(dist < closestStation.dist){
                closestStation = {
                    station: stations[i],
                    dist: dist
                };
            }
        } else {
            closestStation = {
                station: stations[i],
                dist: getDist(curLoc, stations[i])
            };
        }
    }
    getTrainSchedule();
    google.maps.event.addListener(curLocMarker, 'click', function() {
        var infoWindow = new google.maps.InfoWindow({
            content: "<p>Current Location<br />Closest station is " + closestStation.station[11] + 
                "<br />" + closestStation.dist + " miles away"
        });
        infoWindow.open(stationMap, curLocMarker);
    });
    console.log(closestStation);
    console.log(lineCoords);
    createPolyLine(lineCoords);
}

function createPolyLine(lineCoords){
    var line = new google.maps.Polyline({
        path: lineCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 5
    });
    line.setMap(stationMap);
}

function makeStationMarker(station, response){
    var image = "walrus.png";
    var stationSchedule = [];
    var stationMarker = 
        new google.maps.Marker({
            position: new google.maps.LatLng(station[13], station[14]),
            map: stationMap,
            icon: image
        });
    for(var i=0; i<response.length; i++){
        if(response[i].PlatformKey.substr(0,4) == station[1].substr(0,4)){
            stationSchedule.push("<li>" + response[i].Time + " " + response[i].TimeRemaining + "</li>");
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
    console.log(stationInfo);
}

function getDist (curLoc, station){
    var R = 6371;
    var sLat = station[13];
    var sLong = station[14];
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

function getTrainSchedule() {
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
    if (request == null) {
      alert("Error creating request object --Ajax not supported?");
    } else {
        console.log("got to before onreadystatechange");
        request.onreadystatechange = callback;
        request.onerror = requestFailure;
        request.open("get", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", true);
        request.send(null);
    }
}

function callback(){
    if (this.readyState === 4 && this.status == 200){
        var str = this.responseText;
        console.log("got response!");
        try{
            var response = JSON.parse(str);
            debug = response;
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
