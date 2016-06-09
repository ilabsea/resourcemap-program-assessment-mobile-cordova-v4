SkipLogic = {
  skipLogicNumber: function (element) {
    var val = $(element).val();
    var idElement = $(element).attr('id');
    var prefixIdElement = idElement.substr(0, idElement.lastIndexOf("_") + 1);
    var id = idElement.substr(idElement.lastIndexOf("_") + 1);
    var config = JSON.parse(
        App.DataStore.get("configNumberSkipLogic_" + id));
    if (config) {
      $.each(config, function (i, field_logic) {
        var op = field_logic.condition_type;
        if (Operators[op](val, field_logic.value)) {
          SkipLogic.handleSkipLogic(idElement, prefixIdElement + field_logic.field_id);
          return false;
        } else {
          if (i == config.length - 1) {
            SkipLogic.handleSkipLogic(idElement, "");
          }
        }
      });
    }
  },
  skipLogicYesNo: function (element) {
    var $element = $("#" + element);
    if ($element.attr('data-is_enable_field_logic')) {
      if ($element.attr('data-role') === "slider") {
        App.DataStore.set("yesNoField", element);
        var field_id = $('option:selected', $element).attr('data-field_id');
        SkipLogic.handleSkipLogic(element, field_id);
      }
    }
  },
  skipLogicSelectOne: function (element) {
    var $element = $("#" + element);
    var field_id = $('option:selected', $element).attr('data-field_id');
    SkipLogic.handleSkipLogic(element, field_id);
  },
  skipLogicSelectMany: function (element) {
    var selectedValue = element.val();
    var idElement = element.attr('id');
    var id = idElement.substr(idElement.lastIndexOf("_") + 1);
    var wrapper_skip = idElement.slice(0, idElement.lastIndexOf("_") + 1);
    if (selectedValue) {
      var configOption = JSON.parse(
          App.DataStore.get("configSelectManyForSkipLogic_" + id));

      if (configOption.config.field_logics) {
        if ((configOption.id || configOption.idfield) == id) {
          $.each(configOption.config.field_logics, function (k, field_logic) {
            var selectedOptions = field_logic.selected_options;

            var b = false;
            var is_all = [];
            var all_condi = false;

            for (var i in selectedValue) {
              for (var j in selectedOptions) {
                if (selectedValue[i] == selectedOptions[j].value) {
                  b = true;
                  is_all.push(true);
                  break;
                }
              }
              if (b) {
                if (field_logic.condition_type == 'any') {
                  all_condi = true;
                  break;
                } else {
                  if (is_all.length == Object.keys(selectedOptions).length) {
                    all_condi = App.allBooleanTrue(is_all);
                    break;
                  }
                }
              }
            }
            if (all_condi) {
              var field_id = wrapper_skip + field_logic.field_id;
              SkipLogic.handleSkipLogic(idElement, field_id);
              return false;
            } else {
              if (k === configOption.config.field_logics.length - 1) {
                SkipLogic.getDisabledId(idElement, idElement);
              }
            }
          });
        }
      }
    } else
      SkipLogic.getDisabledId(idElement, idElement);
  },

  prepareSkip: function(nodeFieldId){
    var $parent = $skipToNode.parent().parent();
    triggerExpand($parent);

    scrollToHash($skipToNode);

    setTimeout(function () {
      $("#" + nodeFieldId).focus();
    }, 500);
  },

  handleSkipLogic: function (element, nodeFieldId) {

    var fieldId = "";
    if (nodeFieldId)
      fieldId = nodeFieldId.substr(nodeFieldId.lastIndexOf("_") + 1);
    if (fieldId) {
      var $parent = FieldController.lazyLayerFields(fieldId)
      triggerExpand($parent);
      var $skipToNode = $("#wrapper_" + nodeFieldId)
      scrollToHash($skipToNode);

      setTimeout(function () {
        $("#" + nodeFieldId).focus();
      }, 500);
    }
    else {
      nodeFieldId = element;
    }
    SkipLogic.getDisabledId(element, nodeFieldId);
    SkipLogic.handleHighlightElement(nodeFieldId);
  },
  handleHighlightElement: function (field_id) {
    if ($("#" + field_id).attr('data-role') === "slider") {
      var slider = ($("#" + field_id).parent()).children()[2];
      $(slider).attr("id", "slider_" + field_id);
      var slider_id = $(slider).attr("id");

      SkipLogic.highlight("#" + slider_id, 'slider');
    }else if ($("#" + field_id)[0].tagName.toLowerCase() === 'select')
      SkipLogic.highlight("#" + field_id, "select");
    else if ($("#" + field_id)[0].tagName.toLowerCase() === 'img')
      SkipLogic.highlight("#property_" + field_id + "_container", "img");
    else {
      SkipLogic.highlight("#" + field_id, "others");
    }
  },
  highlight: function (element, type) {
    var highlightedElement = App.DataStore.get("highlightedElement");
    var typeElement = App.DataStore.get("typeElement");
    if (highlightedElement) {
      if (highlightedElement !== element)
        SkipLogic.unhighlightElement(highlightedElement, typeElement);
      else
        return;
    }
    SkipLogic.highlightElement(element, type);
  },
  highlightElement: function (element, type) {
    if (type === "select") {
      var $parent = $(element).closest(".ui-select");
      $parent.addClass('highlighted').removeClass('unhighlighted');
    } else if (type === 'slider') {
      $(element).css({
        "-webkit-box-shadow": "0 0 12px #3388cc",
        "-moz-box-shadow": "0 0 12px #3388cc",
        "box-shadow": "0 0 12px #3388cc"
      });
    } else
      $(element).addClass('highlighted').removeClass('unhighlighted');
    App.DataStore.set("highlightedElement", element);
    App.DataStore.set("typeElement", type);
  },
  unhighlightElement: function (element, type) {
    if (type === "select") {
      var $parent = $(element).closest(".ui-select");
      $parent.addClass('unhighlighted').removeClass('highlighted');
    } else if (type === 'slider') {
      $(element).css({
        "-webkit-box-shadow": "",
        "-moz-box-shadow": "",
        "box-shadow": ""
      });
    } else
      $(element).addClass('unhighlighted').removeClass('highlighted');
    App.DataStore.remove("highlightedElement");
    App.DataStore.remove("typeElement");
  },
  getDisabledId: function (fieldId, field_focus) {
    var field_id_arr = JSON.parse(App.DataStore.get("field_id_arr"));
    var disabled_id, enabled_id;
    var startIndex, endIndex;
    var prefixId = fieldId.substr(0, fieldId.lastIndexOf("_") + 1);
    $.each(field_id_arr, function (i, field_id) {
      field_id = prefixId + field_id;
      if (field_id === fieldId)
        startIndex = i + 1;
      if (field_id === field_focus) {
        endIndex = i;
        return false;
      }
    });
    for (var i = startIndex; i < endIndex; i++) {
      disabled_id = prefixId + field_id_arr[i];
      if ($("#" + disabled_id).attr('require') === "required"
          || $("#" + disabled_id).attr("required")) {
        $("#" + disabled_id).attr('require', "");
        $("#" + disabled_id).removeAttr('required');
      }
      SkipLogic.disableElement(disabled_id);
      SkipLogic.setValueToEmpty(disabled_id);
    }
    for (var j = endIndex; j < field_id_arr.length; j++) {
      enabled_id = prefixId + field_id_arr[j];
      SkipLogic.enableElement(enabled_id);
    }
  },
  disableElement: function (disabled_id) {
    $("#wrapper_" + disabled_id).addClass('ui-disabled');
  },
  enableElement: function (enabled_id) {
    $("#wrapper_" + enabled_id).removeClass('ui-disabled');
  },
  setValueToEmpty: function (idElement) {
    var $element = $("#" + idElement);
    if ($element.attr('data-role') === "slider")
      $element.val("0").slider("refresh");
    else if ($element[0].tagName.toLowerCase() === 'select')
      $element.val("").selectmenu('refresh');
    else if ($element[0].tagName.toLowerCase() === 'img') {
      $element.attr("src", "data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
      $("#wrapper_" + idElement).addClass('skip-logic-over-img');
    }
    else if ($element.attr("class") === "tree")
      Hierarchy.selectedNode(idElement, "");
    else
      $element.val("");
  },
  disableUIEditSite: function (field, prefixId) {
    if (field.is_enable_field_logic) {
      if (field.config) {
        switch (field.kind) {
          case "numeric":
            // Server side can have field logic enable but no data bug
            var configFieldLogics =  field.config.field_logics || [];
            $.map(configFieldLogics, function (field_logic) {
              var op = field_logic.condition_type;
              var elementId = prefixId + field.idfield;
              var elementIdToFocus = prefixId + field_logic.field_id;
              if (Operators[op](field.__value, field_logic.value)) {
                SkipLogic.getDisabledId(elementId, elementIdToFocus);
                return false;
              }
            });
            break;
          case "select_one":
            for (var i = 0; i < field.config.options.length; i++) {
              var elementId = prefixId + field.idfield;
              var elementIdToFocus = prefixId + field.config.options[i].field_id;
              if (field.config.options[i].id == field.__value
                  || field.config.options[i].code == field.__value) {
                SkipLogic.getDisabledId(elementId, elementIdToFocus);
              }
            }
            break;
          case "select_many":
            if (field.__value) {
              var value = FieldHelper.generateCodeToIdSelectManyOption(field, field.__value);
              // Server side can have field logic enable but no data bug
              var configFieldLogics =  field.config.field_logics || [];
              $.map(configFieldLogics, function (field_logic) {
                var selectedOptions = field_logic.selected_options;

                var b = false;
                var is_all = [];
                var all_condi = false;

                for (var i in value) {
                  for (var j in selectedOptions) {
                    if (value[i] == selectedOptions[j].value) {
                      b = true;
                      is_all.push(true);
                      break;
                    }
                  }
                  if (b) {
                    if (field_logic.condition_type == 'any') {
                      all_condi = true;
                      break;
                    } else {
                      if (is_all.length == Object.keys(selectedOptions).length) {
                        all_condi = App.allBooleanTrue(is_all);
                        break;
                      }
                    }
                  }
                }
                if (all_condi) {
                  var elementId = prefixId + field.idfield;
                  var elementIdToFocus = prefixId + field_logic.field_id;
                  SkipLogic.getDisabledId(elementId, elementIdToFocus);
                  return false;
                }
              });
            }
            break;
          case "yes_no":
            for (var i = 0; i < field.config.options.length; i++) {
              if (field.__value == field.config.options[i].id) {
                var elementId = prefixId + field.idfield;
                var elementIdToFocus = prefixId + field.config.options[i].field_id;
                SkipLogic.getDisabledId(elementId, elementIdToFocus);
              }
            }
            break;
        }
      }
    }
  },
  disableUIAddSite: function (field) {
    if (field.is_enable_field_logic) {
      var config = field.config;
      if (config && field.kind === "yes_no") {
        var value = $("#" + field.idfield).val();
        for (var i = 0; i < config.options.length; i++) {
          if (value == config.options[i].id) {
            var elementId = field.idfield;
            var elementIdToFocus = config.options[i].field_id;
            SkipLogic.getDisabledId(elementId, elementIdToFocus);
          }
        }
      }
    }
  }
};

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
