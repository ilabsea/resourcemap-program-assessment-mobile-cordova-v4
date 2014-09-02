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
      if ($("#" + field_id)[0].tagName.toLowerCase() === 'img') {
        location.hash = ("#property_" + field_id + "_container");
        highlighted($("#property_" + field_id + "_container"));
      }
      else if ($("#" + field_id)[0].tagName.toLowerCase() === 'select') {
        location.hash = ("#" + field_id + "-button");
        var $parent = $("#" + field_id).closest('.ui-select');
        highlighted($parent);
      }
      else {
        location.hash = "#" + field_id;
        highlighted($("#" + field_id));
      }
    }
  }
}