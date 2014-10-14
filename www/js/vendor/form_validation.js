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
    invalidHandler: function(event, validator) {
      showValidateMessage('#validation_email_psd_confirm');
    }
  });

  $('#form_create_site').validate({
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
    invalidHandler: function() {
      showValidateMessage('#validation_create-site');
    },
    submitHandler: function() {
      var classElement = document.getElementsByClassName("image");
      var classHierarchyElement = document.getElementsByClassName("tree");
      var h = true;
      var bImage = true;

      if (classHierarchyElement.length != 0)
        h = validateHierarchySubmitHandler(classHierarchyElement, '#validation_create-site');
      if (classElement.length != 0)
        bImage = validateImageSubmitHandler(classElement, '#validation_create-site');

      if (h && bImage) {
        SiteController.add();
        App.DataStore.clearPartlyAfterCreateSite();
      }
    }
  });

  $('#form_update_site').validate({
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
    invalidHandler: function() {
      showValidateMessage('#validation_update-site');
    },
    submitHandler: function() {
      var classElement = document.getElementsByClassName("image");
      var classHierarchyElement = document.getElementsByClassName("tree");
      var h = true;
      var bImage = true;

      if (classHierarchyElement.length != 0)
        h = validateHierarchySubmitHandler(classHierarchyElement, '#validation_update-site');
      if (classElement.length != 0)
        bImage = validateImageSubmitHandler(classElement, '#validation_update-site', SiteController.updateBySiteIdOffline);
      if (h && bImage){
        SiteController.updateBySiteIdOffline();
        App.DataStore.clearPartlyAfterCreateSite();
      }
    }
  });

  $('#form_update_site_online').validate({
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
    invalidHandler: function() {
      showValidateMessage('#validation_update-site-online');
    },
    submitHandler: function() {
      var classElement = document.getElementsByClassName("image");
      var classHierarchyElement = document.getElementsByClassName("tree");
      var h = true;
      var bImage = true;

      if (classHierarchyElement.length != 0)
        h = validateHierarchySubmitHandler(classHierarchyElement, '#validation_update-site-online');
      if (classElement.length != 0)
        bImage = validateImageSubmitHandler(classElement, '#validation_update-site-online', SiteController.updateBySiteIdOnline);
      if (h && bImage){
        SiteController.updateBySiteIdOnline();
        App.DataStore.clearPartlyAfterCreateSite();
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
  if (element.required) {
    var $parent = $(element).closest(".ui-select");
    if (element.value === "")
      $parent.removeClass('valid').addClass('error');
    else
      $parent.removeClass('error').addClass('valid');
  }
}

function validateImage(idElement) {
  var $element = $("#" + idElement);
  if ($element.attr('require') === "required") {
    if ($element.attr('src') === '') {
      $("#property_" + idElement + "_container").css({"border": "1px solid red"});
    } else {
      $("#property_" + idElement + "_container").css({"border": "1px solid #f3f3f3"});
    }
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

function validateImageSubmitHandler(classElement, element) {
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
  return b;
}

function validateHierarchySubmitHandler(classHierarchyElement, element) {
  var h = true;
  for (i = 0; i < classHierarchyElement.length; i++) {
    var idElement = classHierarchyElement[i].id;
    var $element = $("#" + idElement);
    if ($element.attr('require') == "required") {
      var node = $element.tree('getSelectedNode');
      if (!node.id) {
        $element.css({"border": "1px solid red"});
        showValidateMessage(element);
        h = false;
      } else {
        $element.css({"border": "1px solid #999999"});
      }
    }
  }
  return h;
}