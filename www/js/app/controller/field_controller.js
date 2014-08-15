FieldController = {
  display: function(element, fieldData) {
    App.Template.process("field/add.html", fieldData, function(content) {
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
    FieldModel.fetch(function(response) {
      var field_id_arr = new Array();
      var field_collections = [];
      $.each(response, function(key, properties) {
        $.each(properties.fields, function(i, fieldsInside) {
          field_id_arr.push(fieldsInside.id);
        });
        var fields = buildField(properties, {fromServer: true});

        field_collections.push(fields);
      });
      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      FieldController.synForCurrentCollection(field_collections);
      this.display($('#div_field_collection'), {field_collections: field_collections});
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
        var item = buildField(field._data, {fromServer: false});
        field_collections.push(item);
      });
      App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
      this.display($('#div_field_collection'), {field_collections: field_collections});
    });
  },
  renderUpdateOffline: function(site) {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function(layers) {
      var field_collections = buildFieldsCollection(layers, site, false);
      displayFieldUpdateTemplate({field_collections: field_collections});
    });
  },
  renderUpdateOnline: function(site) {
    FieldModel.fetch(function(layers) {
      var field_collections = buildFieldsCollection(layers, site, true);
      displayFieldUpdateOnlineTemplate({field_collections: field_collections});
    });
  },
  synForCurrentCollection: function(newFields) {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function(fields) {
      FieldOffline.remove(fields);
      FieldOffline.add(newFields);
    });
  }
};