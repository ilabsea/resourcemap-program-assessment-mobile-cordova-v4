FieldController = {
  activeLayer: null,
  layers: [],
  submited: false,
  templateName: "",
  site: { properties: {}, files: {} },
  isOnline: true,

  reset: function(){
    this.activeLayer = null
    this.layers = []
    this.submited = false
    this.templateName = ""
    this.site = { properties: {}, files: {} }
    this.isOnline = true
  },

  fieldIds: function() {
    var fieldIds = []
    $.each(this.layers, function(_, layer){
      $.each(layer.fields, function(_, field){
        fieldIds.push(field.idfield)
      })
    })
    return fieldIds;
  },

  findFieldById: function(idfield) {
    for(var i=0; i<this.layers.length; i++) {
      for(var j=0; j<this.layers[i].fields.length; j++){
        if(this.layers[i].fields[j].idfield == idfield)
          return this.layers[i].fields[j];
      }
    }
    return null;
  },

  renderLayer: function(layer, $layerNodeContent){
    var content = App.Template.process(this.templateName, {fields: layer.fields});
    $layerNodeContent.html(content);
    $layerNodeContent.enhanceWithin();

    $.each(layer.fields, function(_, field){
      if(field.kind == 'hierarchy')
        Hierarchy.create(field.config, field.__value, field.idfield);

      if (field.custom_widgeted)
        CustomWidget.setInputNodeId(field.idfield, field);

      if (field.kind == "calculation" && field.config.dependent_fields) {
        console.log("calculation: ", field);
        console.log("config: ", field.config.dependent_fields);
        $.each(field.config.dependent_fields, function (_, dependentField) {
          var $dependentField = $("#" + dependentField.id)
          $dependentField.addClass('calculation');
          $dependentField.attr('data-parent-id', field.idfield )
        })
      }
      // SkipLogic.disableUIEditSite
      DigitAllowance.prepareEventListenerOnKeyPress();

      // Readonly field
      var site = FieldController.site
      if (!MyMembershipController.canEdit(site)) {
        $(".tree").off('click'); //field hierarchy
        var select = $('.validateSelectFields').parent('.ui-select');
        select.click(function () {
          return false;
        });
      }

    })
  },

  renderLayerSet: function(templateName, $element, prefixIdElement) {
    this.templateName = "layer_field";
    var cloneLayers = this.layers.slice(0)
    var options = {field_collections: cloneLayers}
    FieldHelperView.display(templateName, $element, prefixIdElement, options, this.isOnline);
  },

  layerCollapseFields: function($layerNode){
    if(this.activeLayer){
      this.storeOldLayerFields(this.activeLayer)
      var layer = this.findLayerById(this.activeLayer.attr('data-id'))
      this.validateLayer(layer)
    }
  },

  validateLayer: function(layer){
    layer.valid = true
    for(var i=0; i<layer.fields.length; i++){
      var validField = FieldController.validateField(layer.fields[i]);
      if(!validField)
        layer.valid = false
    }
    var $layerNode = $("#collapsable_" + layer.id_wrapper)
    layer.valid ? $layerNode.removeClass("error") : $layerNode.addClass("error")
    return layer.valid;
  },

  validateField: function(field){
    if(field.required=="" || field.disableState){
      field.invalid = '';
      return true
    }

    if(!field.__value){
      field.invalid = 'error'
      return false;
    }


    if(field.kind == 'numeric' && field.config && field.config.range) {
      if(field.__value >= field.config.range.minimum && field.__value <=field.config.range.maximum ){
        field.invalid = ''
        return true;
      }
      else {
        field.invalid = 'error'
        return false;
      }
    }
    field.invalid = ''
    return true;
  },

  validateLayers: function(){
    this.storeActiveLayer()
    var valid = true
    for(var i=0; i < this.layers.length; i++) {
      var layerValid = FieldController.validateLayer(this.layers[i]);
      if(layerValid == false)
        valid = false
    }
  },

  storeActiveLayer: function() {
    if(this.activeLayer)
      this.storeOldLayerFields(this.activeLayer)
  },

  storeOldLayerFields: function($layerNode){
    var layer = this.findLayerById($layerNode.attr('data-id'));

    $.each(layer.fields, function(i, field) {
      if(field.kind !== 'hierarchy'){
        var value = FieldController.getFieldValueFromUI(field.idfield)
        FieldHelper.setFieldValue(field, value, this.isOnline);
      }
    })
  },

  layerExpandFields: function($layerNode) {
    if(this.activeLayer) {
      var layerChanged = $layerNode.attr('data-id') != this.activeLayer.attr('data-id')
      if(layerChanged) {
        this.removeLayerContent(this.activeLayer);
        this.renderLayerNode($layerNode)
      }
      else{
        var layer = this.findLayerById($layerNode.attr('data-id'))
        $.each(layer.fields, function(_, field){
          var $fieldUI = $("#" + field.idfield)
          if(field.kind == "photo")
            field.invalid ?  $fieldUI.parent().addClass("error") : $fieldUI.parent().removeClass("error")
          else
            field.invalid ?  $fieldUI.addClass("error") : $fieldUI.removeClass("error")
        })
      }
    }
    else
      this.renderLayerNode($layerNode);
  },

  removeLayerContent: function($layerNode){
    $layerNode.find(".ui-collapsible-content").html("")
  },

  renderLayerNode: function($layerNode) {
    var layerId = $layerNode.attr('data-id')
    var $layerNodeBody = $layerNode.find(".ui-collapsible-content")
    var layerData = FieldController.findLayerById(layerId);

    this.renderLayer(layerData, $layerNodeBody);
    this.activeLayer = $layerNode;
  },

  findLayerById: function(layerId) {
    for(var i=0; i<this.layers.length; i++){
      if(this.layers[i].id_wrapper == layerId)
        return this.layers[i];
    }
  },

  findLayerWrapperOfFieldId: function (fieldId) {
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
  },

  layerDirty: function() {
    for(var i=0; i<this.layers.length; i++){
      if(this.layers[i].rendered === true)
        return true
    }
    return false
  },

  buildLayerFields: function(layer) {
    return FieldHelper.buildLayerFields(layer, this.isOnline)
  },

  renderNewSiteForm: function () {
    // this.templateName = "layer_fields_add"
    this.reset();
    this.site = { properties: {}, files: {} }
    App.isOnline() ? this.renderNewSiteFormOnline() : this.renderNewSiteFormOffline();
  },

  errorFetchingField: function(error) {
    if (!App.isOnline())
      FieldController.renderUpdateOffline();
  },

  renderNewSiteFormOnline: function () {
    this.isOnline = true
    var self = this;
    var cId = CollectionController.id;

    FieldModel.fetch(cId, function (layers) {
      $.each(layers, function(_, layer){
        var layerFields = FieldHelper.buildLayerFields(layer, {fromServer: true});
        self.layers.push(layerFields);
      })

      FieldController.synForCurrentCollection(self.layers);

      FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu'),
          {field_collections: self.layers.slice(0)}, "");

      FieldController.renderLayerSet("field_add", $('#div_field_collection'), "");

      ViewBinding.setBusy(false);
      Location.prepareLocation();
    }, FieldController.errorFetchingField);
  },

  renderNewSiteFormOffline: function () {
    this.isOnline = false;

    var cId = CollectionController.id
    var self = this;
    self.layers = [];

    FieldOffline.fetchByCollectionId(cId, function (layerOfflines) {
      if(layerOfflines.length == 0)
        FieldHelperView.displayNoFields("field_no_field_pop_up", $('#page-pop-up-no-fields'));

      layerOfflines.forEach(function (layerOffline) {
        var layer = FieldHelper.buildLayerFields(layerOffline, false);
        self.layers.push(layer);
      });

      FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu'), {field_collections: self.layers.slice(0)}, "");
      FieldController.renderLayerSet("field_add", $('#div_field_collection'), "");
      ViewBinding.setBusy(false);

      Location.prepareLocation();
    });
  },

  renderUpdateOffline: function (site) {
    this.reset();
    this.isOnline = false
    this.site = site;
    this.templateName =  "layer_field_update_offline";
    var self = this;

    var cId = CollectionController.id;
    self.layers = []

    FieldOffline.fetchByCollectionId(cId, function (layerOfflines) {
      $.each(layerOfflines, function (_, layerOffline) {
        var newLayer = FieldController.buildLayerFields(layerOffline);
        self.layers.push(newLayer);
      });

      FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu-update'), {field_collections: self.layers.slice(0)}, "update_");
      // FieldController.renderLayerSet("field_update_offline", $('#div_update_field_collection'), "update_");
      FieldController.renderLayerSet("field_add", $('#div_field_collection'), "");
    });
  },

  renderUpdateOnline: function (site) {
    this.reset();
    this.isOnline = true;
    this.site = site;
    this.templateName = "layer_field_update_online";

    var self = this;
    self.layers = [];
    var cId = CollectionController.id;

    FieldModel.fetch(cId, function (layerOnlines) {
      $.each(layerOnlines, function (_, layerOnline) {
        var newLayer = FieldController.buildLayerFields(layerOnline);
        self.layers.push(newLayer);
      });

      var prefix = ""; //"update_online_";

      FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu-update-online'),
          {field_collections: self.layers.slice(0)}, prefix);

      // FieldController.renderLayerSet("field_update_online", $('#div_update_field_collection_online'), prefix);
      FieldController.renderLayerSet("field_add", $('#div_field_collection'), "");

    }, FieldController.errorFetchingField);
  },

  //this.site.properties[fieldId] = fileName;
  //this.site.files[fileName] = photoValue["data"];
  getFieldValueFromUI: function(fieldId) {
    var $field = $('#' + fieldId);
    if($field.length == 0)
      return '';

    if ($field[0].tagName.toLowerCase() == 'img') {
      if ($("#wrapper_" + fieldId).attr("class") != 'ui-disabled skip-logic-over-img') {
        var photoValue = PhotoList.value(fieldId);

        if(photoValue){
          var filename = photoValue.filename;
          FieldController.site.files[filename] = photoValue.data
          return filename;
        }
        else
          return '';
      }
      else
        return '';
    }

    if ($field[0].getAttribute("type") == 'date')
      return convertDateWidgetToParam($field.val());

    var value = $field.hasClass("tree") ? $field.tree('getSelectedNode').id : $field.val()
    return  value == null ? "" : value;
  },

  synForCurrentCollection: function (newFields) {
    var cId = CollectionController.id;
    FieldOffline.fetchByCollectionId(cId, function (fields) {
      FieldOffline.remove(fields);
      FieldOffline.add(newFields);
    });
  },

  updateLocationField: function (lat, lng) {
    $.each(this.layers, function(_, layer){
      $.each(layer.fields, function(_, field){
        if(field.kind == "location") {
          var config = field.config;
          var locationOptions = Location.getLocations(lat, lng, config);
          if (locationOptions)
            config.locationOptions = locationOptions;

          var $fieldUI = $("#" + field.idfield);
          FieldHelperView.displayLocationField("field_location", $fieldUI, {config: config});
        }
      })
    })
  },

  params: function(){
    var properties = {};
    var files = {}
    $.each(this.layers, function(_, layer) {
      $.each(layer.fields, function(_, field) {
        if(field.kind == 'photo' && field.__value) {
          var fileName = field.__value
          properties[field.idfield] = fileName ;
          files[fileName] = FieldController.site.files[fileName];
       }
       else
          properties[field.idfield] = field.__value
      })
    })
   return {properties: properties, files: files}
  },

};
