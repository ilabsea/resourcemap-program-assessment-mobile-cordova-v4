var ValidationHelper = {
  resetFormValidate: function (element) {
    var $element = $(element);
    var validator = $element.validate();
    validator.resetForm();
  }
};
