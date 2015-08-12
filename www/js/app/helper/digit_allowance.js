var DigitAllowance = {
  digitValidate: function (re, element) {
    var value = $(element).val();
    if (value == "-" || value == "" || value == "+") {
      $(element).prop("data-previous-value", value);
    } else {
      if (!re.test(value)) {
        $(element).val($(element).prop("data-previous-value"));
      } else {
        $(element).prop("data-previous-value", value);
      }
    }
  },
  handleNumberInput: function (element) {
    var re;
    if ($(element).attr("data-allows_decimals") == "true") {
      var digit_precision = $(element).attr("data-digits_precision");
      re = new RegExp("^([-+]?[0-9]+[\.]?[0-9]{0," + digit_precision + "})$");
    } else {
      re = /^-?([0-9]+)$/g;
    }
    DigitAllowance.digitValidate(re, element);
  },
  prepareEventListenerOnKeyPress: function () {
    $('.skipLogicNumber').each(function (e) {
      this.addEventListener("input", function () {
        DigitAllowance.handleNumberInput(this);
      }, false);
    });
  }
};