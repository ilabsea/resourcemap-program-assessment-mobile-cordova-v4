function connectionDB(dbName, size) {
    if (window.openDatabase || window.sqlitePlugin) {
        persistence.store.websql.config(persistence, dbName, 'database', size);
        if (window.sqlitePlugin)
            App.log("Db Engine is Sqlite");
        else
            App.log("Db engine is Websql");
    }
    else
        alert("Your device must support a database connection");
//  persistence.reset();
    persistence.schemaSync();
}

 function isOnline(){
    var online = false;
    if(navigator.network && navigator.network.connection) {
        online = ( navigator.network.connection.type !== Connection.NONE );
        return online;
    }
    online = navigator.onLine;
    return online;
 }