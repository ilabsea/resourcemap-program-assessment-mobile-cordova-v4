END_POINT = "http://resourcemap-sea.instedd.org/api",
        window.App = {
          DB_SIZE: 5 * 1024 * 1024,
          DB_NAME: 'resourcemap_db',
          END_POINT: END_POINT,
          AUTH_URL: END_POINT + "/users/sign_in.json",
          LIST_COLLECTION: END_POINT + "/collections?auth_token=",
          URL_SIGNUP: END_POINT + "/users.json",
          URL_LOGOUT: END_POINT + "/users/sign_out.json?auth_token=",
          URL_FIELD: END_POINT + "/collections/",
          URL_SITE: END_POINT + "/v1/collections/",
          DEBUG: true,
          userId: "",
          log: function(obj) {
            if (App.DEBUG)
              console.log(obj);
          },
          initialize: function() {
            this.bindEvents();
          },
          resetDb: function() {
            persistence.reset();
            persistence.schemaSync();
          },
          bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
          },
          onDeviceReady: function() {
            App.receivedEvent('deviceready');
            connectionDB(App.DB_NAME, App.DB_SIZE);
            createTables();
          },
          receivedEvent: function(id) {
            console.log('Received Event: ' + id);
          }
        };