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
      ValidationHelper.showValidateMessage("#validation_email_psd");
    },
    submitHandler: function () {
      var email = $("#email").val();
      var password = $("#password").val();
      SessionController.authUser(email, password);
    }
  });

  $('#form_signup').validate({
    submitHandler: function () {
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
    invalidHandler: function () {
      ValidationHelper.showValidateMessage("#validation_email_psd_confirm");
    }
  });

  $('#form_create_site').validate({
    errorPlacement: function (error, element) {
      ValidationHelper.AddClassSelectError(element);
      error.insertAfter($(element).parent());
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
    errorPlacement: function (error, element) {
      if (element.attr("type") === "number" &&
          (element.attr("min") || element.attr("max")))
        error.insertAfter($(element).parent());
      ValidationHelper.addClassError(element);
    },
    invalidHandler: function () {
      showValidateMessage('#validation_update-site');
    },
    submitHandler: function () {
      var classElement = document.getElementsByClassName("image");
      var classHierarchyElement = document.getElementsByClassName("tree");
      var h = true;
      var bImage = true;

      if (classHierarchyElement.length != 0)
        h = validateHierarchySubmitHandler(classHierarchyElement, '#validation_update-site');
      if (classElement.length != 0)
        bImage = validateImageSubmitHandler(classElement, '#validation_update-site', SiteController.updateBySiteIdOffline);
      if (h && bImage)
        SiteController.updateBySiteIdOffline();
    }
  });

  $('#form_update_site_online').validate({
    errorPlacement: function (error, element) {
      ValidationHelper.addClassError(element);

    },
    invalidHandler: function () {
      showValidateMessage('#validation_update-site-online');
    },
    submitHandler: function (e) {
      var classElement = document.getElementsByClassName("image");
      var classHierarchyElement = document.getElementsByClassName("tree");
      var h = true;
      var bImage = true;

      if (classHierarchyElement.length != 0)
        h = validateHierarchySubmitHandler(classHierarchyElement, '#validation_update-site-online');
      if (classElement.length != 0)
        bImage = validateImageSubmitHandler(classElement, '#validation_update-site-online', SiteController.updateBySiteIdOnline);
      if (h && bImage)
        SiteController.updateBySiteIdOnline();
    }
  });
});