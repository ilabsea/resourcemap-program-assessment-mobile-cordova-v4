$(function() {

  $(document).delegate('.calculation', 'keyup change', function() {
    Calculation.calculate();
  });

  $(document).delegate('.validateSelectFields', 'change', function() {
    SkipLogic.setFocus(this);
    validateToRemoveStyle(this);
  });

  $(document).delegate('.ui-selectmenu', 'popupafterclose', function() {
    var start = this.id.search("-");
    var element = $("#" + this.id.substring(0, start));
    if (element.attr('data-is_enable_field_logic') && element.attr('multiple'))
      SkipLogic.handleSkipLogicSelectMany(element);
  });

  $('body').click(function(event) {
    var yesNoField = App.DataStore.get("yesNoField");
    var otherField = $(event.target).attr("id");
    var highlightedElement = App.DataStore.get("highlightedElement");
    var typeElement = App.DataStore.get("typeElement");
    if (highlightedElement)
      if (("#") + otherField !== yesNoField && otherField) {
        SkipLogic.unhighlightElement(highlightedElement, typeElement);
        App.DataStore.remove("yesNoField");
      }
  });
});