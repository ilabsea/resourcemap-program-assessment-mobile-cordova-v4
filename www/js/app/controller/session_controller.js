SessionController = {
  authUser: function (email, password) {
    if (!App.isOnline())
      SessionOfflineController.authUser(email, password);
    else
      SessionOnlineController.authUser(email, password);
  },
  logout: function () {
    $('#form_login')[0].reset();
    if (!App.isOnline())
      SessionOfflineController.logout();
    else
      SessionOnlineController.logout();
  },
  storeSessionLogin: function (email, password) {
    setTimeout(function () {
      var isOnline = App.isOnline();
      if (!isOnline)
        SessionOfflineController.storeSession(email, password);
      else
        SessionOnlineController.storeSession(email, password);
    }, 500);
  }
};