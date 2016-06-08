SessionController = {
  signIn: function (user) {
    UserSession.setUser(user)
  },
  currentUser: function () {
    return UserSession.getUser()
  },
  authUserOnline: function (userParams) {
    var data = {user: userParams};
    hideElement($('#invalidmail'));
    ViewBinding.setBusy(true);

    UserModel.create(App.AUTH_URL, data, function (response) {

      userParams.auth_token = response.auth_token;
      UserOffline.fetchByEmail(userParams.email, function (user) {
        if (user === null){
          user = UserOffline.add(userParams);

        }
        else {
          user.password = userParams.password
          user.auth_token = userParams['auth_token']
          persistence.flush();
        }
        SessionController.signIn(user);
        App.redirectTo("#page-collection-list");
      });
    }, function (response) {
        ViewBinding.setBusy(false);
        showElement($('#invalidmail'));
    });
  },
  authUserOffline: function (userParams) {
    UserOffline.fetchByEmail(userParams.email, function (user) {
      if (user === null) {
        showElement($('#noMailInDb'));
      }
      if (user.password === userParams.password) {
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
  authUser: function (userParams) {
    if (!App.isOnline())
      this.authUserOffline(userParams);
    else
      this.authUserOnline(userParams);
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
    if (App.isOnline()) {
      UserModel.delete(function () {
        SessionController.resetSession()
      });
    }
    else
      SessionController.resetSession()
  },

  resetSession: function(){
    App.Cache.clearAll()
    App.Session.resetState();
    App.redirectTo("#page-login");
  },

  storeSessionLogin: function (userParams) {
    setTimeout(function () {
      if (!App.isOnline())
        SessionController.storeSessionOffline(userParams);
      else
        SessionController.storeSessionOnline(userParams);
    }, 500);
  },
  storeSessionOnline: function (userParams) {
    var data = {user: userParams};

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
  storeSessionOffline: function (userParams) {
    UserOffline.fetchByEmail(userParams.email, function (user) {
      if (user.password === userParams.password) {
        App.redirectTo("#page-collection-list");
      }
    });
  }
};
