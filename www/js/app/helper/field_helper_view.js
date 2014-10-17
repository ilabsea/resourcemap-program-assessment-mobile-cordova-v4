FieldHelperView = {
  display: function(templateURL, element, elementPrefixID, fieldData, update) {
    App.Template.process(templateURL, fieldData, function(content) {
      element.html(content);
      FieldHelperView.displayHierarchy(elementPrefixID, fieldData, update);

      element.trigger("create");

      FieldHelperView.displayCalculationField(elementPrefixID, fieldData);
    });
  },
  displayLayerMenu: function(path, element, layers_collection, current_page) {
    layers_collection.field_collections.current_page = current_page;
    App.Template.process(path, layers_collection, function(content) {
      element.html(content);
      element.trigger("create");
    });
  },
  displayHierarchy: function(elementPrefixID, fieldData, update) {
    $.each(fieldData.field_collections, function(key, properties) {
      $.each(properties.fields, function(i, fieldsInside) {
        if (fieldsInside.kind === "hierarchy") {
          var data = fieldsInside.configHierarchy;
          var id = fieldsInside.idfield;
          Hierarchy.renderDisplay(elementPrefixID + id, data);
          if (update)
            Hierarchy.selectedNode(elementPrefixID + id, fieldsInside._selected);
        }
      });
    });
  },
  displayCalculationField: function(elementPrefixID, fieldData) {
    var fieldCal = [];

    $.each(fieldData.field_collections, function(key, properties) {
      $.each(properties.fields, function(i, fieldsInside) {
        if (fieldsInside.kind === "calculation") {
          $.each(fieldsInside.config.dependent_fields, function(i, dependent_field) {
            var e = "#" + elementPrefixID + dependent_field.id;
            $(e).addClass('calculation');
          });
          fieldCal.push(fieldsInside);
        }
      });
      App.DataStore.set('fields_cal', JSON.stringify(fieldCal));
    });
  }
};