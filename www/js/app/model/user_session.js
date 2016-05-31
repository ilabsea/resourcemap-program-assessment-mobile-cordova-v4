UserSession = {
  setUser: function(user){
     App.Session.setUser(user);
  },
  getUser: function(){
    return App.Session.getUser()
  },

  clearUser: function(){
    App.Session.clearUser()
  }
}
