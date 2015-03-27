var SessionOnlineController = {
  authUser: function (email, password) {
    var data = SessionHelper.getUser(email, password);
    ViewBinding.setBusy(true);

    UserModel.create(App.AUTH_URL, data, function (response) {
      App.Session.setAuthToken(response.auth_token);

      UserOffline.fetchByEmail(email, function (user) {
        if (user === null)
          SessionHelper.signIn(UserOffline.add(email, password));
        else {
          if (user.password() !== password) {
            user.password(password);
            persistence.flush();
          }
          SessionHelper.signIn(user);
        }
        App.redirectTo("#page-collection-list");
      });
    }, function (x, t, m) {
      if (t === "timeout" || t === "notmodified") {
        alert("Internet connection problem");
      } else {
        showElement($('#invalidmail'));
      }
    });
  },
  logout: function () {
    UserModel.delete(function () {
      App.Session.resetState();
      App.redirectTo("#page-login");
    });
  },
  storeSession: function (email, password) {
    var data = SessionHelper.getUser(email, password);

    UserModel.create(App.AUTH_URL, data, function () {
      App.redirectTo("#page-collection-list");
    }, function (x, t, m) {
      if (t === "timeout" || t === "notmodified") {
        alert("Internet connection problem");
      }
    });
  }
};