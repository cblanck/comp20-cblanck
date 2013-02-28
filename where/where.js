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
    stations = parseCSV("Red,RALEN,ALEWIFE NB,ALEWIFE,17,FALSE,TRUE,Trunk,NB,place-alfcl,,Alewife Station,,42.395428,-71.142483
                        Red,RDAVN,DAVIS NB,DAVIS,16,FALSE,FALSE,Trunk,NB,place-davis,,Davis Station,,42.39674,-71.121815
                        Red,RDAVS,DAVIS SB,DAVIS,1,TRUE,FALSE,Trunk,SB,place-davis,,Davis Station,,42.39674,-71.121815
                        Red,RPORN,PORTER NB,PORTER,15,FALSE,FALSE,Trunk,NB,place-portr,,Porter Square Station,,42.3884,-71.119149
                        Red,RPORS,PORTER SB,PORTER,2,FALSE,FALSE,Trunk,SB,place-portr,,Porter Square Station,,42.3884,-71.119149
                        Red,RHARN,HARVARD NB,HARVARD,14,FALSE,FALSE,Trunk,NB,place-harsq,,Harvard Square Station,,42.373362,-71.118956
                        Red,RHARS,HARVARD SB,HARVARD,3,FALSE,FALSE,Trunk,SB,place-harsq,,Harvard Square Station,,42.373362,-71.118956
                        Red,RCENN,CENTRAL NB,CENTRAL,13,FALSE,FALSE,Trunk,NB,place-cntsq,,Central Square Station,,42.365486,-71.103802
                        Red,RCENS,CENTRAL SB,CENTRAL,4,FALSE,FALSE,Trunk,SB,place-cntsq,,Central Square Station,,42.365486,-71.103802
                        Red,RKENN,KENDALL NB,KENDALL,12,FALSE,FALSE,Trunk,NB,place-knncl,,Kendall/MIT Station,,42.36249079,-71.08617653
                        Red,RKENS,KENDALL SB,KENDALL,5,FALSE,FALSE,Trunk,SB,place-knncl,,Kendall/MIT Station,,42.36249079,-71.08617653
                        Red,RMGHN,CHARLES MGH NB,CHARLES MGH,11,FALSE,FALSE,Trunk,NB,place-chmnl,,Charles/MGH Station,,42.361166,-71.070628
                        Red,RMGHS,CHARLES MGH SB,CHARLES MGH,6,FALSE,FALSE,Trunk,SB,place-chmnl,,Charles/MGH Station,,42.361166,-71.070628
                        Red,RPRKN,PARK NB,PARK,10,FALSE,FALSE,Trunk,NB,place-pktrm,,Park St. Station,,42.35639457,-71.0624242
                        Red,RPRKS,PARK SB,PARK,7,FALSE,FALSE,Trunk,SB,place-pktrm,,Park St. Station,,42.35639457,-71.0624242
                        Red,RDTCN,DOWNTOWN CROSSING NB,DOWNTOWN CROSSING,9,FALSE,FALSE,Trunk,NB,place-dwnxg,,Downtown Crossing Station,,42.355518,-71.060225
                        Red,RDTCS,DOWNTOWN CROSSING SB,DOWNTOWN CROSSING,8,FALSE,FALSE,Trunk,SB,place-dwnxg,,Downtown Crossing Station,,42.355518,-71.060225
                        Red,RSOUN,SOUTH STATION NB,SOUTH STATION,8,FALSE,FALSE,Trunk,NB,place-sstat,,South Station,,42.352271,-71.055242
                        Red,RSOUS,SOUTH STATION SB,SOUTH STATION,9,FALSE,FALSE,Trunk,SB,place-sstat,,South Station,,42.352271,-71.055242
                        Red,RBRON,BROADWAY NB,BROADWAY,7,FALSE,FALSE,Trunk,NB,place-brdwy,,Broadway Station,,42.342622,-71.056967
                        Red,RBROS,BROADWAY SB,BROADWAY,10,FALSE,FALSE,Trunk,SB,place-brdwy,,Broadway Station,,42.342622,-71.056967
                        Red,RANDN,ANDREW NB,ANDREW,6,FALSE,FALSE,Trunk,NB,place-andrw,,Andrew Station,,42.330154,-71.057655
                        Red,RANDS,ANDREW SB,ANDREW,11,FALSE,FALSE,Trunk,SB,place-andrw,,Andrew Station,,42.330154,-71.057655
                        Red,RJFKN,JFK NB,JFK,5,FALSE,FALSE,Trunk,NB,place-jfkred,,JFK/UMass Station,,42.320685,-71.052391
                        Red,RJFKS,JFK SB,JFK,12,FALSE,FALSE,Trunk,SB,place-jfkred,,JFK/UMass Station,,42.320685,-71.052391
                        Red,RSAVN,SAVIN HILL NB,SAVIN HILL,4,FALSE,FALSE,Ashmont,NB,place-shmnl,,Savin Hill Station,,42.31129,-71.053331
                        Red,RSAVS,SAVIN HILL SB,SAVIN HILL,13,FALSE,FALSE,Ashmont,SB,place-shmnl,,Savin Hill Station,,42.31129,-71.053331
                        Red,RFIEN,FIELDS CORNER NB,FIELDS CORNER,3,FALSE,FALSE,Ashmont,NB,place-fldcr,,Fields Corner Station,,42.300093,-71.061667
                        Red,RFIES,FIELDS CORNER SB,FIELDS CORNER,14,FALSE,FALSE,Ashmont,SB,place-fldcr,,Fields Corner Station,,42.300093,-71.061667
                        Red,RSHAN,SHAWMUT NB,SHAWMUT,2,TRUE,FALSE,Ashmont,NB,place-smmnl,,Shawmut Station,,42.29312583,-71.06573796
                        Red,RSHAS,SHAWMUT SB,SHAWMUT,15,FALSE,FALSE,Ashmont,SB,place-smmnl,,Shawmut Station,,42.29312583,-71.06573796
                        Red,RASHS,ASHMONT SB,ASHMONT,16,FALSE,TRUE,Ashmont,SB,place-asmnl,,Ashmont Station,,42.284652,-71.064489
                        Red,RNQUN,NORTH QUINCY NB,NORTH QUINCY,4,FALSE,FALSE,Braintree,NB,place-nqncy,,North Quincy Station,,42.275275,-71.029583
                        Red,RNQUS,NORTH QUINCY SB,NORTH QUINCY,13,FALSE,FALSE,Braintree,SB,place-nqncy,,North Quincy Station,,42.275275,-71.029583
                        Red,RWOLN,WOLLASTON NB,WOLLASTON,3,FALSE,FALSE,Braintree,NB,place-wlsta,,Wollaston Station,,42.2665139,-71.0203369
                        Red,RWOLS,WOLLASTON SB,WOLLASTON,14,FALSE,FALSE,Braintree,SB,place-wlsta,,Wollaston Station,,42.2665139,-71.0203369
                        Red,RQUCN,QUINCY CENTER NB,QUINCY CENTER,2,FALSE,FALSE,Braintree,NB,place-qnctr,,Quincy Center Station,,42.251809,-71.005409
                        Red,RQUCS,QUINCY CENTER SB,QUINCY CENTER,15,FALSE,FALSE,Braintree,SB,place-qnctr,,Quincy Center Station,,42.251809,-71.005409
                        Red,RQUAN,QUINCY ADAMS NB,QUINCY ADAMS,1,TRUE,FALSE,Braintree,NB,place-qamnl,,Quincy Adams Station,,42.233391,-71.007153
                        Red,RQUAS,QUINCY ADAMS SB,QUINCY ADAMS,16,FALSE,FALSE,Braintree,SB,place-qamnl,,Quincy Adams Station,,42.233391,-71.007153
                        Red,RBRAS,BRAINTREE SB,BRAINTREE,17,FALSE,TRUE,Braintree,SB,place-brntn,,Braintree Station,,42.2078543,-71.0011385")
}
