var DigitAllowance = {
  digitValidate: function (re, re1, element) {
    var value = $(element).val();
    App.log("value : ", value);
    if (!re.test(value)) {
      value = re1.exec(value);
      if (value) {
        $(element).attr("data-previous-value", value[0]);
        $(element).val(value[0]);
      } else {
        if ($(element).attr("data-previous-value").length <= 1) {
          $(element).val("");
          $(element).attr("data-previous-value", "");
        } else {
          $(element).val($(element).attr("data-previous-value"));
        }
      }
    }
  },
  handleNumberInput: function (element) {
    var re, re1;
    if ($(element).attr("data-allows_decimals") == "true") {
      var digit_precision = $(element).attr("data-digits_precision");
      re = new RegExp("^[-+]?([0-9]+[\.]?[0-9]{0," + digit_precision + "})$/g");
      re1 = new RegExp("^[-+]?([0-9]+[\.]?[0-9]{0," + digit_precision + "})");
    } else {
      re = /^-?([0-9]+)$/g;
      re1 = /^-?([0-9]+)/g;
    }
    DigitAllowance.digitValidate(re, re1, element);
  },
  prepareEventListenerOnKeyPress: function () {
    $('.skipLogicNumber').each(function (e) {
      this.addEventListener("input", function () {
        DigitAllowance.handleNumberInput(this);
      }, false);
    });
  }
};