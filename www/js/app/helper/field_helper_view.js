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
  display: function (templateURL, element, elementPrefixID, fieldData, update) {
    console.log('template url : ', templateURL);    
    App.Template.process(templateURL, fieldData, function (content) {
      element.html(content);
      console.log('display');
      console.log(fieldData);
      FieldHelperView.displayHierarchy(elementPrefixID, fieldData, update);

      element.trigger("create");

      FieldHelperView.displayCalculationField(elementPrefixID, fieldData);
      FieldHelperView.displayUiDisabled(elementPrefixID, fieldData, update);

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
  displayLayerMenu: function (path, element, layers_collection, current_page) {
    layers_collection.field_collections.current_page = current_page;
    App.Template.process(path, layers_collection, function (content) {
      element.html(content);
      element.trigger("create");
    });
  },
  displayHierarchy: function (elementPrefixID, fieldData, update) {
    $.map(fieldData.field_collections, function (properties) {
      $.map(properties.fields, function (fieldsInside) {
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
  displayCalculationField: function (elementPrefixID, fieldData) {
    var fieldCal = [];

    $.map(fieldData.field_collections, function (properties) {
      $.map(properties.fields, function (fieldsInside) {
        if (fieldsInside.kind === "calculation") {
          if (fieldsInside.config.dependent_fields) {
            $.each(fieldsInside.config.dependent_fields, function (i, dependent_field) {
              var e = "#" + elementPrefixID + dependent_field.id;
              $(e).addClass('calculation');
            });
          }
          fieldCal.push(fieldsInside);
        }
      });
      App.DataStore.set('fields_cal', JSON.stringify(fieldCal));
    });
  },
  displayUiDisabled: function (prefixId, fieldData, update) {
    $.map(fieldData.field_collections, function (layer) {
      $.map(layer.fields, function (field) {
        if (update)
          SkipLogic.disableUIEditSite(field, prefixId);
        else
          SkipLogic.disableUIAddSite(field);
      });
    });
  }
};