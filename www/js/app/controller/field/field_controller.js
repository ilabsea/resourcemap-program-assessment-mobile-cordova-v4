FieldController = {
  getByCollectionId: function () {
    if (App.isOnline())
      FieldOnlineController.renderByCollectionId();
    else
      FieldOfflineController.renderByCollectionId();
  },
  synForCurrentCollection: function (newFields) {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function (fields) {
      FieldOffline.remove(fields);
      FieldOffline.add(newFields);
    });
  },
  renderLocationField: function (textLat, textLng, prefixId) {
    var lat = $(textLat).val();
    var lng = $(textLng).val();
    var location_fields_id = JSON.parse(App.DataStore.get("location_fields_id"));
    for (var i in location_fields_id) {
      var id = location_fields_id[i];
      var config = JSON.parse(App.DataStore.get("configLocations_" + id));
      var locationOptions = Location.getLocations(lat, lng, config);
      if (locationOptions)
        config.locationOptions = locationOptions;
      var $element = $("#" + prefixId + id);
      FieldHelperView.displayLocationField("field/location.html", $element, {config: config});
    }
  }
};