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

  relatedFieldLogic: function(element_id){
    result = [] ;
    for(var l=0; l<FieldController.layers.length; l++){
      layer = FieldController.layers[l];
      for(var f=0; f<layer.fields.length; f++){
        field = layer.fields[f];
        if (field.config && field.config['field_logics'] ) {
          for(var i=0; i<field.config['field_logics'].length; i++){
            if(field.config['field_logics'][i].field_id.toString() == element_id.toString()){
              result.push(field) ;
            }
          }
        }
      }
    }
    return result;
  },

  parseDependantFieldLogicValue: function(fieldLogicObj){
    var dependantFieldValue = $('#'+fieldLogicObj.idfield).val();
    switch(fieldLogicObj.kind) {
      case "numeric":
        dependantFieldValue = parseInt(dependantFieldValue);
        break;
      case "select_one":
        dependantFieldValue = $('#'+fieldLogicObj.idfield).find(":selected").attr('data-code');
        break;
    }

    if(dependantFieldValue == undefined)
      dependantFieldValue = FieldController.findFieldById(fieldLogicObj.idfield).__value;
    return dependantFieldValue;
  },

  processSkipLogic: function(element_id){
    var relatedFieldsWithLogic = this.relatedFieldLogic(element_id);

    if(relatedFieldsWithLogic.length > 0){
      for(var l=0; l<relatedFieldsWithLogic.length; l++){
        var match = false
        for(var i=0; i<relatedFieldsWithLogic[l].config['field_logics'].length; i++){
          var fieldLogic = relatedFieldsWithLogic[l].config['field_logics'][i]
          var fieldLogicObj = FieldController.findFieldById(fieldLogic.field_id);
          var operationType = fieldLogic.condition_type;
          var dependantFieldValue = this.parseDependantFieldLogicValue(fieldLogicObj);
          if(fieldLogicObj.kind == 'numeric'){
            fieldLogic.value = parseInt(fieldLogic.value);
          }
          match = Operators[operationType](dependantFieldValue, fieldLogic.value);
          if(match == true){
            break;
          }
        }
        SkipLogic.applySkipLogic(relatedFieldsWithLogic[l], fieldLogic.field_id, match);
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
