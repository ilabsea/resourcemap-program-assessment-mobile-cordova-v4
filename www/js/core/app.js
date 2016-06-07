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
  dbConnected: false,
  defaultPage: "#page-collection-list",

  log: function (text, data) {
    if (App.DEBUG)
      console.log(text, data);
  },
  initialize: function () {
    this.bindEvents();
    this.setUpConfig();
    //for mobile web testing without platform
    if(typeof cordova == "undefined" )
      App.onDeviceReady();
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
    if(App.dbConnected) {
      persistence.reset();
      persistence.schemaSync();
    }
    else {
      App.log("Db connection is not ready");
    }
  },
  resetCache: function () {
    App.Cache.clearAll();
  },
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  validateDbConnection: function(callbackAction) {
    if(App.dbConnected)
      callbackAction()
    else {
      App.connectDB(App.DB_NAME, App.DB_SIZE);
      callbackAction();
    }
  },

  onDeviceReady: function () {
    App.connectDB(App.DB_NAME, App.DB_SIZE);
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
  },

  connectDB: function(dbName, size) {
    if (window.openDatabase || window.sqlitePlugin)
      persistence.store.websql.config(persistence, dbName, 'database', size);
    else
      alert("Your device must support a database connection");

    App.defineSchema()
    persistence.schemaSync();
    App.dbConnected = true
  },
  defineSchema: function(){
    Collection = persistence.define('collections', {
      idcollection: "INT",
      name: "TEXT",
      description: "TEXT",
      user_id: "INT"
    });

    User = persistence.define('users', {
      email: "TEXT",
      password: "TEXT",
      auth_token: "TEXT"
    });

    Site = persistence.define('sites', {
      idsite: "INT",
      name: "TEXT",
      lat: "INT",
      lng: "INT",
      start_entry_date: "TEXT",
      end_entry_date: "TEXT",
      created_at: "DATE",
      collection_id: "INT",
      collection_name: "TEXT",
      user_id: "INT",
      device_id: "TEXT",
      properties: "JSON",
      files: "JSON"
    });

    Field = persistence.define('fields', {
      collection_id: "INT",
      user_id: "INT",
      name_wrapper: "TEXT",
      id_wrapper: "INT",
      fields: "JSON"
    });
  }
};

App.initialize();
