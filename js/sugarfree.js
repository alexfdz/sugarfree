
function addPharmacies(map) {
    new google.maps.KmlLayer({
        url: 'https://sugarfree.io/map.kml?t=' + Date.now(),
        map: map,
        preserveViewport: true
    });
}

function addGeoMarker(map) {
    var geoMarker = new GeolocationMarker();
    geoMarker.setCircleOptions({ fillColor: '#808080' });

    google.maps.event.addListenerOnce(geoMarker, 'position_changed', function() {
        map.setCenter(this.getPosition());
        map.fitBounds(this.getBounds());
    });

    google.maps.event.addListener(geoMarker, 'geolocation_error', function(e) {
        ga('send', 'event', 'map', 'geolocation_error', e.message);
    });

    geoMarker.setMap(map);
}

function addSearchBox(map) {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                ga('send', 'event', 'map', 'search_error', "no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
        ga('send', 'event', 'map', 'search');
    });

    input.style.display = 'block';
}

function setupContributeForm(){
    var addressContributeForm = document.getElementById('address-contribute');
    new google.maps.places.SearchBox(addressContributeForm);
}

google.maps.event.addDomListener(window, 'load', function() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        fullscreenControl: false
    });

    addPharmacies(map);
    addSearchBox(map);
    addGeoMarker(map);
    setupContributeForm();
});