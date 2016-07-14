function connectionDB(dbName, size) {
  if (window.openDatabase || window.sqlitePlugin) {
    persistence.store.websql.config(persistence, dbName, 'database', size);
  }
  else
    alert("Your device must support a database connection");
  persistence.schemaSync();
}
