function connectionDB(dbName, size) {
  if (window.openDatabase || window.sqlitePlugin) {
    persistence.store.websql.config(persistence, dbName, 'database', size);
  }
  else
    alert("Your device must support a database connection");
//    persistence.reset();
  persistence.schemaSync();
}

function isOnline() {
  var online = false;
  if (navigator.connection) {
    online = (navigator.connection.type != Connection.NONE);
    return online;
  }
  online = navigator.onLine;
  return online;
}