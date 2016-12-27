UserSession = {
  setUser: function(user){
     App.Session.setUser(user);
  },
  getUser: function(){
    return App.Session.getUser()
  },

  isLoggedIn: function() {
    return UserSession.getAuthToken()
  },

  getAuthToken: function() {
    return App.Session.getAuthToken()
  },

  clearUser: function(){
    App.Session.clearUser()
  }
}
