var SessionHelper = {
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
  }
};