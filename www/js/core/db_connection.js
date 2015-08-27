function connectionDB(dbName, size) {
  if (window.openDatabase || window.sqlitePlugin) {
    persistence.store.websql.config(persistence, dbName, '0.0.2' , 'database', size);
  }
  else
    alert("Your device must support a database connection");
  persistence.schemaSync();
}