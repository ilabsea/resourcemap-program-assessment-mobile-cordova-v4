SessionController = {
  signIn: function(user) {
    var currentUser = {id: user.id, password: user.password(), email: user.email()};
    App.DataStore.set("currentUser", JSON.stringify(currentUser));
  },
  currentUser: function() {
    var u = App.DataStore.get("currentUser");
    if (u)
      return JSON.parse(u);
    return {};
  },
  authUserOnline: function(email, password) {
    var data = {user: {email: email, password: password}};
    hideElement($('#invalidmail'));
    ViewBinding.setBusy(true);

    UserModel.create(App.AUTH_URL, data, function(response) {
      App.Session.setAuthToken(response.auth_token);

      UserOffline.fetchByEmail(email, function(user) {
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
    }, function() {
      showElement($('#invalidmail'));
    });
  },
  authUserOffline: function(email, password) {
    UserOffline.fetchByEmail(email, function(user) {
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
  authUser: function(email, password) {
    if (!isOnline())
      this.authUserOffline(email, password);
    else
      this.authUserOnline(email, password);
  },
  signUp: function(user) {
    var data = {user: user};
    if (user.password === user.password_confirmation) {
      hideElement($("#passmatch"));
      ViewBinding.setBusy(true);

      UserModel.create(App.URL_SIGNUP, data, function() {
        hideElement($("#exitemail"));
        showElement($("#sign_up_success"));
        App.redirectTo("#page-login");
        $('#form_signup')[0].reset();
      }, function() {
        $('#exitemail').show().delay(4000).fadeOut();
        $("#sign_up_success").hide();
        App.redirectTo("#page-signup");
      });
    }
    else
      showElement($("#passmatch"));
  },
  logout: function() {
    $('#form_login')[0].reset();
    if (!isOnline()) {
      App.Session.resetState();
      App.redirectTo("#page-login");
    }
    else {
      UserModel.delete(function() {
        App.Session.resetState();
        App.redirectTo("#page-login");
      });
    }
  }
};