

var username = "mtayyab12";
var request = new XMLHttpRequest();
var address;
var marker;
var infowindow;


//initialize() which initiates map to a location
function initialize() {
  var latLng = new google.maps.LatLng(32.75, -97.13); 
  var mapProp = {
    center:latLng,
    zoom:17,
    mapTypeId:google.maps.MapTypeId.ROADMAP
    };
  var map=new google.maps.Map(document.getElementById("map"),mapProp);
  infowindow = new google.maps.InfoWindow();
   
   //initialize map
	
	//Initialize a mouse click event on map which then calls reversegeocode function
  google.maps.event.addListener(map,'click',function(evt) {
   
   placeMarker(evt.latLng); 
   reversegeocode();
   
   
  });
 //placeMarker() helps to set the marker on the map where it is clicked
 function placeMarker(location) {
    if (marker == undefined){
        marker = new google.maps.Marker({
        position: location,
        map: map,
        animation: google.maps.Animation.BOUNCE
      });
     }
    else{
        marker.setPosition(location);
        }
    map.setCenter(location);
             
        }
}



// Reserse Geocoding i-e  getting address from the given marker's coordinates 
function reversegeocode() {   
	var coordinates  = marker.getPosition();
	var lats = marker.getPosition().lat();
	var lngs = marker.getPosition().lng();
	var geocoder = new google.maps.Geocoder;
	
  //console.log(lats + " " + lngs);
	geocoder.geocode({'latLng': coordinates}, function(results, status)
    {
        if (status == google.maps.GeocoderStatus.OK)
        {
            if (results[0])
            {
               
				address= results[0].formatted_address;
			}
            else
            {
                alert("No results found");
            }
        }
        else
        {
            alert("Geocoder failed due to: " + status);
        }
		console.log(address);
    sendRequest(lats,lngs);
    });
	
	
  //get the latitude and longitude from the mouse click and get the address.
  //call geoname api asynchronously with latitude and longitude 
  
}// end of geocodeLatLng()



function displayResult () {
   

   if (request.readyState == 4) {
	   console.log("in the displayResult fuinction");
        var xml = request.responseXML.documentElement;
        var temperature = xml.getElementsByTagName("temperature")[0].childNodes[0].nodeValue;
		var windspeed = xml.getElementsByTagName("windSpeed")[0].childNodes[0].nodeValue;
		var clouds = xml.getElementsByTagName("clouds")[0].childNodes[0].nodeValue;
	    console.log("temp equals"+temperature);
	    var div = document.getElementById("output");
	    div.innerHTML = div.innerHTML+"&#13"+ 
	                   "address: " +address+"&#13" + 
	                   "temperature:" +temperature+"&#13"+
	                   "wind speed: "+windspeed+"&#13"+
					   "clouds: "+clouds+"&#13";
	
	    console.log(address);
	    infowindow.setContent("address: "+address+ '</br>'+ "temperature: "+temperature+ '</br>'+ "windspeed: "+windspeed+'</br>'+ "clouds: "+clouds);
	    infowindow.open(map, marker);
    }
}

function sendRequest (lats,lngs) {
    request.onreadystatechange = displayResult;
    var lat = lats;
    var lng = lngs;
	var uri = encodeURI("http://api.geonames.org/findNearByWeatherXML?lat="+lat+"&lng="+lng+"&username="+username);
    request.open("GET",uri,true);
    //request.withCredentials = "true";
    request.send(null);
	
}

function eraseText(){
	document.getElementById("output").innerHTML = "";
	
}
