SkipLogic = {
  currentHighlight: false,

  setDisableState: function( field ) {
    if (field.config && field.config['field_logics'] ) {
      for(var i=0; i<field.config['field_logics'].length; i++){
        var fieldLogic = field.config['field_logics'][i];
        var fieldLogicObj = FieldController.findFieldById(fieldLogic.field_id);
        var operationType = fieldLogic.condition_type;
        var match = Operators[operationType](fieldLogicObj.__value, fieldLogic.value);
        return match;
      }
    } else{
      return false;
    }
  },

  processSkipLogic: function (element_id, value_search) {
    for(var l=0; l<FieldController.layers.length; l++){
      layer = FieldController.layers[l];
      for(var f=0; f<layer.fields.length; f++){
        field = layer.fields[f];
        if (field.config && field.config['field_logics'] ) {
          for(var i=0; i<field.config['field_logics'].length; i++){
            var fieldLogic = field.config['field_logics'][i]
            var fieldLogicObj = FieldController.findFieldById(fieldLogic.field_id);
            if(fieldLogic.field_id.toString() == element_id.toString()){
              var operationType = fieldLogic.condition_type;
              if(fieldLogicObj.kind == 'numeric'){
                value_search = parseInt(value_search);
                fieldLogic.value = parseInt(fieldLogic.value);
              }
              var match = Operators[operationType](value_search, fieldLogic.value);
              SkipLogic.applySkipLogic(field, fieldLogic.field_id, match);
            }
          }
        }
      }
    }
  },

  processSkipLogicSelectMany: function (element, element_id) {
    var list_ids = element.find(":selected");
    var list_codes = new Array();
    for(var i=0; i< list_ids.length; i++){
      list_codes.push($(list_ids[i]).data("code"));
    }
    return SkipLogic.calculateSkipLogicSelectManyByListCode(list_codes, element_id);
  },

  calculateSkipLogicSelectManyByListCode: function (list_codes, element_id) {
    for(var l=0; l<FieldController.layers.length; l++){
      layer = FieldController.layers[l];
      for(var f=0; f<layer.fields.length; f++){
        field = layer.fields[f];
        if (field.config && field.config['field_logics'] ) {
          for(var i=0; i<field.config['field_logics'].length; i++){
            field_logic = field.config['field_logics'][i]
            if(field_logic.field_id == element_id){
              var fieldLogic = field.config['field_logics'][i]
              var operationType= fieldLogic.condition_type;
              var field_logic_value = fieldLogic.value.split(",")
              var match = Operators["=="](list_codes, field_logic_value);
              SkipLogic.applySkipLogic(field, fieldLogic.field_id, match);
            }
          }
        }
      }
    }
  },

  applySkipLogic: function(field, fieldId, condition){
    if(condition) {
      SkipLogic.disableElement(field.idfield);
      SkipLogic.removeRequiredFromField(field);
      SkipLogic.setValueToEmpty(field.idfield);
    }
    else{
      SkipLogic.enableElement(field.idfield);
      SkipLogic.setDefaultRequiredOfField(field);
    }
  },
  setDefaultRequiredOfField: function(field){
    field.required = field.is_mandatory ? 'required' : "";
  },
  removeRequiredFromField: function(field){
    field.required = '';
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

  disableElement: function (disabledId) {
    $("#wrapper_" + disabledId).addClass('ui-disabled');
  },

  enableElement: function (enabledId) {
    $("#wrapper_" + enabledId).removeClass('ui-disabled');
  },

  setValueToEmpty: function (fieldId) {
    var $fieldNode = $("#" + fieldId);

    //field in diff layer
    if($fieldNode.length == 0){
      return;
    }

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
  $(element).collapsible('expand');
}
