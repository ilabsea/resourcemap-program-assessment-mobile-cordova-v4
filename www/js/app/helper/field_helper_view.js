var FieldHelperView = {
  displayNoFields: function (templateURL, element) {
    var content = App.Template.process(templateURL, {});
    element.html(content);

    setTimeout(function () {
      Dialog.showDialog("page-pop-up-no-fields");
    }, 50);
    element.css("z-index", 200000);
  },

  display: function (templateURL, element, fieldData, update) {
    App.log("templateURL--", templateURL);
    var content = App.Template.process(templateURL, fieldData);
    element.html(content);
    // FieldHelperView.displayCustomWidget(elementPrefixID, fieldData);
    element.enhanceWithin();

    //FieldHelperView.displayCalculationField(elementPrefixID, fieldData);
    //FieldHelperView.displayUiDisabled(elementPrefixID, fieldData, update);

    DigitAllowance.prepareEventListenerOnKeyPress();

    if (update)
      FieldHelperView.displayReadOnlyField();
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
    var content = App.Template.process(templateURL, configData);
    element.html(content);
    element.selectmenu("refresh");
  },

  displayLayerMenu: function (layers_collection, current_page) {
    var page = current_page || ''
    var $element = $('#ui-layer-menu')

    layers_collection.field_collections.current_page = page;
    var content = App.Template.process('layer_menu', layers_collection);
    $element.html(content);
    $element.trigger("create");
  }
};
