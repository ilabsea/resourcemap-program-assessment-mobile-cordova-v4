FieldController = {
  activeLayer: null,
  layers: [],
  submited: false,
  site: { properties: {}, files: {} },
  isOnline: true,

  reset: function(){
    App.log("resetting field");
    this.activeLayer = null
    this.layers = []
    this.submited = false
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
    var content = App.Template.process('layer_field', {fields: layer.fields});
    $layerNodeContent.html(content);
    $layerNodeContent.enhanceWithin();

    $.each(layer.fields, function(_, field){
      if(field.kind == 'hierarchy')
        Hierarchy.create(field.config, field.__value, field.idfield);

      if (field.custom_widgeted)
        CustomWidget.setInputNodeId(field);

      if (field.kind == "calculation" && field.config.dependent_fields) {
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

  displayLayerMenu: function(layerData){
    FieldHelperView.displayLayerMenu("layer_menu", $('#ui-btn-layer-menu'), layerData)
  },

  renderLayerSet: function() {
    var cloneLayers = this.layers.slice(0)
    var layerData = {field_collections: cloneLayers}
    FieldHelperView.display('field_add', $('#div_field_collection'), layerData);
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
    this.closeLayer();
    var valid = true
    for(var i=0; i < this.layers.length; i++) {
      var layerValid = FieldController.validateLayer(this.layers[i]);
      if(layerValid == false)
        valid = false
    }
    return valid;
  },

  closeLayer: function() {
    if(this.activeLayer)
      this.activeLayer.collapsible( "collapse" )
  },

  // storeActiveLayer: function() {
  //   if(this.activeLayer)
  //     this.storeOldLayerFields(this.activeLayer)
  // },

  storeOldLayerFields: function($layerNode){
    var layer = this.findLayerById($layerNode.attr('data-id'));

    $.each(layer.fields, function(i, field) {
      if(field.kind !== 'hierarchy' && field.kind !== 'photo'){
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
    var layer = FieldController.findLayerById(layerId);

    this.renderLayer(layer, $layerNodeBody);
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
    return FieldController.activeLayer;
  },

  buildLayerFields: function(layer) {
    return FieldHelper.buildLayerFields(layer, this.isOnline)
  },

  renderNewSiteForm: function () {
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

      FieldController.displayLayerMenu({field_collections: self.layers.slice(0)});

      FieldController.renderLayerSet();

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

      FieldController.displayLayerMenu({field_collections: self.layers.slice(0)});
      FieldController.renderLayerSet();
      ViewBinding.setBusy(false);

      Location.prepareLocation();
    });
  },

  renderUpdateOffline: function (site) {
    this.reset();
    this.isOnline = false
    this.site = site;
    var self = this;

    var cId = CollectionController.id;
    self.layers = []

    FieldOffline.fetchByCollectionId(cId, function (layerOfflines) {
      $.each(layerOfflines, function (_, layerOffline) {
        var newLayer = FieldController.buildLayerFields(layerOffline);
        self.layers.push(newLayer);
      });

      FieldController.displayLayerMenu({field_collections: self.layers.slice(0)});
      // FieldController.renderLayerSet("field_update_offline", $('#div_update_field_collection'), "update_");
      FieldController.renderLayerSet();
    });
  },

  renderUpdateOnline: function (site) {
    this.reset();
    this.isOnline = true;
    this.site = site;

    var self = this;
    self.layers = [];
    var cId = CollectionController.id;

    FieldModel.fetch(cId, function (layerOnlines) {
      $.each(layerOnlines, function (_, layerOnline) {
        var newLayer = FieldController.buildLayerFields(layerOnline);
        self.layers.push(newLayer);
      });

      var prefix = ""; //"update_online_";

      FieldController.displayLayerMenu({field_collections: self.layers.slice(0)});

      // FieldController.renderLayerSet("field_update_online", $('#div_update_field_collection_online'), prefix);
      FieldController.renderLayerSet();

    }, FieldController.errorFetchingField);
  },

  //this.site.properties[fieldId] = fileName;
  //this.site.files[fileName] = photoValue["data"];
  getFieldValueFromUI: function(fieldId) {
    var $field = $('#' + fieldId);
    if($field.length == 0)
      return '';

    if ($field[0].tagName.toLowerCase() == 'img') {
      if ($("#wrapper_" + fieldId).attr("class") != 'ui-disabled skip-logic-over-img')
        return $field.attr('src')
      else
        return '';
    }

    if ($field.attr("type") == 'date')
      return $field.val();

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
        if(field.__value) {

          if(field.kind == 'photo') {
            if(field.__filename){
              properties[field.idfield] = field.__filename
              files[field.__filename] = SiteCamera.dataWithoutMimeType(field.__value)
            }
            else
              properties[field.idfield] = FieldHelper.imageWithoutPath(field.__value)
          }
          else if(field.kind == 'date'){
            properties[field.idfield] = prepareForServer(field.__value)
            // alert("params original value: " + field.__value + " converted to " + prepareForServer(field.__value) )
          }
          else
            properties[field.idfield] = field.__value
        }
        else
          properties[field.idfield] = field.__value
      })
    })
   return {properties: properties, files: files}
  },

};
