var UserOffline = {
  __email: "",
  password: "",
  set: function(email, password){
    this.__email = email;
    this.password = password;
  },
  add: function (email, password) {
    userParams = {
      email: email,
      password: password
    };
    user = new User(userParams);
    persistence.add(user);
    persistence.flush();
    return user;
  },
  fetchByEmail: function (email, callback) {
    User.all().filter('email', "=", email).one(null, callback);
  }
};