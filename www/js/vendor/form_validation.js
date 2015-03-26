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
      SessionController.set(email, password);
      SessionController.authUser(email, password);
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
      ValidationHelper.AddClassSelectError(element);
      error.insertAfter($(element).parent());
    },
    invalidHandler: function (e, validator) {
      ValidationHelper.invalidHandler(validator, "#validation_update-site");
    },
    submitHandler: function () {
      ValidationHelper.handleSubmitHandler("#validation_update-site",
          function () {
            SiteController.updateBySiteIdOffline();
          });
    }
  });

  $('#form_update_site_online').validate({
    errorPlacement: function (error, element) {
      ValidationHelper.AddClassSelectError(element);
      error.insertAfter($(element).parent());
    },
    invalidHandler: function (e, validator) {
      ValidationHelper.invalidHandler(validator, "#validation_update-site-online");
    },
    submitHandler: function (e) {
      ValidationHelper.handleSubmitHandler("#validation_update-site-online",
          function () {
            SiteController.updateBySiteIdOnline();
          });
    }
  });
});