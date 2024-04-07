const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
let quakeMarkers = [];
let depths = [];

// request to the data/
d3.json(url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    console.log(data.features);
    createMarkers(data.features);
});

function markerSize(mag) {
    return mag * mag * mag * 800;
    console.log('markerSize ran');
}
let colors = ["#f40605", "#f49505", "#f4b405", "#f4df05", "#b6f405", "#4cf405"]
function markerColor(depth) {
    if (depth < 5) {
        return colors[0]
    } else if (depth < 15) {
        return colors[1]
    } else if (depth < 30) {
        return colors[2]
    } else if (depth < 60) {
        return colors[3]
    } else if (depth < 120) {
        return colors[4]
    } else {
        return colors[5]
    };
}

function createMarkers(earthquakes) {
    for (let i = 0; i < earthquakes.length; i++) {
        depths.push(earthquakes[i].geometry.coordinates[2]);
        quakeMarkers.push(L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: markerColor(earthquakes[i].geometry.coordinates[2]),
            fillColor: markerColor(earthquakes[i].geometry.coordinates[2]),
            radius: markerSize(earthquakes[i].properties.mag),
        }).bindPopup(`<h3>${earthquakes[i].properties.title}</h3> <hr> 
        <h3> depth:  ${earthquakes[i].geometry.coordinates[2]}  km </h3>`));
    }
    // Create a layer that contains the markers array on the earthquakes object.
    let quakeLayer = L.layerGroup(quakeMarkers);

    // Send our earthquakes layer to the createMap function/
    createMap(quakeLayer);

    // Send depths to the legend function
    // console.log(depths);
    // console.log("detphs sent to legend");
    // legend(depths);
}

function createMap(quakeLayer) {

    // Create the base layer.

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    

    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: quakeLayer
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [
            41.5, -90.1
        ],
        zoom: 5,
        layers: [street, quakeLayer]
    });
    console.log("map added");
    createLegend();
}

function createLegend() {
  
    // Set up the legend with a function
    var legend = L.control({ position: "BottomRight" });
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        let labels = ['< 5', '< 15', '< 30', '< 60', '< 120', '> 120'];
        let colors = ["#f40605", "#f49505", "#f4b405", "#f4df05", "#b6f405", "#4cf405"]
        div.innerHTML = '<h4>Depths</h4>';
        console.log(div.innerHTML);

        for (let index = 0; index < labels.length; index++) {
            div.innerHTML +=
                '<i style= "background:' + colors[index] + '"></i> ' + labels[index] + '<br>';
        }
        return div;
    };

    legend.addTo(map);
}
