App = App || {};
App.DataStore = {
  set: function(key, value) {
    localStorage.setItem(key, value);
  },
  get: function(key) {
    return localStorage.getItem(key);
  },
  remove: function(key) {
    localStorage.removeItem(key);
  },
  clearAll: function() {
    localStorage.clear();
  },
  clearPartlyAfterCreateSite: function() {
    var sId = App.DataStore.get("sId");
    for (var key in localStorage) {
      if (sId)
        if (key.substring(0, sId.length) == sId)
          localStorage.removeItem(key);
      if (key.substr(0, key.indexOf('_')) == "configSelectManyForSkipLogic")
        localStorage.removeItem(key);
    }
  }
};