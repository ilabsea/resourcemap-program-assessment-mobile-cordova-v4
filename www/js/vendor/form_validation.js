$(document).ready(function() {

  $('#form_login').validate({
    focusInvalid: false,
    errorPlacement: function() {
    },
    invalidHandler: function() {
      showValidateMessage('#validation_email_psd');
    },
    submitHandler: function() {
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
      if (isOnline()) {
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
    invalidHandler: function(event, validator) {
      showValidateMessage('#validation_email_psd_confirm');
    }
  });

  $('#form_create_site').validate({
    focusInvalid: false,
    errorPlacement: function(error, element) {
      validateImage();
      addClassError(element);
    },
    invalidHandler: function() {
      showValidateMessage('#validation_create-site');
    },
    submitHandler: function() {
      if ($(".image").attr('require') == "required") {
        if ($('.image').attr('src') != '') {
          $(".photo").css({"border": "1px solid #f3f3f3"});
          SiteController.add();
        } else {
          $(".photo").css({"border": "1px solid red"});
          showValidateMessage('#validation_create-site');
        }
      } else {
        SiteController.add();
      }
    }
  });

  $('#form_update_site').validate({
    focusInvalid: false,
    errorPlacement: function(error, element) {
      validateImage();
      addClassError(element);
    },
    invalidHandler: function() {
      showValidateMessage('#validation_update-site');
    },
    submitHandler: function() {
      var sId = App.DataStore.get("sId");
      if ($(".image").attr('require') == "required") {
        if ($('.image').attr('src') != '') {
          $(".photo").css({"border": "1px solid #f3f3f3"});
          SiteController.updateBySiteIdOffline(sId);
        } else {
          $(".photo").css({"border": "1px solid red"});
          showValidateMessage('#validation_update-site');
        }
      } else {
        SiteController.updateBySiteIdOffline(sId);
      }
    }
  });

  $('#form_update_site_online').validate({
    focusInvalid: false,
    errorPlacement: function(error, element) {
      validateImage();
      addClassError(element);
    },
    invalidHandler: function() {
      showValidateMessage('#validation_update-site-online');
    },
    submitHandler: function() {
      if ($(".image").attr('require') == "required") {
        if ($('.image').attr('src') != '') {
          $(".photo").css({"border": "1px solid #f3f3f3"});
          SiteController.updateBySiteIdOnline();
        } else {
          $(".photo").css({"border": "1px solid red"});
          showValidateMessage('#validation_update-site-online');
        }
      } else {
        SiteController.updateBySiteIdOnline();
      }
    }
  });

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ":hidden:not(select)"
  });
});

function validateToRemoveStyle(element) {
  var $parent = $(element).closest(".ui-select");
  if (element.required && element.value == "") {
    $parent.removeClass('valid').addClass('error');
  }
  else {
    $parent.removeClass('error').addClass('valid');
  }
}

function validateImage() {
  if ($('.image').attr('src') == '' && $(".image").attr('require') == "required") {
    $(".photo").css({"border": "1px solid red"});
  } else {
    $(".photo").css({"border": "1px solid #f3f3f3"});
  }
}

function showValidateMessage(id) {
  $(id).show().delay(4000).fadeOut();
  $(id).focus();
}

function addClassError(element) {
  var $parent = $(element).closest('.ui-select');
  $parent.addClass("error");
}