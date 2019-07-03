// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

var markersMag = [];
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
//   console.log(data);
  createFeatures(data.features);
});
// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 100000;
}

function getColor(d) {
    return d > 5 ? 'red' :
           d > 4 ? 'darkorange' :
           d > 3 ? 'orange' :
           d > 2 ? 'yellow' :
           d > 1 ? 'lightgreen' :
                 'green';
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      var magnitude =+ feature["properties"]["mag"];
      if (magnitude < 1) {
      markersMag.push(
        L.circle([feature["geometry"]["coordinates"][1], feature["geometry"]["coordinates"][0]], 
        {fillColor: getColor(magnitude),
        stroke: false,
        fillOpacity: 0.5,
        radius: markerSize(magnitude)})
        );
    }else if (magnitude >=1 && magnitude < 2) {
        markersMag.push(
            L.circle([feature["geometry"]["coordinates"][1], feature["geometry"]["coordinates"][0]], 
            {fillColor: getColor(magnitude),
            stroke: false,
            fillOpacity: 0.5,
            radius: markerSize(magnitude)})
            );
    }else if (magnitude >=2 && magnitude < 3) {
        markersMag.push(
            L.circle([feature["geometry"]["coordinates"][1], feature["geometry"]["coordinates"][0]], 
            {fillColor: getColor(magnitude),
            stroke: false,
            fillOpacity: 0.5,
            radius: markerSize(magnitude)})
            );
    }else if (magnitude >=3 && magnitude < 4) {
        markersMag.push(
            L.circle([feature["geometry"]["coordinates"][1], feature["geometry"]["coordinates"][0]], 
            {fillColor: getColor(magnitude),
            stroke: false,
            fillOpacity: 0.5,
            radius: markerSize(magnitude)})
            );
    }else if (magnitude >=4 && magnitude < 5) {
        markersMag.push(
            L.circle([feature["geometry"]["coordinates"][1], feature["geometry"]["coordinates"][0]], 
            {fillColor: getColor(magnitude),
            stroke: false,
            fillOpacity: 0.5,
            radius: markerSize(magnitude)})
            );
    }else
    {
        markersMag.push(
            L.circle([feature["geometry"]["coordinates"][1], feature["geometry"]["coordinates"][0]], 
            {fillColor: getColor(magnitude),
            stroke: false,
            fillOpacity: 0.5,
            radius: markerSize(magnitude)})
            );
    }
    
  }
 
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
 console.log(earthquakes);
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
  var MagnSize = L.layerGroup(markersMag);
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes

  };

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:'+ getColor(grades[i] + 1) +'">mag</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes, MagnSize]
  });
  legend.addTo(myMap);
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
