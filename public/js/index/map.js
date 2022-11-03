const host = location.protocol + '//' + location.host;

var lat = 20.5937;
var lon = 78.9629;

locationiq.key = 'pk.123ea4a1fd06066f2aa65928bb3d3ea5';
resetMap()

function setMap() {
    fetch(`https://us1.locationiq.com/v1/search?key=pk.123ea4a1fd06066f2aa65928bb3d3ea5&q=` + contry + `%20` + state + `%20` + city.value + `&format=json`, {
            method: "post"
        })
        .then(result => {
            return result.json();
        })
        .then(result => {
            var mapCordinat = result[0];
            bountry = mapCordinat.boundingbox;
            lat = mapCordinat.lat;
            lon = mapCordinat.lon;
            console.log(lat, lon);
            resetMap()
        })
        .catch(err => {
            console.log(err);
        })
}

function resetMap() {
    var map = new mapboxgl.Map({
        container: 'map',
        attributionControl: false,
        zoom: 3.5,
        center: [lon, lat]
    });
    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'bottom-right');
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }), 'bottom-right');

    var layerStyles = {
        "Streets": "streets/vector"
    };
    map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
    map.addControl(new locationiqLayerControl({
        key: locationiq.key,
        layerStyles: layerStyles
    }), 'bottom-right');
    map.addControl(new MapboxGeocoder({
        accessToken: locationiq.key,
        mapboxgl: mapboxgl,
        limit: 5,
        dedupe: 1,
        marker: {
            color: 'red'
        },
        flyTo: {
            screenSpeed: 7,
            speed: 4
        }
    }), 'top-left');

    fetch(host + '/property/locations', {
            method: 'GET',
        })
        .then(response => {
            return response.json();
        })
        .then(result => {
            if (result.statusCode == 200) {
                result.propertys.forEach(function (property) {
                    // create a DOM element for the marker
                    var el = document.createElement('div');
                    el.className = 'marker';
                    el.style.backgroundImage = 'url("' + property.photos[0].imageUrl + '")';
                    el.style.width = '50px';
                    el.style.height = '50px';
                    var prop = document.createElement('div')
                    prop.className = "container";
                    
                    var img = document.createElement('img');
                    img.className = "circal-avtar";
                    img.src = property.photos[0].imageUrl;
                    var link=document.createElement('a');
                    link.href = "/property/" + property._id;

                    var text = document.createElement('h3');
                    text.appendChild(document.createTextNode(property.basicDetail.noOfBhkOrRk + ' ' +
                        property.basicDetail.bhkOrRk +
                        ' ' +
                        property.basicDetail.propertyType +
                        ',at ' +
                        "₹ " +
                        property.priceArea.price.$numberDecimal + ' for ' +
                        property.actionType));
                    prop.appendChild(img);
                    link.appendChild(text);
                    prop.appendChild(link)
                    el.appendChild(prop);


                    //Instead of this click listener, we can attach a popup / infowindow to this marker (see next section)
                    el.addEventListener("mouseover", function () {
                        el.style.backgroundImage = 'none';
                        prop.style.display = "flex"

                    });
                    el.addEventListener("mouseout", function () {
                        el.style.backgroundImage = 'url("' + property.photos[0].imageUrl + '")';
                        prop.style.display = "none"
                    });

                    // add marker to map
                    new mapboxgl.Marker(el)
                        .setLngLat([property.basicDetail.coordinates.longitude, property.basicDetail.coordinates.latitude])
                        .addTo(map);
                });
            }
            console.log(result);

        })
        .catch(err => alert(err));
}