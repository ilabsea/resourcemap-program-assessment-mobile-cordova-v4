$(function(){
  $('#form_signup').validate({
    focusInvalid: false,
    errorPlacement: function () {
    },
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
      showValidateMessage('#validation_email_psd_confirm');
    }
  });
})
