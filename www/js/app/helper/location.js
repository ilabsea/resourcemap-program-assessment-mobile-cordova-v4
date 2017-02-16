var Location = {
  calculateDistance: function (fromLat, fromLng, toLat, toLng) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(toLat - fromLat);
    var dLon = this.deg2rad(toLng - fromLng);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(fromLat)) * Math.cos(this.deg2rad(toLat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.asin(Math.sqrt(a));
    var d = R * c; // Distance in km
    return d * 1000;
  },
  deg2rad: function (deg) {
    return deg * (Math.PI / 180);
  },
  getLocations: function (fromLat, fromLng, config) {
    var resultLocations = "";
    if (config && config.locations) {
      resultLocations = $.map(config.locations, function (location) {
        var distance = Location.calculateDistance(fromLat, fromLng, location.latitude, location.longitude);
        if (distance < parseFloat(config.maximumSearchLength)) {
          location.distance = distance;
          return location;
        }
      });
      resultLocations.sort(function (a, b) {
        return parseFloat(a.distance) - parseFloat(b.distance);
      });

      resultLocations.splice(20, resultLocations.length);
    }

    return resultLocations;
  },

  getCurrentLocation: function () {
    cordova.plugins.locationServices.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;
      $("#site_lat").val(lat);
      $("#site_lng").val(lng);
      $("#mark_lat").val(lat);
      $("#mark_lng").val(lng);
    }, function (error) {
      alert("Location cannot be found.");
    }, {
      maximumAge: 6000
    });
  },

  prepareLocation: function () {
    Location.getCurrentLocation();
  }
};
