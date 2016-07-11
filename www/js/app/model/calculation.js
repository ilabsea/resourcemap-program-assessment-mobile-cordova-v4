Calculation = {
  calculate: function ($element) {
    var parendId  = $element.attr("data-parent-id");
    var field = FieldController.findFieldById(parendId);

    if(!field ||  field.kind != 'calculation')
      return;

    var jsCode = Calculation.generateSyntax(field);
    App.log("Calculation code: ", jsCode );
    var value = eval(jsCode);

    if (field.config.allows_decimals == "true" && !isNaN(value)) {
      var digit_precision = field.config.digits_precision;
      if (digit_precision) {
        value = parseFloat(value);
        value = Number(value.toFixed(parseInt(digit_precision)));
      }
    }
    if ((typeof (value) == "string" && value.indexOf("NaN") > -1))
      value = value.replace("NaN", "");
    else if (typeof (value) == "number" && isNaN(value))
      value = "";
    var $fieldUI = $("#" + field.idfield);
    $fieldUI.val(value);
  },

  generateSyntax: function (field) {
    var syntaxCal = field.config.code_calculation;
    if (syntaxCal) {

      $.each(field.config.dependent_fields, function (_, dependField) {
        var $fieldUI = $("#" + dependField.id)
        var fieldValue;
        switch (dependField.kind) {
          case "text":
          case "email":
          case "phone":
          case "date":
            fieldValue = $fieldUI.val()
            break;
          case "calculation":
            fieldValue = $fieldUI.val();
            if (!isNaN(parseFloat(fieldValue)))
              parseFloat(fieldValue)
            break;
          case "numeric":
            fieldValue = parseFloat($fieldUI.val())
            break;
          case "select_one":
            fieldValue = $fieldUI.find('option:selected').text();
            break;
          case "yes_no":
            fieldValue = $fieldUI.val() == 0 ? false : true
        }
        var pattern = "${" + dependField.code + "}";
        var escape = pattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        var regex = new RegExp(escape, "g")
        syntaxCal = syntaxCal.replace(regex, fieldValue);
      });
      return syntaxCal;
    }
  }
};
