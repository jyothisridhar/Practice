//Initial location data
//To do : may not require marker (?)
var locations = [{
        name: 'hard rock cafe, bangalore',
        marker: null
      },
      {
        name: 'Church street Social, bangalore',
        marker: null
      },
      {
        name: 'chutney chang, museum road, bangalore',
        marker: null
      },
      {
        name: 'bowring institue, bangalore',
        marker: null
      },
      {
        name: 'st. marks cathedral,bangalore',
        marker: null
      },
      {
        name: 'm chinnaswamy stadium, bangalore',
        marker: null
      },
      {
        name: 'high court of karnataka, bangalore',
        marker: null
      }];


var ViewModel = function() {
  var self = this;

  var Place = function(placeObj){
    this.locationName = placeObj.name;
    this.marker = null;
  };

  this.map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: {lat: 12.978825, lng: 77.599719},
    zoom: 8
  });

  this.allLocations = [];

  locations.forEach(function(place){
    self.allLocations.push(new Place(place));
  });

  this.allLocations.forEach(function(place){
    console.log(place.locationName);
    // self.pinPoster(place);
  });
  /*
    pinPoster(locations) takes in the array of locations
    and fires off Google place searches for each location
    */
  this.pinPoster = function(place){

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    // var bangalore = new google.maps.LatLng(12.978825, 77.599719);
    // //creates a search object for each location
    // var request = {
    //   location: bangalore,
    //   radius: 800,
    //   types: ['book_store', 'art_gallery','beauty_salon','bar']
    // };

    //service.nearbySearch(request, callback);

    //search request for default locations
    var requestDefault = {
      query: place.locationName
    };
    // Actually searches the Google Maps API for location data and runs the callback
    // function with the search results after each search.
    service.textSearch(requestDefault, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
          self.createMapMarker(results[0],place);
      }
    })
  };

  this.createMapMarker = function(placeData, placeObj) {
      var lat = placeData.geometry.location.lat();  // latitude from the place service
      var lon = placeData.geometry.location.lng();  // longitude from the place service
      var name = placeData.name;   // name of the place from the place service
      var bounds = window.mapBounds;            // current boundaries of the map window

      // marker is an object with additional data about the pin for a single location
      placeObj.marker = new google.maps.Marker({
        map: map,
        position: placeData.geometry.location,
        title: name,
        animation: google.maps.Animation.DROP,
      });

      var infoWindow = new google.maps.InfoWindow({
        content: name
      });

      google.maps.event.addListener(placeObj.marker, 'click', function() {
        placeObj.marker.setAnimation(google.maps.Animation.BOUNCE);
        infoWindow.open(map, marker);
        setTimeout(function() {
          placeObj.marker.setAnimation(null)
        }, 1000);
      });

      // this is where the pin actually gets added to the map.
      // bounds.extend() takes in a map location object
      bounds.extend(new google.maps.LatLng(lat, lon));
      // fit the map to the new marker
      map.fitBounds(bounds);
      // center the map
      map.setCenter(bounds.getCenter());
  };

  this.visibleLocations = ko.observableArray();

  this.allLocations.forEach(function(place){
    self.visibleLocations.push(place);
  });

  this.showLocation = function(markerLocation){
    console.log("marker: ", markerLocation);
    self.clearMarkers();
    // markerLocation.setMap(map);
  };

  this.clearMarkers = function(){
    self.setMapOnAll(null);
  };

  this.setMapOnAll = function(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  };

  window.mapBounds = new google.maps.LatLngBounds();
  window.addEventListener('resize', function(e) {
    //Make sure the map bounds get updated on page resize
    this.map.fitBounds(mapBounds);
  }); 
};

ko.applyBindings(new ViewModel());

