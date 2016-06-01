App.initialize();
App.onDeviceReady();
$(function() {
  Translation.setLang(Translation.getLang());
  Translation.renderLang();
  $.mobile.defaultPageTransition = 'none';

  $(document).delegate('#logout', 'click', function() {
    SessionController.logout();
  });
});
