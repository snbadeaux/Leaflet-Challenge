// Define the url for the GeoJSON earthquake data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Retrieve and add the earthquake data to the map
d3.json(url).then(function(data) {
    function mapStyle(feature) {
        return {
            fillOpacity: 0.5,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };

    // Set up colors based on depth function
    }
    function mapColor(depth){
        if (depth < 10) return "lightgreen";
        else if (depth < 30) return "greenyellow";
        else if (depth < 50) return "yellow";
        else if (depth < 70) return "orange";
        else if (depth < 90) return "orangered";
        else return "red";
    }

    // Set up marker size based on magnitude
    function markerSize(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag * 4;
    }

    // Add earthquake data to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {
            return L.circleMarker(latlon);
        },
        style: mapStyle,

        // Activate pop-up data when circles are clicked
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);

// Add the legend with colors to corrolate with depth
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (let i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
    return div;
    };
legend.addTo(myMap)
});