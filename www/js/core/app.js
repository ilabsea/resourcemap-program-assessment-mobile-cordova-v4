URL = "http://resmap-stg-ilab.instedd.org/";
END_POINT = URL + "api";
App = {
  DB_SIZE: 5 * 1024 * 1024,
  DB_NAME: 'resourcemap_db',
  END_POINT: END_POINT,
  IMG_PATH: URL + "photo_field/",
  AUTH_URL: END_POINT + "/users/sign_in.json",
  LIST_COLLECTION: END_POINT + "/collections?auth_token=",
  URL_SIGNUP: END_POINT + "/users.json",
  URL_LOGOUT: END_POINT + "/users/sign_out.json?auth_token=",
  URL_FIELD: END_POINT + "/v1/collections/",
  URL_SITE: END_POINT + "/v1/collections/",
  DEBUG: true,
  userId: "",
  log: function(text, data) {
    if (App.DEBUG)
      console.log(text, data);
  },
  initialize: function() {
    this.bindEvents();
    this.setUp();
  },
  resetDb: function() {
    persistence.reset();
    persistence.schemaSync();
  },
  resetCache: function() {
    App.Cache.clearAll();
  },
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  onDeviceReady: function() {
    connectionDB(App.DB_NAME, App.DB_SIZE);
    createTables();
  },
  emptyHTML: function() {
    $(".clearPreviousDisplay").html("");
  },
  setUp: function() {
    $.ajaxSetup({
      complete: function() {
        ViewBinding.setBusy(false);
      }
    });
  },
  redirectTo: function(url) {
    $.mobile.changePage(url);
  },
  isOnline: function() {
    var online = false;
    if (navigator.connection) {
      online = (navigator.connection.type != Connection.NONE);
      return online;
    }
    online = navigator.onLine;
    return online;
  }
};

function kernel() {
  window.isOnline = App.isOnline;
}

kernel();