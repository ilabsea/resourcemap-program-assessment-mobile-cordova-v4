function highlighted(element) {
  element.addClass('highlighted').removeClass('unhighlighted');
  setTimeout(function() {
    element.removeClass('highlighted').addClass('unhighlighted');
  }, 3000);
}

function setFocus(element) {
  var $element = $("#" + element.id);
  if ($element.attr('data-role') === "slider"
      && $element.attr('data-is_enable_field_logic')) {
    var field_id = $('option:selected', element).attr('field_id');
    if (field_id) {
      location.hash = ("#wrapper_" + field_id);
      if ($("#" + field_id)[0].tagName.toLowerCase() === 'img') 
        highlighted($("#property_" + field_id + "_container"));
      else if ($("#" + field_id)[0].tagName.toLowerCase() === 'select') {
        var $parent = $("#" + field_id).closest('.ui-select');
        highlighted($parent);
      }
      else 
        highlighted($("#" + field_id));
    }
  }
}