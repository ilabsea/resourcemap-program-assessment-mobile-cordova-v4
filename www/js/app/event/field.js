$(document).on("mobileinit", function() {
  //handle collapsible in site page
  $(document).on("collapsibleexpand", "[data-role=collapsible]", function () {
    var $this = $(this);
    var position = $this.offset().top;
    FieldController.layerExpandFields($this)
    $.mobile.silentScroll(position);
  });

  $(document).on("collapsiblecollapse", "[data-role=collapsible]", function () {
    var $this = $(this);
    FieldController.layerCollapseFields($this);
  });

  $(document).delegate('.calculation', 'keyup blur', function () {
    Calculation.calculate($(this));
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

  $(document).delegate('#layer-list-menu-dialog', 'pagehide', function () {
    var layerId = $('#layer-list-menu').val()
    scrollToLayer(layerId);
  });

  $(document).delegate('#ui-btn-layer-menu', 'click', function () {
    var ele = $(this).children().children()[1].id;
    $("#" + ele).val("");
  });

  $(document).delegate('.photo', 'click', function () {
    var $this = $(this);
    var fieldId = $this.attr('data-id');
    CameraModel.openCameraDialog(fieldId)
  });
});
