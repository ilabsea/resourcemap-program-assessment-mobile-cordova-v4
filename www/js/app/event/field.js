$(document).on("mobileinit", function() {
  //handle collapsible in site page
  $(document).on("collapsibleexpand", "[data-role=collapsible]", function () {
    var $this = $(this);
    var position = $this.offset().top;
    FieldController.prepareLayerExpandFields($this)
    $.mobile.silentScroll(position);
  });

  $(document).on("collapsiblecollapse", "[data-role=collapsible]", function () {
    var $this = $(this);
    FieldController.validateLayerCollapseFields($this);
  });

  $(document).delegate('.calculation', 'keyup blur', function () {
    Calculation.calculate(this);
  });

  $(document).delegate('.skipLogicNumber', 'change', function () {
    SkipLogic.skipLogicNumber(this);
  });

  $(document).delegate('.validateSelectFields', 'change', function () {
    if ($(this).attr('data-role') === "slider") {
      SkipLogic.skipLogicYesNo(this.id);
    }
    else {
      validateToRemoveStyle(this);
    }
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
  var selector = '#layer-list-menu-dialog,#update_layer-list-menu-dialog,#update_online_layer-list-menu-dialog';
  $(document).delegate(selector, 'pagehide', function () {
    var idElement = this.id;
    var index = idElement.indexOf("-dialog");
    var ele = idElement.substr(0, index);
    scrollToLayer($('#' + ele).val());
  });
  var selector = "#ui-btn-layer-menu, #ui-btn-layer-menu-update, #ui-btn-layer-menu-update-online";
  $(document).delegate(selector, 'click', function () {
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
