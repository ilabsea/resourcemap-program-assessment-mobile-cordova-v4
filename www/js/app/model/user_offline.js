UserOffline = {
  add: function(userParams) {
    var user = new User(userParams);
    persistence.add(user);
    persistence.flush()
    return user;

  },
  fetchByEmail: function(email, callback) {
    User.all().filter('email', "=", email).one(null, callback);
  }
};
