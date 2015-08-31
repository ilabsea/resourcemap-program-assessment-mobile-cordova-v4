SessionController = {
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
  authUser: function (email, password) {
    if (!App.isOnline())
      SessionOfflineController.authUser(email, password);
    else
      SessionOnlineController.authUser(email, password);
  },
  signUp: function (user) {
    var data = {user: user};
    if (user.password === user.password_confirmation) {
      hideElement($("#passmatch"));
      ViewBinding.setBusy(true);

      UserModel.create(App.URL_SIGNUP, data, function () {
        hideElement($("#exitemail"));
        showElement($("#sign_up_success"));
        App.redirectTo("#page-login");
        $('#form_signup')[0].reset();
      }, function () {
        $('#exitemail').show().delay(4000).fadeOut();
        $("#sign_up_success").hide();
        App.redirectTo("#page-signup");
      });
    }
    else
      showElement($("#passmatch"));
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
        SessionOfflineController.storeSession(email, password);
      else
        SessionOnlineController.storeSession(email, password);
    }, 500);
  },
};