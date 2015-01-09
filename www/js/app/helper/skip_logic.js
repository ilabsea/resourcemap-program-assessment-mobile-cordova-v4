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
          SkipLogic.handleSkipLogic(prefixIdElement + field_logic.field_id);
          return false;
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
    SkipLogic.handleSkipLogic(field_id);
  },
  skipLogicSelectMany: function (element) {
    var selectedValue = element.val();
    if (selectedValue) {
      var idElement = element.attr('id');
      var id = idElement.substr(idElement.lastIndexOf("_") + 1);
      var wrapper_skip = idElement.slice(0, idElement.lastIndexOf("_") + 1);
      var configOption = JSON.parse(
          App.DataStore.get("configSelectManyForSkipLogic_" + id));

      if (configOption.config.field_logics) {
        if ((configOption.id || configOption.idfield) == id) {
          $.each(configOption.config.field_logics, function (i, field_logic) {
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
              SkipLogic.handleSkipLogic(field_id);
              return false;
            }
          });
        }
      }
    }
  },
  handleSkipLogic: function (element, field_id) {
    var id = "";
    if (field_id)
      id = field_id.substr(field_id.lastIndexOf("_") + 1);
    if (id) {
      var skipToId = "#wrapper_" + field_id;
      var $parent = $(skipToId).parent().parent();
      triggerExpand($parent);

      scrollToHash(skipToId);

      SkipLogic.getDisabledId(element, field_id);

      setTimeout(function () {
        $("#" + field_id).focus();
      }, 500);

      SkipLogic.handleHighlightElement(field_id);
    }
  },
  handleHighlightElement: function (field_id) {
    if ($("#" + field_id).attr('data-role') === "slider") {
      var slider = ($("#" + field_id).parent()).children()[2];
      $(slider).attr("id", "slider_" + field_id);
      var slider_id = $(slider).attr("id");

      SkipLogic.highlight("#" + slider_id, 'slider');
    }
    else if ($("#" + field_id)[0].tagName.toLowerCase() === 'select')
      SkipLogic.highlight("#" + field_id, "select");
    else if ($("#" + field_id)[0].tagName.toLowerCase() === 'img')
      SkipLogic.highlight("#property_" + field_id + "_container", "img");
    else
      SkipLogic.highlight("#" + field_id, "others");
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
  getDisabledId: function (id1, id2) {
    var field_id_arr = JSON.parse(App.DataStore.get("field_id_arr"));
    App.log("id 1 : ", id1);
    App.log('id 2 : ', id2);
    var disabled_id = [];
    var startIndex, endIndex;
    $.each(field_id_arr, function (i, field_id) {
      if (field_id === id1) {
        startIndex = i;
      } else if (field_id === id2) {
        endIndex = i;
        return false;
      }
    });
    for (var i = startIndex; i < endIndex - 1; i++) {
      disabled_id.push(field_id_arr[i + 1]);
    }
    SkipLogic.disabledElement(disabled_id);
  },
  disabledElement: function (disabled_id) {
    for (var i in disabled_id) {
      App.log("disabled Id : ", disabled_id[i]);
      $("#wrapper_" + disabled_id[i]).prop('disabled',true);
    }
  }
};

function scrollToLayer(selectedValue) {
  var element = ("#collapsable_" + selectedValue);
  if (selectedValue == 'logout')
    setTimeout(function () {
      SessionController.logout();
    }, 50);
  else {
    triggerExpand($(element));
    scrollToHash(element);
  }
}

function scrollToHash(element) {
  if ($(element).length > 0)
    $(document.body).animate({
      'scrollTop': $(element).offset().top
    }, 800);
}

function triggerExpand(parent) {
  parent.find(".ui-collapsible-heading").
      removeClass("ui-collapsible-heading-collapsed");
  parent.find(".ui-collapsible-content").
      removeClass("ui-collapsible-content-collapsed");
  parent.find(".ui-collapsible-heading a").
      addClass("ui-icon-minus").removeClass("ui-icon-plus");
}