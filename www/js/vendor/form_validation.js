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
      var classElement = document.getElementsByClassName("image");
      if (classElement.length != 0)
        validateImageSubmitHandler(classElement, '#validation_create-site', SiteController.add);
      else
        SiteController.add();
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
      var classElement = document.getElementsByClassName("image");
      if (classElement.length != 0)
        validateImageSubmitHandler(classElement, '#validation_update-site', SiteController.updateBySiteIdOffline);
      else
        SiteController.updateBySiteIdOffline();
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
      var classElement = document.getElementsByClassName("image");
      if (classElement.length != 0)
        validateImageSubmitHandler(classElement, '#validation_update-site-online', SiteController.updateBySiteIdOnline);
      else
        SiteController.updateBySiteIdOnline();
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

function validateImageSubmitHandler(classElement, element, callback) {
  var b = true;
  for (i = 0; i < classElement.length; i++) {
    var idElement = classElement[i].id;
    var $element = $("#" + idElement);
    if ($element.attr('require') == "required") {
      if ($element.attr('src') != '') {
        $("#property_" + idElement + "_container").css({"border": "1px solid #f3f3f3"});
      } else {
        b = false;
        $("#property_" + idElement + "_container").css({"border": "1px solid red"});
        showValidateMessage(element);
      }
    }
  }
  if (b)
    callback();
}