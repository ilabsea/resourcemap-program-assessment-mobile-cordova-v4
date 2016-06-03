$(document).on("mobileinit", function() {
  $(document).delegate('#page-login', 'pagebeforeshow', function() {
    if(UserSession.isLoggedIn())
      App.redirectTo(App.defaultPage)
  });
})

$(function() {

  $(document).delegate('.logout', 'click', function() {
    SessionController.logout();
  });

  $('#form_login').validate({
    focusInvalid: false,
    errorPlacement: function () {
    },
    invalidHandler: function () {
      showValidateMessage('#validation_email_psd');
    },
    submitHandler: function () {
      var userParams = {email: $("#email").val(), password: $("#password").val()};
      SessionController.authUser(userParams);
    }
  });

  Translation.setLang(Translation.getLang());
  Translation.renderLang();

});
