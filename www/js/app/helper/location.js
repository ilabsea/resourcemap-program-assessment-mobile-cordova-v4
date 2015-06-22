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
    var resultLocations = $.map(config.locations, function (location) {
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

    return resultLocations;
  },
  prepareLocation: function () {
    InvisibleLayer.invisibleNameLatLng("wrapSiteLocation", "wrapSiteName", function () {
      requireReload(function () {
        var lat = $("#lat").val();
        var lng = $("#lng").val();
        if (lat == "" && lng == "") {
          Location.getCurrentLocation();
        }
      });
    });
  }
};