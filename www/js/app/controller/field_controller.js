FieldController = {
  getByCollectionId: function () {
    if (App.isOnline())
      this.renderByCollectionIdOnline();
    else
      this.renderByCollectionIdOffline();
  },
  renderByCollectionIdOnline: function () {
    var cId = App.DataStore.get("cId");
    LayerMembership.fetch(cId, function (layerMemberships) {
      FieldModel.fetch(function (layers) {
        var field_id_arr = new Array();
        var location_fields_id = new Array();
        var field_collections = $.map(layers, function (layer) {
          $.map(layer.fields, function (field) {
            field_id_arr.push(field.id);
            if (field.kind === "location")
              location_fields_id.push(field.id);
          });
          var fields = FieldHelper.buildField(layer, {fromServer: true},
          layerMemberships);
          return fields;
        });
        App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
        App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));
        FieldController.synForCurrentCollection(field_collections);
        FieldHelperView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu'),
            {field_collections: field_collections}, "");
        FieldHelperView.display("field/add.html", $('#div_field_collection'), "",
            {field_collections: field_collections}, false);
      });
    });
  },
  renderByCollectionIdOffline: function () {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function (fields) {
      var field_id_arr = new Array();
      var field_collections = [];
      fields.forEach(function (field) {
        $.map(field.fields(), function (fieldsInfield) {
          field_id_arr.push(fieldsInfield.idfield);
        });
        var item = FieldHelper.buildField(field._data,
            {fromServer: false}, "");
        field_collections.push(item);
      });
      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      FieldHelperView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu'),
          {field_collections: field_collections}, "");
      FieldHelperView.display("field/add.html", $('#div_field_collection'), "",
          {field_collections: field_collections}, false);
    });
  },
  renderUpdateOffline: function (site) {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function (layers) {
      var field_collections = FieldHelper.buildFieldsUpdate(layers, site, false, "");
      FieldHelperView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu-update'),
          {field_collections: field_collections}, "update_");
      FieldHelperView.display("field/updateOffline.html",
          $('#div_update_field_collection'), "update_",
          {field_collections: field_collections}, true);
    });
  },
  renderUpdateOnline: function (siteData) {
    var cId = App.DataStore.get("cId");
    var sId = localStorage.getItem("sId");

    SitesPermission.fetch(cId, function (site) {
      if ((!site.read && !site.write && !site.none)
          || (site.read.all_sites && site.write.all_sites && site.none.all_sites))
        LayerMembershipsHelper.buildAllLayersOfSite(cId, siteData);
      else
        LayerMembershipsHelper.buildCustomerSitePermission(site, siteData, cId, sId);
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
          var nodeId = idHTMLForUpdate + item["idfield"];
          var node = $(nodeId).tree('getSelectedNode');
          var data = node.id;
          if (data == null)
            data = "";
          propertiesFile.properties[item["idfield"]] = data;
          break;
        default:
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
      value = new Date(value);
      value = dateToParam(value);
    }
    propertiesFile.properties[item["idfield"]] = value;
  },
  renderLocationField: function (lat, lng) {
    var location_fields_id = JSON.parse(App.DataStore.get("location_fields_id"));
    for (var i in location_fields_id) {
      var id = location_fields_id[i];
      var config = JSON.parse(App.DataStore.get("configLocations_" + id));
      var locationOptions = Location.getLocations(lat, lng, config);
      config.locationOptions = locationOptions;
      var $element = $("#" + id);
      FieldHelperView.displayLocationField("field/location.html", $element, {config: config});
    }
  }
};