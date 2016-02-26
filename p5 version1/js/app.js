
var map;
/*
Start here! initializeMap() is called when page is loaded.
*/
function initializeMap() {

  var mapOptions = {
    zoom: 8,
  };

  map = new google.maps.Map(document.querySelector('#map-canvas'), mapOptions);

  /*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  function createMapMarker(placeData) {

    // The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.name;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name,
      animation: google.maps.Animation.DROP,
    });

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    var infoWindow = new google.maps.InfoWindow({
      content: name
    });

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map, marker);
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for(var i = 0; i < results.length; i++) {
        console.log("create marker", results);
        createMapMarker(results[i]);
      }
    }
    else
      console.log("place not found");
  }

  /*
  pinPoster(locations) takes in the array of locations
  and fires off Google place searches for each location
  */
  function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    var bangalore = new google.maps.LatLng(12.978825, 77.599719);
    // Iterates through the array of locations, creates a search object for each location
    //for (var place in locations) {
      // the search request object
      var request = {
        location: bangalore,
        radius: 1000,
        types: ['book_store', 'art_gallery','beauty_salon','bar']
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.nearbySearch(request, callback);
    //}
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  pinPoster(locations);

}
// Calls the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
  //Make sure the map bounds get updated on page resize
map.fitBounds(mapBounds);
});

var locations = ['hard rock cafe, bangalore', 'amoeba, church street, bangalore','matteo, church street, bangalore', 'social, church street, bangalore','chutney chang, museum road', 'bowring institue, bangalore', 'st. marks cathedral, bangalore', 'm chinnaswamy stadium, bangalore', 'high court of karnataka, bangalore', 'ulsoor lake pathway, bangalore'];

var ViewModel = function() {
  var self = this;
  this.locationList = ko.observableArray([]);
  locations.forEach(function(loc){
    self.locationList.push(loc);
  });

};

ko.applyBindings(new ViewModel());