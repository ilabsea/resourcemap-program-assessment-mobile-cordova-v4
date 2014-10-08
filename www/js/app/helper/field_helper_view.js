FieldHelperView = {
  display: function(templateURL, element, elementHierarchy, fieldData, update) {
    App.Template.process(templateURL, fieldData, function(content) {
      element.html(content);
      FieldHelperView.displayHierarchy(elementHierarchy, fieldData, update);

      element.trigger("create");

      FieldHelperView.displayCalculationField(fieldData);

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
  displayCalculationField: function(fieldData) {
    var fieldCal = [];

    $.each(fieldData.field_collections, function(key, properties) {
      $.each(properties.fields, function(i, fieldsInside) {
        if (fieldsInside.kind === "calculation") {
          $.each(fieldsInside.config.dependent_fields, function(i, dependent_field) {
            var e = "#" + dependent_field.id;
            $(e).addClass('calculation');
          });
          fieldCal.push(fieldsInside);
        }
      });
      App.DataStore.set('fields_cal', JSON.stringify(fieldCal));
    });
  }
};