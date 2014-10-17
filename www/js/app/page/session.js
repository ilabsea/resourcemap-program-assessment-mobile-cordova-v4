App.initialize();
App.onDeviceReady();
$(function() {
  FastClick.attach(document.body);
  Translation.setLang(Translation.getLang());
  Translation.renderLang();

  $(document).delegate('#logout', 'click', function() {
    SessionController.logout();
  });
});