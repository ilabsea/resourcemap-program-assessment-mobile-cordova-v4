FieldController = {
  display: function(templateURL, element, fieldData) {
    App.Template.process(templateURL, fieldData, function(content) {
      element.html(content);
      element.trigger("create");
    });
  },
  getByCollectionId: function() {
    if (isOnline())
      this.renderByCollectionIdOnline();
    else
      this.renderByCollectionIdOffline();
  },
  renderByCollectionIdOnline: function() {
    FieldModel.fetch(function(layers) {
      var field_id_arr = new Array();
      var field_collections = $.map(layers, function(layer) {
        field_id_arr = $.map(layer.fields, function(field) {
          return field.id;
        });
        var fields = FieldHelper.buildField(layer, {fromServer: true});
        return fields;
      });
      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      FieldController.synForCurrentCollection(field_collections);
      FieldController.display("field/add.html", $('#div_field_collection'), {field_collections: field_collections});
    });
  },
  renderByCollectionIdOffline: function() {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function(layers) {
      var field_id_arr = new Array();
      var field_collections = $.map(layers, function(layer) {
        field_id_arr = $.map(layer.fields(), function(field) {
          return field.idfield;
        });
        var item = FieldHelper.buildField(layer._data, {fromServer: false});
        return item;
      });
      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      FieldController.display("field/add.html", $('#div_field_collection'), {field_collections: field_collections});
    });
  },
  renderUpdateOffline: function(site) {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function(layers) {
      var field_collections = FieldHelper.buildFieldsUpdate(layers, site, false);
      FieldController.display("field/updateOffline.html", $('#div_update_field_collection'), {field_collections: field_collections});
    });
  },
  renderUpdateOnline: function(site) {
    FieldModel.fetch(function(layers) {
      var field_collections = FieldHelper.buildFieldsUpdate(layers, site, true);
      FieldController.display("field/updateOnline.html", $('#div_update_field_collection_online'), {field_collections: field_collections});
    });
  },
  synForCurrentCollection: function(newFields) {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function(fields) {
      FieldOffline.remove(fields);
      FieldOffline.add(newFields);
    });
  },
  updateFieldValueBySiteId: function(propertiesFile, field, idHTMLForUpdate, fromServer) {
    var pf = propertiesFile;
    var itemLayer;
    if (fromServer)
      itemLayer = FieldHelper.buildField(field, {fromServer: fromServer});
    else
      itemLayer = FieldHelper.buildField(field._data, {fromServer: fromServer});

    var items = itemLayer.fields;
    $.map(items, function(item) {
      if (item.isPhoto) {
        FieldController.updateFieldPhotoValue(item, propertiesFile, fromServer);
      }
      else if (item.widgetType === "date") {
        FieldController.updateFieldDateValue(idHTMLForUpdate, item, propertiesFile);
      }
      else {
        var nodeId = idHTMLForUpdate + item["idfield"];
        var value = $(nodeId).val();
        if (value == null)
          value = "";
        propertiesFile.properties[item["idfield"]] = value;
      }
    });

    return pf;
  },
  updateFieldPhotoValue: function(item, propertiesFile, fromServer) {
    var idfield = item["idfield"];
    var lPhotoList = PhotoList.getPhotos().length;
    var sId = localStorage.getItem("sId");

    if (fromServer) {
      var filePath = App.DataStore.get("filePath");
      if (filePath == null)
        propertiesFile.properties[idfield] = "";
      else
        propertiesFile.properties[idfield] = filePath;
    } else {
      var fileData = App.DataStore.get("fileDataOffline");
      var fileNameLocal = App.DataStore.get("fileNameOffline");
      if (fileData == null || fileNameLocal == null) {
        propertiesFile.properties[idfield] = "";
      }
      else {
        var fileName = fileNameLocal;
        propertiesFile.properties[idfield] = fileName;
        propertiesFile.files[fileName] = fileData;
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
  updateFieldDateValue: function(idHTMLForUpdate, item, propertiesFile) {
    var nodeId = idHTMLForUpdate + item["idfield"];
    var value = $(nodeId).val();
    if (value != "") {
      value = new Date(value);
      value = dateToParam(value);
    }
    propertiesFile.properties[item["idfield"]] = value;
  }
};