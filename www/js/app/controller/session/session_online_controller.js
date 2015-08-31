var SessionOnlineController = {
  authUser: function (email, password) {
    var data = {user: {email: email, password: password}};
    hideElement($('#invalidmail'));
    ViewBinding.setBusy(true);

    UserModel.create(App.AUTH_URL, data, function (response) {
      App.Session.setAuthToken(response.auth_token);

      UserOffline.fetchByEmail(email, function (user) {
        if (user === null)
          SessionController.signIn(UserOffline.add(email, password));
        else {
          if (user.password() !== password) {
            user.password(password);
            persistence.flush();
          }
          SessionController.signIn(user);
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
  storeSession: function (email, password) {
    var data = {user: {email: email, password: password}};

    UserModel.create(App.AUTH_URL, data, function () {
      App.redirectTo("#page-collection-list");
    }, function (x, t, m) {
      if (!x.responseJSON.success){
        App.redirectTo("#page-login");
      }
      if (t === "timeout" || t === "notmodified") {
        alert("Internet connection problem");
      }
    });
  },
};