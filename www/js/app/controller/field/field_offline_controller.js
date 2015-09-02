var FieldOfflineController = {
  renderByCollectionId: function () {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function (fields) {
      var field_id_arr = new Array();
      var location_fields_id = [];
      if (fields.length == 0) {
        ViewBinding.setBusy(false);
        FieldHelperView.displayNoFields("field/no_field_pop_up.html", $('#page-pop-up-no-fields'));
        App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
        App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));
      } else {
        var field_collections = [];
        fields.forEach(function (field) {
          $.each(field.fields(), function (i, fieldsInfield) {
            field_id_arr.push(fieldsInfield.idfield);
            if (fieldsInfield.kind === "location")
              location_fields_id.push(fieldsInfield.idfield);
          });
          var item = FieldHelper.buildField(field._data, {fromServer: false});
          field_collections.push(item);
        });
        App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
        App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));
        FieldHelperView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu'),
            {field_collections: field_collections});
        FieldHelperView.display("field/form.html", $('#div_field_collection'), 
            {field_collections: field_collections}, false);
        ViewBinding.setBusy(false);
      }
    });
  },
  renderUpdate: function (site) {
    var field_id_arr = [];
    var location_fields_id = [];
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function (layers) {
      $.map(layers, function (layer) {
        $.map(layer._data.fields, function (field) {
          field_id_arr.push(field.idfield);
          if (field.kind === "location")
            location_fields_id.push(field.id);
        });
      });
      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));

      var field_collections = FieldHelper.buildFieldsUpdate(layers, site, false);
      FieldHelperView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu-update'),
          {field_collections: field_collections});
      FieldHelperView.display("field/form.html",
          $('#div_field_collection'), 
          {field_collections: field_collections}, true);
          ViewBinding.setBusy(false);
    });
  },
};