var FieldOnlineController = {
  renderByCollectionId: function () {
    FieldModel.fetch(function (response) {
      var field_id_arr = new Array();
      var field_collections = [];
      var location_fields_id = new Array();
      $.map(response, function (properties) {
        $.map(properties.fields, function (fieldsInside) {
          field_id_arr.push(fieldsInside.id);
          if (fieldsInside.kind === "location")
            location_fields_id.push(fieldsInside.id);
        });
        var fields = FieldHelper.buildField(properties, {fromServer: true});
        field_collections.push(fields);
      });
      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));
      FieldController.synForCurrentCollection(field_collections);

      FieldHelperView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu'),
          {field_collections: field_collections}, "");
      FieldHelperView.display("field/add.html", $('#div_field_collection'), "",
          {field_collections: field_collections}, false);
      ViewBinding.setBusy(false);
      Location.prepareLocation();
    });
  },
  renderUpdate: function (site) {
    var field_id_arr = [];
    var location_fields_id = [];
    FieldModel.fetch(function (layers) {
      $.map(layers, function (fields) {
        $.map(fields.fields, function (field) {
          field_id_arr.push(field.id);
          if (field.kind === "location")
            location_fields_id.push(field.id);
        });
      });
      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));

      var field_collections = FieldHelper.buildFieldsUpdate(layers, site, true);
      FieldHelperView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu-update-online'),
          {field_collections: field_collections}, "update_online_");
      FieldHelperView.display("field/updateOnline.html",
          $('#div_update_field_collection_online'),
          "update_online_", {field_collections: field_collections}, true);
    });
  },
};