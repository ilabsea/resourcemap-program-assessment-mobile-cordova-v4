FieldController = {
  layers: [],
  submited: false,
  templateName: "",

  lazyRenderLayers: function(){
    var $layerNodeContents = $("#site-layers-wrapper div.ui-collapsible-content");
    for(var i=0; i< this.layers.length; i++) {
      var $nodeBody = $($layerNodeContents.get(i));
      this.renderLayer(this.layers[i], $nodeBody);
    }
  },

  renderLayer: function(layerData, $layerNodeContent){
    if(!layerData.rendered){
      layerData.rendered = true;
      App.Template.process(this.templateName, {fields: layerData.fields} , function (content) {
        setTimeout(function () {
          $layerNodeContent.html(content);
          $layerNodeContent.enhanceWithin();
        }, 5);
      })
    }
  },

  renderFields: function(templateName, $element, prefixIdElement, isOnline) {
    var options = {field_collections: this.layers.slice(0)}
    FieldHelperView.display(templateName, $element, prefixIdElement, options, isOnline);
  },

  prepareLayerFields: function($layerNode) {
    var layerValue = $layerNode.attr('data-id')
    var $layerNodeBody = $layerNode.find(".ui-collapsible-content")
    var layerData = FieldController.findFieldsInLayer(layerValue);
    this.renderLayer(layerData, $layerNodeBody)
  },

  findFieldsInLayer: function(layerId) {
    for(var i=0; i<this.layers.length; i++){
      if(this.layers[i].id_wrapper == layerId)
        return this.layers[i];
    }
  },

  lazyLayerFields: function (fieldId) {
    for(var i=0 ; i<this.layers.length ; i++) {
      var layer = this.layers[i];
      for(var j=0; j<layer.fields.length; j++) {
        if(layer.fields[j].idfield == fieldId ) {
          var $layerRef = $("#site-layers-wrapper div.ui-collapsible");
          var $layerNode = $($layerRef.get(i))
          return $layerNode;
        }
      }
    }
    App.log("No layer found")
  },

  layersRenderedCompletely: function(){
    for(var i=0; i<this.layers.length; i++){
      if(!this.layers[i].rendered)
        return false;
    }
    return true;
  },

  layerDirty: function() {
    for(var i=0; i<this.layers.length; i++){
      if(this.layers[i].rendered)
        return true
    }
    return false
  },

  renderByCollectionId: function () {
    this.templateName = "layer_fields_add"
    if (App.isOnline())
      this.renderByCollectionIdOnline();
    else
      this.renderByCollectionIdOffline();
  },
  renderByCollectionIdOnline: function () {
    var self = this;
    self.layers = [];
    FieldModel.fetch(function (layers) {
      var field_id_arr = new Array();

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
        self.layers.push(fields);
      }

      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));
      FieldController.synForCurrentCollection(self.layers);

      FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu'),
          {field_collections: self.layers.slice(0)}, "");

      FieldController.renderFields("field_add", $('#div_field_collection'), "", false);

      ViewBinding.setBusy(false);
      Location.prepareLocation();
    });
  },

  renderByCollectionIdOffline: function () {
    var cId = App.DataStore.get("cId");
    var self = this;
    self.layers = [];
    FieldOffline.fetchByCollectionId(cId, function (layerOfflines) {
      var field_id_arr = new Array();
      var location_fields_id = [];

      if(layerOfflines.length == 0)
        FieldHelperView.displayNoFields("field_no_field_pop_up", $('#page-pop-up-no-fields'));

      layerOfflines.forEach(function (layerOffline) {
        $.each(layerOffline.fields, function (_, field) {
          field_id_arr.push(field.idfield);
          if (field.kind === "location")
            location_fields_id.push(field.idfield);
        });
        var layer = FieldHelper.buildField(layerOffline._data, {fromServer: false});
        self.layers.push(layer);
      });

      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));
      FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu'),
          {field_collections: self.layers.slice(0)}, "");
      FieldController.renderFields("field_add", $('#div_field_collection'), "", false);
      ViewBinding.setBusy(false);

      Location.prepareLocation();
    });
  },
  renderUpdateOffline: function (site) {
    this.templateName =  "layer_field_update_offline";
    var self = this;
    var field_id_arr = [];
    var location_fields_id = [];
    var cId = site.collection_id;
    App.DataStore.set('cId', site.collection_id)
    self.layers = []

    FieldOffline.fetchByCollectionId(cId, function (layerOfflines) {
      $.each(layerOfflines, function (_, layerOffline) {
        $.each(layerOffline._data.fields, function (_, field) {
          field_id_arr.push(field.idfield);
          if (field.kind === "location")
            location_fields_id.push(field.id);
        });
      });

      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));

      self.layers = FieldHelper.buildFieldsUpdate(layerOfflines, site, false);

      FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu-update'),
          {field_collections: self.layers.slice(0)}, "update_");
      FieldController.renderFields("field_update_offline",
          $('#div_update_field_collection'), "update_", true);
    });
  },
  renderUpdateOnline: function (site) {
    this.templateName = "layer_field_update_online";
    var field_id_arr = [];
    var location_fields_id = [];
    var self = this;
    self.layers = [];
    App.DataStore.set("cId", site.collection_id);

    FieldModel.fetch(function (layerOnlines) {
      $.each(layerOnlines, function (_, layerOnline) {
        $.each(layerOnline.fields, function (_, field) {
          field_id_arr.push(field.id);
          if (field.kind === "location")
            location_fields_id.push(field.id);
        });
      });
      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));

      self.layers = FieldHelper.buildFieldsUpdate(layerOnlines, site, true);
      FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu-update-online'),
          {field_collections: self.layers.slice(0)}, "update_online_");
      FieldController.renderFields("field_update_online",
          $('#div_update_field_collection_online'),
          "update_online_", true);
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
    $.each(items, function (_, item) {
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
