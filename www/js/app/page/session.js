App.initialize();
App.onDeviceReady();
$(function() {
  FastClick.attach(document.body);
  Translation.setLang(Translation.getLang());
  Translation.renderLang();
  $.mobile.defaultPageTransition = 'none';  

  $(document).delegate('#logout', 'click', function() {
    SessionController.logout();
  });
  
  $(document).delegate('#page-signup', 'pagebeforehide', function() {
    ValidationHelper.resetFormValidate("#form_signup");
  });
  
  $(document).delegate('#page-login', 'pagebeforehide', function() {
    ValidationHelper.resetFormValidate("#form_login");
  });
 
});