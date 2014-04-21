window.App = {
    DB_SIZE: 5 * 1024 * 1024,
    DB_NAME: 'resourcemap_db',
    END_POINT: "http://resmap-stg-ilab.instedd.org",
    AUTH_URL: "http://resmap-stg-ilab.instedd.org/api/users/sign_in.json",
    LIST_COLLECTION: "http://resmap-stg-ilab.instedd.org/api/collections?auth_token=",
    URL_SIGNUP: "http://resmap-stg-ilab.instedd.org/api/users.json",
    URL_LOGOUT: "http://resmap-stg-ilab.instedd.org/api/users/sign_out.json?auth_token=",
    URL_SITE: "http://resmap-stg-ilab.instedd.org/api/v1/collections/",
    URL_FIELD: "http://resmap-stg-ilab.instedd.org/api/collections/",
    DEBUG: true,
    userId: "",
    log: function(obj) {
        if (App.DEBUG)
            console.log(obj);
    },
    initialize: function() {
        this.bindEvents();
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
