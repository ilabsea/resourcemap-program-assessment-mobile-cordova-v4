$(function () {
  $(document).delegate('.calculation', 'keyup blur', function () {
    Calculation.calculate(this);
  });
  
  $(document).delegate('.skipLogicNumber', 'change', function () {
    SkipLogic.skipLogicNumber(this);
  });

  $(document).delegate('.skipLogicNumber', 'keyup', function () {
    DigitAllowance.handleNumberInput(this);
  });

  $(document).delegate('.validateSelectFields', 'change', function () {
    SkipLogic.skipLogicYesNo(this.id);
    validateToRemoveStyle(this);
  });

  $(document).delegate('.ui-selectmenu', 'popupafterclose pagehide', function () {
    var start = this.id.search("-");
    var ele = this.id.substring(0, start);
    var element = $("#" + ele);
    if (element.attr('data-is_enable_field_logic')) {
      if (element.attr('multiple'))
        SkipLogic.skipLogicSelectMany(element);
      else
        SkipLogic.skipLogicSelectOne(ele);
    }
  });
  $(document).delegate('#layer-list-menu-dialog, \n\
#update_layer-list-menu-dialog, \n\
#update_online_layer-list-menu-dialog', 'pagehide', function () {
    var idElement = this.id;
    var index = idElement.indexOf("-dialog");
    var ele = idElement.substr(0, index);
    scrollToLayer($('#' + ele).val());
  });
  $(document).delegate('#ui-btn-layer-menu, \n\
#ui-btn-layer-menu-update, \n\
#ui-btn-layer-menu-update-online', 'click', function () {
    var ele = $(this).children().children()[1].id;
    $("#" + ele).val("");
  });
  
  $('body').click(function (event) {
    var yesNoField = App.DataStore.get("yesNoField");
    var otherField = $(event.target).attr("id");
    var highlightedElement = App.DataStore.get("highlightedElement");
    var typeElement = App.DataStore.get("typeElement");
    if (highlightedElement)
      if (("#") + otherField !== yesNoField && otherField) {
        SkipLogic.unhighlightElement(highlightedElement, typeElement);
        App.DataStore.remove("yesNoField");
      }
  });
});