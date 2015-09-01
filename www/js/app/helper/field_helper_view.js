FieldHelperView = {
  displayNoFields: function (templateURL, element) {
    App.Template.process(templateURL, {}, function (content) {
      element.html(content);
      setTimeout(function () {
        Dialog.showDialog("page-pop-up-no-fields");
      }, 50);
      element.css("z-index", 200000);
    });
  },
  display: function (templateURL, element, fieldData, update) {
    App.Template.process(templateURL, fieldData, function (content) {
      element.html(content);
      FieldHelperView.displayHierarchy(fieldData, update);

      element.trigger("create");

      FieldHelperView.displayCalculationField(fieldData);
      FieldHelperView.displayUiDisabled(fieldData, update);

      DigitAllowance.prepareEventListenerOnKeyPress();

      if (update)
        FieldHelperView.displayReadOnlyField();
    });
  },
  displayReadOnlyField: function () {
    var site = MyMembershipObj.getSite();
    if (!MyMembershipController.canEdit(site)) {
      $(".tree").off('click'); //field hierarchy
      var select = $('.validateSelectFields').parent('.ui-select'); //field select
      select.click(function () {
        return false;
      });
    }
  },
  displayLocationField: function (templateURL, element, configData) {
    App.Template.process(templateURL, configData, function (content) {
      element.html(content);
      element.selectmenu("refresh");
    });
  },
  displayLayerMenu: function (path, element, layers_collection) {
    App.Template.process(path, layers_collection, function (content) {
      element.html(content);
      element.trigger("create");
    });
  },
  displayHierarchy: function (fieldData, update) {
    $.map(fieldData.field_collections, function (properties) {
      $.map(properties.fields, function (fieldsInside) {
        if (fieldsInside.kind === "hierarchy") {
          var data = fieldsInside.configHierarchy;
          var id = fieldsInside.idfield;
          Hierarchy.renderDisplay(id, data);
          if (update)
            Hierarchy.selectedNode(id, fieldsInside._selected);
        }
      });
    });
  },
  displayCalculationField: function (fieldData) {
    var fieldCal = [];

    $.map(fieldData.field_collections, function (properties) {
      $.map(properties.fields, function (fieldsInside) {
        if (fieldsInside.kind === "calculation") {
          if (fieldsInside.config.dependent_fields) {
            $.each(fieldsInside.config.dependent_fields, function (i, dependent_field) {
              var e = "#" + dependent_field.id;
              $(e).addClass('calculation');
            });
          }
          fieldCal.push(fieldsInside);
        }
      });
      App.DataStore.set('fields_cal', JSON.stringify(fieldCal));
    });
  },
  displayUiDisabled: function (fieldData, update) {
    $.map(fieldData.field_collections, function (layer) {
      $.map(layer.fields, function (field) {
        if (update)
          SkipLogic.disableUIEditSite(field);
        else
          SkipLogic.disableUIAddSite(field);
      });
    });
  }
};