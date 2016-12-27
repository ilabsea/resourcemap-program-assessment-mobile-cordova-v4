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
    var val = $("#" + this.id).val();
    SkipLogic.processSkipLogic(this.id, val);
  });

  $(document).delegate('.validateSelectFields', 'change', function () {
    if ($(this).attr('data-role') === "slider") {
      var val = $("#" + this.id).val()
      SkipLogic.processSkipLogic(this.id, val);
    }
    else {
      validateToRemoveStyle(this);
    }
  });

  $(document).delegate('.ui-selectmenu', 'popupafterclose pagehide', function () {
    var start = this.id.search("-");
    var ele = this.id.substring(0, start);
    var element = $("#" + ele);
    var val = element.find(":selected").data("code");
    if (element.attr('data-is_enable_field_logic')) {
      if (element.attr('multiple'))
        SkipLogic.processSkipLogicSelectMany(element, ele);
      else
        SkipLogic.processSkipLogic(ele, val);
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

  $("#site-print-report").on('change', function(){
    var selected = $(this).val();
    FieldController.siteReport(selected);
    this.selectedIndex = 0;
  })

  $(document).delegate('.photo', 'click', function () {
    var $this = $(this);
    var fieldId = $this.attr('data-id');
    CameraModel.openCameraDialog(fieldId)
  });

  $(document).delegate('#form-site-fields input', 'focus', function () {
    field = FieldController.findFieldById(this.id);
    if(field.invalid && field.invalid != ""){
      if(field.invalidMessage && field.invalidMessage != "")
        showValidateMessage("#validation-save-site", field.invalidMessage);
      else
        showValidateMessage("#validation-save-site", i18n.t('validation.emailPsdConfirm'));
    }
  });
});
