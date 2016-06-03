App = {
  DB_SIZE: 5 * 1024 * 1024,
  DB_NAME: 'resourcemap_db',
  END_POINT: RmSetting.END_POINT,
  IMG_PATH: RmSetting.URL + "photo_field/",
  AUTH_URL: RmSetting.END_POINT + "/users/sign_in.json",
  LIST_COLLECTION: RmSetting.END_POINT + "/collections?auth_token=",
  URL_SIGNUP: RmSetting.END_POINT + "/users.json",
  URL_LOGOUT: RmSetting.END_POINT + "/users/sign_out.json?auth_token=",
  URL_FIELD: RmSetting.END_POINT + "/v1/collections/",
  URL_SITE: RmSetting.END_POINT + "/v1/collections/",
  VERSION: "1.3",
  DEBUG: RmSetting.DEBUG,
  userId: "",
  defaultPage: "#page-collection-list",

  log: function (text, data) {
    if (App.DEBUG)
      console.log(text, data);
  },
  initialize: function () {
    this.bindEvents();
    this.setUpConfig()
  },
  setUpConfig: function(){
    persistence.debug = App.DEBUG;
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ":hidden:not(select)"
    });

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
  },
  emptyHTML: function () {
    $(".clearPreviousDisplay").html("");
  },
  checkNodeTargetSuccess: function(node, callback) {
    if(node.tagName.toLowerCase() == 'a' && node.parentNode.tagName.toLowerCase() == 'li')
      callback(node)
  },
  redirectTo: function (nextPage) {
    App.log("Redirect to ", nextPage);
    $.mobile.pageContainer.pagecontainer('change', nextPage);
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

App.initialize();
App.onDeviceReady();
