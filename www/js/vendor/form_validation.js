$(document).ready(function () {
  $.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ".invisible :hidden:not(select)",
    focusInvalid: false,
    errorPlacement: function () {
    }
  });

  $('#form_login').validate({
    invalidHandler: function () {
      ValidationHelper.setPopUpMsgError("#validation_email_psd");
      ValidationHelper.showPopUpErrorMessage();
    },
    submitHandler: function () {
      var email = $("#email").val();
      var password = $("#password").val();
      SessionController.authUser(email, password);
    }
  });

  $('#form_signup').validate({
    focusInvalid: false,
    errorPlacement: function() {
    },
    submitHandler: function() {
      if (App.isOnline()) {
        hideElement($("#internet"));
        var email = $('#signupemail').val();
        var password = $('#signuppassword').val();
        var passwordConfirmation = $('#pswConfirm').val();
        var user = {
          email: email,
          password: password,
          password_confirmation: passwordConfirmation};

        SessionController.signUp(user);
      }
      else
        showElement($("#internet"));
    },
    invalidHandler: function() {
      showValidateMessage('#validation_email_psd_confirm');
    }
  });

  $('#form_create_site').validate({
    ignore:'',
    focusInvalid: false,
    errorPlacement: function(error, element) {
      if (element.attr("type") === "number" &&
          (element.attr("min") || element.attr("max")))
        error.insertAfter($(element).parent());
      addClassError(element);

      var classElement = document.getElementsByClassName("image");
      var classHierarchyElement = document.getElementsByClassName("tree");
      if (classHierarchyElement.length != 0)
        h = validateHierarchySubmitHandler(classHierarchyElement, '#validation_create-site');
      if (classElement.length != 0)
        bImage = validateImageSubmitHandler(classElement, '#validation_create-site');
    },
    invalidHandler: function (e, validator) {
      ValidationHelper.invalidHandler(validator, "#validation_create-site");
    },
    submitHandler: function () {
      ValidationHelper.handleSubmitHandler("#validation_create-site",
          function () {
            SiteController.add();
            App.DataStore.clearPartlyAfterCreateSite();
          });
    }
  });

  $('#form_update_site').validate({
    ignore:'',
    focusInvalid: false,
    errorPlacement: function(error, element) {
      if (element.attr("type") === "number" &&
          (element.attr("min") || element.attr("max")))
        error.insertAfter($(element).parent());
      addClassError(element);

      var classElement = document.getElementsByClassName("image");
      var classHierarchyElement = document.getElementsByClassName("tree");
      if (classHierarchyElement.length != 0)
        h = validateHierarchySubmitHandler(classHierarchyElement, '#validation_update-site');
      if (classElement.length != 0)
        bImage = validateImageSubmitHandler(classElement, '#validation_update-site');
    },
    invalidHandler: function (e, validator) {
      ValidationHelper.invalidHandler(validator, "#validation_update-site");
    },
    submitHandler: function () {
      ValidationHelper.handleSubmitHandler("#validation_update-site",
          function () {
            SiteOfflineController.updateBySiteId();
          });
    }
  });

  $('#form_update_site_online').validate({
    ignore:'',
    focusInvalid: false,
    errorPlacement: function(error, element) {
      if (element.attr("type") === "number" &&
          (element.attr("min") || element.attr("max")))
        error.insertAfter($(element).parent());
      addClassError(element);

      var classElement = document.getElementsByClassName("image");
      var classHierarchyElement = document.getElementsByClassName("tree");
      if (classHierarchyElement.length != 0)
        h = validateHierarchySubmitHandler(classHierarchyElement, '#validation_update-site-online');
      if (classElement.length != 0)
        bImage = validateImageSubmitHandler(classElement, '#validation_update-site');
    },
    invalidHandler: function (e, validator) {
      ValidationHelper.invalidHandler(validator, "#validation_update-site-online");
    },
    submitHandler: function () {
      ValidationHelper.handleSubmitHandler("#validation_update-site-online",
          function () {
            SiteOnlineController.updateBySiteId();
          });
    }
  });
});
