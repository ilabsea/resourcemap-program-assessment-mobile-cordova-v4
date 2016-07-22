SkipLogic = {
  currentHighlight: false,

  skipLogicNumber: function (element) {
    var val = $(element).val();
    var id = $(element).attr('id');
    var field = FieldController.findFieldById(id)

    if (field.config && field.config['field_logics'] ) {
      for(var i=0; i<field.config['field_logics'].length; i++){
        var fieldLogic = field.config['field_logics'][i]
        var operationType= fieldLogic.condition_type;
        var match = Operators[operationType](val, fieldLogic.value)
        SkipLogic.applySkipLogic(field, fieldLogic.field_id, function(){
          return match;
        });
      }
    }
  },

  applySkipLogic: function(field, fieldId, condition){
    if(!(field.config))
      return;
    if(condition()) {
      App.log("skip to: ", fieldId)
      SkipLogic.handleSkipLogic(field.idfield, fieldId)
    }
    else if(field.skipTo){
      SkipLogic.setStateUI(field.idfield, field.skipTo, true)
    }
  },

  skipLogicYesNo: function (element) {
    var $element = $("#" + element);
    var id = $element.attr("id");
    var fieldId = $element.find('option:selected').attr('data-field_id');

    var field = FieldController.findFieldById(id);
    if(!($element.attr('data-is_enable_field_logic') && $element.attr('data-role') === "slider"))
      return;
    var fieldId = false;

    window.field = field;
    for(var i=0; i< field.config.options.length; i++) {
      if( field.config.options[i].id == parseInt($element.val())) {
        fieldId = field.config.options[i].field_id;
        break;
      }
    }

    SkipLogic.applySkipLogic(field, fieldId, function(){
      return fieldId;
    })

  },

  skipLogicSelectOne: function (element) {
    var $element = $("#" + element);
    var id = $element.attr("id")
    var fieldId = $element.find('option:selected').attr('data-field_id');
    var field = FieldController.findFieldById(id);

    SkipLogic.applySkipLogic(field, fieldId, function(){
       return $element.val();
    })
  },

  skipLogicSelectMany: function (element) {
    var selectedValues = element.val() || []
    var id = element.attr('id');
    var field = FieldController.findFieldById(id);

    if (selectedValues.length>0 && field.config && field.config['field_logics']) {
      for(var i=0; i<field.config['field_logics'].length; i++) {
        var fieldLogic = field.config['field_logics'][i]
        var condition = this.matchCondition(fieldLogic, selectedValues)

        if (condition){
          SkipLogic.applySkipLogic(field, fieldLogic.field_id, function(){
            return true;
          })
          break;
        }
      }
    }
    else if(field.config && field.config['field_logics'] && field.skipTo) {
      SkipLogic.setStateUI(id, field.skipTo, true)
    }
  },

  matchCondition: function(fieldLogic, selectedValues){
    var selectedOptions = fieldLogic['selected_options'];
    var exist = false, matchAll = [], condition = false;

    for (var j in selectedOptions) {
      if (selectedValues.indexOf(selectedOptions[j].value) != -1) {
        exist = true;
        matchAll.push(true);
      }
    }

    if (exist && fieldLogic.condition_type == 'any')
      condition = true;
    else if (exist && matchAll.length == Object.keys(selectedOptions).length)
      condition = true

    return condition;
  },

  handleSkipLogic: function (id, fieldId) {
    App.log("from " + id + " to " + fieldId);
    var field = FieldController.findFieldById(id)
    var $parent = FieldController.findLayerWrapperOfFieldId(fieldId)

    if(field.skipTo){
      App.log("reset from: " + id + " to: " + field.skipTo)
      SkipLogic.setStateUI(id, field.skipTo, true)
    }

    if($parent && $parent.length >0){
      SkipLogic.setStateUI(id, fieldId, false)
      triggerExpand($parent);
      scrollToHash($("#wrapper_" + fieldId));
      setTimeout(function () {
        $("#" + fieldId).focus();
      }, 500);
      SkipLogic.handleHighlightElement(fieldId);
    }
  },

  handleHighlightElement: function (fieldId) {
    var $fieldNode = $("#" + fieldId)
    var tagName = $fieldNode[0].tagName;

    if ($fieldNode.attr('data-role') === "slider") {
      var slider = $fieldNode.parent().children()[2];
      var sliderId = "slider_" + fieldId;
      $(slider).attr("id", sliderId);
      SkipLogic.highlight("#" + slider_id, 'slider');
    }
    else if (tagName.toLowerCase() === 'select')
      SkipLogic.highlight("#" + fieldId, "select");
    else if (tagName.toLowerCase() === 'img')
      SkipLogic.highlight("#property_" + fieldId + "_container", "img");
    else
      SkipLogic.highlight("#" + fieldId, "others");
  },

  highlight: function (element, type) {
    if (this.currentHighlight && this.currentHighlight !== element) {
      SkipLogic.unhighlightElement(element, type);
    }
    SkipLogic.highlightElement(element, type);
  },

  highlightElement: function (element, type) {
    if (type === "select") {
      var $parent = $(element).closest(".ui-select");
      $parent.addClass('highlighted').removeClass('unhighlighted');
    }
    else if (type === 'slider') {
      $(element).css({
        "-webkit-box-shadow": "0 0 12px #3388cc",
        "-moz-box-shadow": "0 0 12px #3388cc",
        "box-shadow": "0 0 12px #3388cc"
      });
    }
    else
      $(element).addClass('highlighted').removeClass('unhighlighted');
    this.currentHighlight = element;
  },

  unhighlightElement: function (element, type) {
    if (type === "select") {
      var $parent = $(element).closest(".ui-select");
      $parent.addClass('unhighlighted').removeClass('highlighted');
    }
    else if (type === 'slider') {
      $(element).css({
        "-webkit-box-shadow": "",
        "-moz-box-shadow": "",
        "box-shadow": ""
      });
    }
    else
      $(element).addClass('unhighlighted').removeClass('highlighted');
    this.currentHighlight = false;
  },

  setStateUI: function (fieldIdStart, fieldIdEnd, state) {
    var enabled  = state || false

    var fieldIds = FieldController.fieldIds();
    var startIndex, endIndex;

    for(var i=0; i<fieldIds.length; i++){
      var fieldId = fieldIds[i]
      if (fieldIdStart === fieldId)
        startIndex = i + 1;
      if (fieldIdEnd === fieldId) {
        endIndex = i;
        break;
      }
    }

    for (var i = startIndex; i < endIndex; i++) {
      var fieldId = fieldIds[i];
      var $stateNode = $("#" + fieldId)
      var field = FieldController.findFieldById(fieldId)

      if(enabled){
        if(field.required)
          $stateNode.attr('required', 'required');
        SkipLogic.enableElement(fieldId);
      }
      else{
        if(field.required)
          $stateNode.removeAttr('required');
        SkipLogic.disableElement(fieldId);
        SkipLogic.setValueToEmpty(fieldId);
      }
      field.disableState = !enabled
    }
    var traceField = FieldController.findFieldById(fieldIdStart)
    traceField.skipTo =  enabled ? 0 : fieldIdEnd;
  },

  disableElement: function (disabledId) {
    $("#wrapper_" + disabledId).addClass('ui-disabled');
  },

  enableElement: function (enabledId) {
    $("#wrapper_" + enabledId).removeClass('ui-disabled');
  },

  setValueToEmpty: function (fieldId) {
    var $fieldNode = $("#" + fieldId);
    if ($fieldNode.attr('data-role') === "slider")
      $fieldNode.val("0").slider("refresh");
    else if ($fieldNode[0].tagName.toLowerCase() === 'select')
      $fieldNode.val("").selectmenu('refresh');
    else if ($fieldNode[0].tagName.toLowerCase() === 'img') {
      $fieldNode.attr("src", "data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
      $("#wrapper_" + fieldId).addClass('skip-logic-over-img');
    }
    else if ($fieldNode.attr("class") === "tree")
      Hierarchy.selectedNode(fieldId, "");
    else
      $fieldNode.val("");
  },

  disableUIEditSite: function (field) {
    if (!(field.is_enable_field_logic && field.config))
      return;

    switch (field.kind) {
      case "numeric":
        var configFieldLogics =  field.config.field_logics || [];
        for(var i=0; i<configFieldLogics.length; i++) {
          var fieldLogic = configFieldLogics[i];
          var op = fieldLogic.condition_type;
          if (Operators[op](field.__value, fieldLogic.value)) {
            SkipLogic.setStateUI(field.idfield, fieldLogic.field_id);
            break;
          }
        }
        break;
      case "select_one":
        var options = field.config.options;
        for (var i = 0; i < options.length; i++) {
          if (options[i].id == field.__value || options[i].code == field.__value) {
            SkipLogic.setStateUI(field.idfield, options[i].field_id);
            break;
          }
        }
        break;
      case "select_many":
        if (field.__value) {
          var selectedValues = FieldHelper.generateCodeToIdSelectManyOption(field, field.__value);
          var fieldLogics =  field.config.field_logics || [];
          for(var i=0; i< fieldLogics.length; i++){
            var condition = this.matchCondition(fieldLogics[i], selectedValues)
            if (condition) {
              SkipLogic.setStateUI(field.idfield, fieldLogic[i].field_id);
              break;
            }
          }
        }
        break;
      case "yes_no":
        for (var i = 0; i < field.config.options.length; i++) {
          if (field.__value == field.config.options[i].id) {
            var elementId = prefixId + field.idfield;
            var elementIdToFocus = prefixId + field.config.options[i].field_id;
            SkipLogic.setStateUI(elementId, elementIdToFocus);
          }
        }
        break;
    }
  },

  disableUIAddSite: function (field) {
    if (field.is_enable_field_logic && field.config && field.kind === "yes_no") {
      var value = $("#" + field.idfield).val();
      for (var i = 0; i < field.config.options.length; i++) {
        if (value == field.config.options[i].id) {
          var elementId = field.idfield;
          var elementIdToFocus = field.config.options[i].field_id;
          SkipLogic.setStateUI(elementId, elementIdToFocus);
        }
      }
    }
  }
}

function scrollToLayer(selectedValue) {
  if (selectedValue === 'logout')
    setTimeout(function () { SessionController.logout(); }, 50);
  else
    triggerExpand("#collapsable_" + selectedValue);
}

function scrollToHash($element) {
  if ($element.length > 0)
    $(document.body).animate({
      'scrollTop': $element.offset().top
    }, 800);
}

function triggerExpand(element) {
  var $active = $(element).parent().find("[data-collapsed=true]");
  if($active.length > 0)
    $active.collapsible('collapse');
  $(element).collapsible('expand');
}
