var FieldOfflineController = {
  renderByCollectionId: function () {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function (fields) {
      var field_id_arr = new Array();
      var field_collections = [];
      var location_fields_id = [];
      fields.forEach(function (field) {
        $.map(field.fields(), function (fieldsInfield) {
          field_id_arr.push(fieldsInfield.idfield);
          if (fieldsInfield.kind === "location")
            location_fields_id.push(fieldsInfield.idfield);
        });
        var item = FieldHelper.buildField(field._data,
            {fromServer: false}, "");
        field_collections.push(item);
      });
      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));
      FieldView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu'),
          {field_collections: field_collections}, "");
      FieldView.display("field/add.html", $('#div_field_collection'), "",
          {field_collections: field_collections}, false);
    });
  },
  renderUpdate: function (site) {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function (layers) {
      var field_collections = FieldHelper.buildFieldsUpdate(layers, site, false, "");
      FieldView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu-update'),
          {field_collections: field_collections}, "update_");
      FieldView.display("field/updateOffline.html",
          $('#div_update_field_collection'), "update_",
          {field_collections: field_collections}, true);
    });
  }
};