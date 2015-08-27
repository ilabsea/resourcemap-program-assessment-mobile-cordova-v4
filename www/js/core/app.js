URL = "http://www.cam-monitoring.info:8080/";
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
  VERSION: "1.3",
  DEBUG: true,
  userId: "",
  log: function (text, data) {
    if (App.DEBUG)
      console.log(text, data);
  },
  initialize: function () {
    this.bindEvents();
    this.setUp();
  },
  resetDb: function () {
    persistence.reset();
    persistence.schemaSync();
  },
  resetCache: function () {
    App.Cache.clearAll();
  },
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  onDeviceReady: function () {
    connectionDB(App.DB_NAME, App.DB_SIZE);
    createTables();
    App.Cache.clearTemplate();
    FastClick.attach(document.body);
    App.initialPage();
  },
  initialPage: function () {
    var currentUser = JSON.parse(App.DataStore.get("currentUser"));
    if (currentUser) {
      var email = currentUser.email;
      var password = currentUser.password;
      $("#page-initial").prependTo("body");
      Spinner.spinner();
      SessionController.storeSessionLogin(email, password);
    }
  },
  emptyHTML: function () {
    $(".clearPreviousDisplay").html("");
  },
  setUp: function () {
    $.ajaxSetup({
      complete: function () {
        ViewBinding.setBusy(false);
      },
      timeout: 120000
    });
  },
  redirectTo: function (url) {
    $.mobile.changePage(url);
  },
  isOnline: function () {
    var online = false;
    if (navigator.connection) {
      online = (navigator.connection.type !== Connection.NONE);
      return online;
    }
    online = navigator.onLine;
    return online;
  },
  allBooleanTrue: function (arr) {
    for (var i in arr)
      if (!arr[i])
        return false;
    return true;
  }
};
