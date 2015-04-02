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
  updateFieldValueBySiteId: function (propertiesFile, field, idHTMLForUpdate, fromServer) {
    var pf = propertiesFile;
    var itemLayer = fromServer ? FieldHelper.buildField(field, {fromServer: fromServer}, "") :
        FieldHelper.buildField(field._data, {fromServer: fromServer}, "");

    var items = itemLayer.fields;
    $.map(items, function (item) {
      switch (item.widgetType) {
        case "photo":
          FieldController.updateFieldPhotoValue(item, propertiesFile, fromServer);
          break;
        case "date":
          FieldController.updateFieldDateValue(idHTMLForUpdate, item, propertiesFile);
          break;
        case "hierarchy":
          FieldController.updateFieldHierarchy(idHTMLForUpdate, item, propertiesFile);
          break;
        case "number":
          FieldController.updateFieldNumberValue(idHTMLForUpdate, item, propertiesFile);
          break;
        default:
          FieldController.updateFieldDefaultValue(idHTMLForUpdate, item, propertiesFile);
      }
    });
    return pf;
  },
  updateFieldDefaultValue: function (idHTMLForUpdate, item, propertiesFile) {
    var nodeId = idHTMLForUpdate + item["idfield"];
    var value = $(nodeId).val();
    if (value == null)
      value = "";
    propertiesFile.properties[item["idfield"]] = value;
  },
  updateFieldPhotoValue: function (item, propertiesFile, fromServer) {
    var idfield = item["idfield"];
    var lPhotoList = PhotoList.count();

    if (fromServer) {
      var sId = App.DataStore.get('sId');
      var filePath = App.DataStore.get(sId + "_" + item["idfield"]);
      propertiesFile.properties[idfield] = filePath;
    }

    for (var i = 0; i < lPhotoList; i++) {
      if (PhotoList.getPhotos()[i].id == idfield) {
        var fileName = PhotoList.getPhotos()[i].name;
        propertiesFile.properties[idfield] = fileName;
        propertiesFile.files[fileName] = PhotoList.getPhotos()[i].data;
        break;
      }
    }
  },
  updateFieldHierarchy: function (idHTMLForUpdate, item, propertiesFile) {
    var nodeId = idHTMLForUpdate + item["idfield"];
    var node = $(nodeId).tree('getSelectedNode');
    var data = node.id;
    if (data == null)
      data = "";
    propertiesFile.properties[item["idfield"]] = data;
  },
  updateFieldDateValue: function (idHTMLForUpdate, item, propertiesFile) {
    var nodeId = idHTMLForUpdate + item["idfield"];
    var value = $(nodeId).val();
    if (value != "") {
      value = new Date(value);
      value = dateToParam(value);
    }
    propertiesFile.properties[item["idfield"]] = value;
  },
  updateFieldNumberValue: function (idHTMLForUpdate, item, propertiesFile) {
    var config = JSON.parse(App.DataStore.get("configNumber_" + item["idfield"]));
    var nodeId = idHTMLForUpdate + item["idfield"];
    var value = $(nodeId).val();
    if (config.digits_precision) {
      value = parseInt(value * Math.pow(10, parseInt(config.digits_precision)))
          / Math.pow(10, parseInt(config.digits_precision));
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
      config.locationOptions = locationOptions;
      var $element = $("#" + prefixId + id);
      FieldView.displayLocationField("field/location.html", $element, {config: config});
    }
  }
};