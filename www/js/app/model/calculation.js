Calculation = {
  calculate: function (element) {
    var idElement = element.id;
    var elementPrefixId = idElement.slice(0, idElement.lastIndexOf("_") + 1);
    var fields_cal = App.DataStore.get("fields_cal");
    fields_cal = JSON.parse(fields_cal);

    $.map(fields_cal, function (field_cal) {
      var cal_code = Calculation.generateSyntax(field_cal, elementPrefixId);

      var cal_ele = $("#" + elementPrefixId + field_cal.idfield);
      var value = eval(cal_code);
      if (field_cal.config.allows_decimals && !isNaN(parseFloat(value))) {
        var digit_precision = field_cal.config.digits_precision;
        if (digit_precision)
          value = value.toFixed(digit_precision);
      }
      cal_ele.val(value);
    });
  },
  generateSyntax: function (field_cal, elementPrefixId) {
    var syntaxCal = field_cal.config.code_calculation;
    if (syntaxCal) {
      // bring the longer code to be the front in config
      var length = 0;
      var dependentFields = field_cal.config.dependent_fields;

      $.map(dependentFields, function () {
        length++;
      });
      var tmp = "";
      for (var i = 0; i < length - 1; i++) {
        for (var j = i + 1; j < length; j++) {
          if (dependentFields[i]["code"].length < dependentFields[j]["code"].length) {
            tmp = dependentFields[i];
            dependentFields[i] = dependentFields[j];
            dependentFields[j] = tmp;
          }
        }
      }
      $.map(dependentFields, function (dependField) {
        var fieldName = "$" + dependField["code"];
        var fieldValue;
        switch (dependField["kind"]) {
          case "text":
          case "email":
          case "phone":
          case "date":
            fieldValue = "$('#" + elementPrefixId + dependField["id"] + "').val()";
            break;
          case "calculation":
            fieldValue = $("#" + elementPrefixId + dependField["id"]).val();
            if (!isNaN(parseFloat(fieldValue))) {
              fieldValue = "parseFloat($('#" + elementPrefixId + dependField["id"] + "').val())";
            } else {
              fieldValue = "$('#" + elementPrefixId + dependField["id"] + "').val()";
            }
            break;
          case "numeric":
            fieldValue = "parseFloat($('#" + elementPrefixId + dependField["id"] + "').val())";
            break;
          case "select_one":
            fieldValue = "$('#" + elementPrefixId + dependField["id"] + " option:selected').text()";
            break;
          case "yes_no":
            fieldValue = $("#" + elementPrefixId + dependField["id"]).val();
            if (fieldValue == 0)
              fieldValue = false;
            else
              fieldValue = true;
        }
        syntaxCal = syntaxCal.replace(new RegExp(fieldName.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), fieldValue);
      });
      return syntaxCal;
    }
  }
};