App = App || {};
App.Session = {
  setUser: function(user){
    App.DataStore.set("currentUser", JSON.stringify(user));
  },

  getUser: function(){
    var u = App.DataStore.get("currentUser");
    if (u)
      return JSON.parse(u);
    return {};
  },

  clearUser: function(){
    App.DataStore.remove("currentUser")
  },

  setAuthToken: function(authToken) {
    App.DataStore.set("authToken", authToken);
  },
  getAuthToken: function() {
    return App.DataStore.get("authToken");
  },
  create: function(user) {
    var currentUser = {id: user.id, password: user.password, email: user.email};
    App.DataStore.set("currentUser", JSON.stringify(currentUser));
  },

  resetState: function() {
    App.DataStore.remove("currentUser");

    App.DataStore.remove("authToken");
    App.DataStore.remove("cId");
    App.DataStore.remove("collectionName");
    App.DataStore.remove("field_id_arr");
    App.DataStore.remove("sId");
    App.DataStore.remove("location_fields_id");
  }
};
