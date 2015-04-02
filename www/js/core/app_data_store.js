App = App || {};
App.DataStore = {
  set: function (key, value) {
    localStorage.setItem(key, value);
  },
  get: function (key) {
    return localStorage.getItem(key);
  },
  remove: function (key) {
    localStorage.removeItem(key);
  },
  clearAll: function () {
    localStorage.clear();
  },
  clearPartlyAfterCreateSite: function () {
    var sId = App.DataStore.get("sId");
    for (var key in localStorage) {
      if (sId)
        if (key.substring(0, sId.length) == sId)
          localStorage.removeItem(key);
    }
  },
  clearConfig: function (prefix) {
    for (var key in localStorage) {
      if (key.substr(0, key.indexOf('_')) === prefix)
        localStorage.removeItem(key);
    }
  },
  clearAllSiteFormData: function () {
    App.DataStore.clearConfig("configNumberSkipLogic");
    App.DataStore.clearConfig("configNumber");
    App.DataStore.clearConfig("configSelectManyForSkipLogic");
    App.DataStore.clearConfig("configLocations");
    App.DataStore.remove("field_id_arr");
    App.DataStore.remove("location_fields_id");
  }
};