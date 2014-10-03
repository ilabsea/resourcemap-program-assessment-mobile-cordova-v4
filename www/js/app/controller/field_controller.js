FieldController = {
  display: function(templateURL, element, elementHierarchy, fieldData, update) {
    App.Template.process(templateURL, fieldData, function(content) {
      element.html(content);
      FieldController.displayHierarchy(elementHierarchy, fieldData, update);

      element.trigger("create");
      FieldController.displayUiDisabled(elementHierarchy, fieldData);
    });
  },
  displayHierarchy: function(element, fieldData, update) {
    $.each(fieldData.field_collections, function(key, properties) {
      $.each(properties.fields, function(i, fieldsInside) {
        if (fieldsInside.kind === "hierarchy") {
          var data = fieldsInside.configHierarchy;
          var id = fieldsInside.idfield;
          Hierarchy.renderDisplay(element + id, data);
          if (update)
            Hierarchy.selectedNode(element + id, fieldsInside._selected);
        }
      });
    });
  },
  displayUiDisabled: function(element, fieldData) {
    $.each(fieldData.field_collections, function(key, properties) {
      if (properties.layer_membership) {
        if (!properties.layer_membership.write) {
          var ele = "collapsable_" + element + properties.layer_membership.layer_id;
          $($("#" + ele).children()[1]).addClass("ui-disabled");
        }
      }
    });
  },
  getByCollectionId: function() {
    if (App.isOnline())
      this.renderByCollectionIdOnline();
    else
      this.renderByCollectionIdOffline();
  },
  renderByCollectionIdOnline: function() {
    var cId = App.DataStore.get("cId");

    LayerMembership.fetch(cId, function(layerMemberships) {
      FieldModel.fetch(function(response) {
        var field_id_arr = new Array();
        var field_collections = [];
        $.each(response, function(key, properties) {
          $.each(properties.fields, function(i, fieldsInside) {
            field_id_arr.push(fieldsInside.id);
          });
          var fields = FieldHelper.buildField(properties, {fromServer: true},
          layerMemberships);
          field_collections.push(fields);
        });
        App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
        FieldController.synForCurrentCollection(field_collections);
        FieldController.display("field/add.html", $('#div_field_collection'), "", {field_collections: field_collections}, false);
      });
    });
  },
  renderByCollectionIdOffline: function() {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function(fields) {
      var field_id_arr = new Array();
      var field_collections = [];
      fields.forEach(function(field) {
        $.each(field.fields(), function(i, fieldsInfield) {
          field_id_arr.push(fieldsInfield.idfield);
        });
        var item = FieldHelper.buildField(field._data,
            {fromServer: false}, "");
        field_collections.push(item);
      });
      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      FieldController.display("field/add.html", $('#div_field_collection'), "",
          {field_collections: field_collections}, false);
    });
  },
  renderUpdateOffline: function(site) {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function(layers) {
      var field_collections = FieldHelper.buildFieldsUpdate(layers, site, false, "");
      FieldController.display("field/updateOffline.html",
          $('#div_update_field_collection'), "update_",
          {field_collections: field_collections}, true);
    });
  },
  renderUpdateOnline: function(siteData) {
    var cId = App.DataStore.get("cId");
    var sId = localStorage.getItem("sId");

    SitesPermission.fetch(cId, function(site) {
      if (!site.read && !site.write && !site.none) {
        LayerMembershipsHelper.buildAllLayersOfSite(cId, siteData);
      } else {
        LayerMembershipsHelper.buildCustomerSitePermission(site, siteData, cId, sId);
      }
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
      itemLayer = FieldHelper.buildField(field, {fromServer: fromServer}, "");
    else
      itemLayer = FieldHelper.buildField(field._data, {fromServer: fromServer}, "");

    var items = itemLayer.fields;

    $.each(items, function(i, item) {
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