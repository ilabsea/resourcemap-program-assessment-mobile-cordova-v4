FieldController = {
  getByCollectionId: function () {
    if (App.isOnline())
      this.renderByCollectionIdOnline();
    else
      this.renderByCollectionIdOffline();
  },
  renderByCollectionIdOnline: function () {
    FieldModel.fetch(function (layers) {
      var field_id_arr = new Array();
      var field_collections = [];
      var location_fields_id = new Array();

      for(var i=0; i<layers.length; i++){
        var layer = layers[i];
        for(var j=0; j<layer.fields.length; j++){
          var field = layer.fields[j];
          field_id_arr.push(field.id);
          if (field.kind === "location")
            location_fields_id.push(field.id);
        }
        var fields = FieldHelper.buildField(layer, {fromServer: true});
        field_collections.push(fields);
      }

      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));
      FieldController.synForCurrentCollection(field_collections);

      FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu'),
          {field_collections: field_collections}, "");

      FieldHelperView.display("field_add", $('#div_field_collection'), "",
          {field_collections: field_collections}, false);

      ViewBinding.setBusy(false);
      Location.prepareLocation();
    });
  },
  renderByCollectionIdOffline: function () {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function (fields) {
      var field_id_arr = new Array();
      var location_fields_id = [];
      if (fields.length == 0) {
        ViewBinding.setBusy(false);
        FieldHelperView.displayNoFields("field_no_field_pop_up", $('#page-pop-up-no-fields'));
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
        FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu'),
            {field_collections: field_collections}, "");
        FieldHelperView.display("field_add", $('#div_field_collection'), "",
            {field_collections: field_collections}, false);
        ViewBinding.setBusy(false);
      }
      Location.prepareLocation();
    });
  },
  renderUpdateOffline: function (site) {
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
      FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu-update'),
          {field_collections: field_collections}, "update_");
      FieldHelperView.display("field_updateOffline",
          $('#div_update_field_collection'), "update_",
          {field_collections: field_collections}, true);
    });
  },
  renderUpdateOnline: function (site) {
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
      FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu-update-online'),
          {field_collections: field_collections}, "update_online_");
      FieldHelperView.display("field_update_online",
          $('#div_update_field_collection_online'),
          "update_online_", {field_collections: field_collections}, true);
    });
  },
  synForCurrentCollection: function (newFields) {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function (fields) {
      FieldOffline.remove(fields);
      FieldOffline.add(newFields);
    });
  },
  updateFieldValueBySiteId: function (propertiesFile, field, idHTMLForUpdate, fromServer) {
    var pf = propertiesFile;
    var itemLayer;
    if (fromServer)
      itemLayer = FieldHelper.buildField(field, {fromServer: fromServer});
    else
      itemLayer = FieldHelper.buildField(field._data, {fromServer: fromServer});

    var items = itemLayer.fields;
    $.each(items, function (i, item) {
      if (item.isPhoto) {
        FieldController.updateFieldPhotoValue(item, propertiesFile, fromServer);
      }
      else if (item.widgetType === "date") {
        FieldController.updateFieldDateValue(idHTMLForUpdate, item, propertiesFile);
      }
      else if (item.widgetType === "hierarchy") {
        var nodeId = idHTMLForUpdate + item["idfield"];
        var node = $(nodeId).tree('getSelectedNode');
        var data = node.id;
        if (data == null)
          data = "";
        propertiesFile.properties[item["idfield"]] = data;
      } else {
        var nodeId = idHTMLForUpdate + item["idfield"];
        var value = $(nodeId).val();
        if (value == null)
          value = "";
        propertiesFile.properties[item["idfield"]] = value;
      }
    });
    return pf;
  },
  updateFieldPhotoValue: function (item, propertiesFile, fromServer) {
    var idfield = item["idfield"];
    var lPhotoList = PhotoList.getPhotos().length;
    var sId = App.DataStore.get("sId");

    if (fromServer) {
      var filePath = App.DataStore.get(sId + "_" + idfield);
      if (filePath == null)
        propertiesFile.properties[idfield] = "";
      else
        propertiesFile.properties[idfield] = filePath;
    } else {
      var fileData = App.DataStore.get(sId + "_" + idfield + "_fileData");
      var fileNameLocal = App.DataStore.get(sId + "_" + idfield + "_fileName");
      if (fileData == null || fileNameLocal == null)
        propertiesFile.properties[idfield] = "";
      else {
        propertiesFile.properties[idfield] = fileNameLocal;
        propertiesFile.files[fileNameLocal] = fileData;
      }
    }

    for (var i = 0; i < lPhotoList; i++) {
      if (PhotoList.getPhotos()[i].id == idfield && PhotoList.getPhotos()[i].sId == sId) {
        var fileName = PhotoList.getPhotos()[i].name();
        propertiesFile.properties[idfield] = fileName;
        propertiesFile.files[fileName] = PhotoList.getPhotos()[i].data;
        break;
      }
    }
  },
  updateFieldDateValue: function (idHTMLForUpdate, item, propertiesFile) {
    var nodeId = idHTMLForUpdate + item["idfield"];
    var value = $(nodeId).val();
    if (value != "") {
      value = convertDateWidgetToParam(value);
    }
    propertiesFile.properties[item["idfield"]] = value;
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
      FieldHelperView.displayLocationField("field_location", $element, {config: config});
    }
  }
};
