$(function(){

  $(document).delegate('#logout', 'click', function() {
    SessionController.logout();
  });
});