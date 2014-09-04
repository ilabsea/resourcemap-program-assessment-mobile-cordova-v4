SkipLogic = {
  setFocus: function(element) {
    var $element = $("#" + element.id);
    if ($element.attr('data-is_enable_field_logic')) {
      if ($element.attr('data-role') === "slider")
        App.DataStore.set("yesNoField", element.id);

      var field_id = $('option:selected', element).attr('data-field_id');
      if (field_id) {
        var skipToId = "#wrapper_" + field_id;
        var $parent = $(skipToId).parent().parent();
        triggerExpand($parent);
        scrollTo(skipToId);
        SkipLogic.handleHighlightElement(field_id);
      }
    }
  },
  handleHighlightElement: function(field_id) {
    if ($("#" + field_id)[0].tagName.toLowerCase() === 'img')
      SkipLogic.highlight("#property_" + field_id + "_container", "img");
    else if ($("#" + field_id)[0].tagName.toLowerCase() === 'select')
      SkipLogic.highlight("#" + field_id, "select");
    else
      SkipLogic.highlight("#" + field_id, "others");
  },
  highlight: function(element, type) {
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
  highlightElement: function(element, type) {
    if (type === "select") {
      var $parent = $(element).closest(".ui-select");
      $parent.addClass('highlighted').removeClass('unhighlighted');
    } else
      $(element).addClass('highlighted').removeClass('unhighlighted');
    App.DataStore.set("highlightedElement", element);
    App.DataStore.set("typeElement", type);
  },
  unhighlightElement: function(element, type) {
    if (type === "select") {
      var $parent = $(element).closest(".ui-select");
      $parent.addClass('unhighlighted').removeClass('highlighted');
    } else
      $(element).addClass('unhighlighted').removeClass('highlighted');
    App.DataStore.remove("highlightedElement");
    App.DataStore.remove("typeElement");
  }
};

function scrollTo(element) {
  if ($(element).length > 0)
    $(document.body).animate({
      'scrollTop': $(element).offset().top
    }, 700);
}

function triggerExpand(parent) {
  parent.find(".ui-collapsible-heading").
      removeClass("ui-collapsible-heading-collapsed");
  parent.find(".ui-collapsible-content").
      removeClass("ui-collapsible-content-collapsed");
  parent.find(".ui-collapsible-heading a").
      addClass("ui-icon-minus").removeClass("ui-icon-plus");
}