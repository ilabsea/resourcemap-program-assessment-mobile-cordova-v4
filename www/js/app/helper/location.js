var Location = {
  calculateDistance: function (fromLat, fromLng, toLat, toLng) {
    var fromLatlng = new google.maps.LatLng(fromLat, fromLng);
    var toLatlng = new google.maps.LatLng(toLat, toLng);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(fromLatlng, toLatlng);
    return distance;
  },
  getLocations: function (fromLat, fromLng, config) {
    var resultLocations = $.map(config.locations, function(location){
      var distance = Location.calculateDistance(fromLat, fromLng, location.latitude, location.longitude );
      if(distance < parseFloat(config.maximumSearchLength)){
        return location;
      }
    });
    return resultLocations;
  }
};