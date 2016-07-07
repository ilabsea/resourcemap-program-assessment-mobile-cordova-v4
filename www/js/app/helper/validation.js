function validateToRemoveStyle(element) {
  if (element.required) {
    var $parent = $(element).closest(".ui-select");
    if (element.value === "")
      $parent.removeClass('valid').addClass('error');
    else
      $parent.removeClass('error').addClass('valid');
  }
}

function validateImage(idElement) {
  var $element = $("#" + idElement);
  if ($element.attr('require') === "required") {
    if ($element.attr('src') === '') {
      $("#property_" + idElement + "_container").css({"border": "1px solid red"});
    } else {
      $("#property_" + idElement + "_container").css({"border": "1px solid #f3f3f3"});
    }
  }
}

function showValidateMessage(id) {
  $(id).show().delay(4000).fadeOut();
  $(id).focus();
}

function addClassError(element) {
  var $parent = $(element).closest('.ui-select');
  $parent.addClass("error");
}

function validateImageSubmitHandler(classElement, element) {
  var b = true;
  for (i = 0; i < classElement.length; i++) {
    var idElement = classElement[i].id;
    var $element = $("#" + idElement);
    if ($element.attr('require') == "required") {
      if ($element.attr('src') != '') {
        $("#property_" + idElement + "_container").css({"border": "1px solid #f3f3f3"});
      }
      else {
        b = false;
        $("#property_" + idElement + "_container").css({"border": "1px solid red"});
        showValidateMessage(element);
      }
    }
  }
  return b;
}

function validateHierarchySubmitHandler(classHierarchyElement, element) {
  var h = true;
  for (i = 0; i < classHierarchyElement.length; i++) {
    var idElement = classHierarchyElement[i].id;
    var $element = $("#" + idElement);
    if ($element.attr('require') == "required") {
      var node = $element.tree('getSelectedNode');
      if (!node.id) {
        $element.css({"border": "1px solid red"});
        showValidateMessage(element);
        h = false;
      }
      else {
        $element.css({"border": "1px solid #999999"});
      }
    }
  }
  return h;
}
