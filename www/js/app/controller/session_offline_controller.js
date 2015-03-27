var SessionOfflineController = {
  authUser: function (email, password) {
    UserOffline.fetchByEmail(email, function (user) {
      if (user === null) {
        showElement($('#noMailInDb'));
      }
      if (user.password() === password) {
        SessionHelper.signIn(user);
        App.redirectTo("#page-collection-list");
      }
      else {
        showElement($('#invalidmail'));
      }
      hideElement($('#noMailInDb'));
      hideElement($('#invalidmail'));
    });
  },
  logout: function () {
    App.Session.resetState();
    App.redirectTo("#page-login");
  },
  storeSession: function (email, password) {
    UserOffline.fetchByEmail(email, function (user) {
      if (user.password() === password) {
        App.redirectTo("#page-collection-list");
      }
    });
  }
};