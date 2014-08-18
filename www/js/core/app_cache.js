App = App || {};
App.Cache = {
  get: function(template) {
    return App.DataStore.get(template);
  },
  set: function(templateURL, content) {
    App.DataStore.set(templateURL, content);
  },
  clearAll: function() {
    App.DataStore.clearAll();
  }
}