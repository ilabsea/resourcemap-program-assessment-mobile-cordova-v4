App = App || {};
App.DataStore = {
  set: function (key, value) {
    localStorage.setItem(key, value);
  },
  get: function (key) {
    return localStorage.getItem(key);
  },

  setObject: function(key, value){
    var serialized = JSON.stringify(value)
    this.set(key, serialized)
  },

  getObject: function(key){
    var serialized = this.get(key)
    return JSON.parse(serialized)
  },

  remove: function (key) {
    localStorage.removeItem(key);
  },

  clearAll: function () {
    localStorage.clear();
  }
  
};
