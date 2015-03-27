SessionController = {
  getUser: function (email, password) {
    return {user: {email: email, password: password}};
  },
  signIn: function (user) {
    var currentUser = {id: user.id, password: user.password(), email: user.email()};
    App.DataStore.set("currentUser", JSON.stringify(currentUser));
  },
  currentUser: function () {
    var u = App.DataStore.get("currentUser");
    if (u)
      return JSON.parse(u);
    return {};
  },
  authUserOnline: function (email, password) {
    var data = SessionController.getUser(email, password);
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
  authUserOffline: function (email, password) {
    UserOffline.fetchByEmail(email, function (user) {
      if (user === null) {
        showElement($('#noMailInDb'));
      }
      if (user.password() === password) {
        SessionController.signIn(user);
        App.redirectTo("#page-collection-list");
      }
      else {
        showElement($('#invalidmail'));
      }
      hideElement($('#noMailInDb'));
      hideElement($('#invalidmail'));
    });
  },
  authUser: function (email, password) {
    if (!App.isOnline())
      SessionController.authUserOffline(email, password);
    else
      SessionController.authUserOnline(email, password);
  },
  logout: function () {
    $('#form_login')[0].reset();
    if (!App.isOnline()) {
      App.Session.resetState();
      App.redirectTo("#page-login");
    }
    else {
      UserModel.delete(function () {
        App.Session.resetState();
        App.redirectTo("#page-login");
      });
    }
  },
  storeSessionLogin: function (email, password) {
    var isOnline;
    setTimeout(function () {
      isOnline = App.isOnline();
      if (!isOnline)
        SessionController.storeSessionOffline(email, password);
      else
        SessionController.storeSessionOnline(email, password);
    }, 500);
  },
  storeSessionOnline: function (email, password) {
    var data = {user: {email: email, password: password}};

    UserModel.create(App.AUTH_URL, data, function () {
      App.redirectTo("#page-collection-list");
    }, function (x, t, m) {
      if (t === "timeout" || t === "notmodified") {
        alert("Internet connection problem");
      }
    });
  },
  storeSessionOffline: function (email, password) {
    UserOffline.fetchByEmail(email, function (user) {
      if (user.password() === password) {
        App.redirectTo("#page-collection-list");
      }
    });
  }
};