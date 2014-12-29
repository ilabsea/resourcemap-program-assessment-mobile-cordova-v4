InvisibleLayer = {
  invisibleNameLatLng: function(locationId, nameId, callback) {
    var collection = JSON.parse(App.DataStore.get("collection"));
    if (collection.is_visible_location) {
      callback();
      $("#" + locationId).show();
    } else {
      $("#" + locationId).hide();
    }
    if (!collection.is_visible_name) {
      $("#" + nameId).hide();
    } else {
      $("#" + nameId).show();
    }
  }
};