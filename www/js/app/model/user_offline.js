UserOffline = {
  add: function(userParams) {
    user = new User(userParams);
    persistence.add(user);
    var user = persistence.flush()
    return user;

  },
  fetchByEmail: function(email, callback) {
    User.all().filter('email', "=", email).one(null, callback);
  }
};
