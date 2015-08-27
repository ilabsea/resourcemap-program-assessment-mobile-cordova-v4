function createTables() {
  Collection = persistence.define('collections', {
    idcollection: "INT",
    name: "TEXT",
    description: "TEXT",
    user_id: "INT"
  });

  User = persistence.define('users', {
    email: "TEXT",
    password: "TEXT"
  });

  Site = persistence.define('sites', {
    idsite: "INT",
    name: "TEXT",
    lat: "INT",
    lng: "INT",
//    start_entry_date: "TEXT",
//    end_entry_date: "TEXT",
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

  persistence.defineMigration(1, {
    up: function () {
      this.executeSql('DROP TABLE oldSites');
      // rename current table
      this.executeSql('ALTER TABLE sites RENAME TO oldSites');
      // create new table with required columns
      this.executeSql(
          'CREATE TABLE IF NOT EXISTS sites (id VARCHAR(32) PRIMARY KEY, \n\
idsite INT, name TEXT, lat INT, lng INT, created_at DATE, start_entry_date TEXT, \n\
end_entry_date TEXT, collection_id INT, collection_name TEXT, user_id INT, \n\
device_id TEXT,properties JSON, files JSON)');
      // copy contents from old table to new table
      this.executeSql('INSERT INTO sites(id, idsite, name, lat, lng, created_at, \n\
start_entry_date, end_entry_date, collection_id, collection_name, user_id, device_id,\n\
properties , files) SELECT id, idsite, name, lat, lng, created_at, \n\
start_entry_date, end_entry_date, collection_id, collection_name, user_id, device_id,\n\
properties , files FROM oldSites');
      // delete current table
      this.executeSql('DROP TABLE oldSites');
    },
    down: function () {
      this.executeSql('DROP TABLE oldSites');
      this.executeSql('ALTER TABLE sites RENAME TO oldSites');
      this.executeSql(
          'CREATE TABLE sites (id VARCHAR(32) PRIMARY KEY, \n\
idsite INT, name TEXT, lat INT, lng INT, created_at DATE, start_entry_date TEXT, \n\
end_entry_date TEXT, collection_id INT, collection_name TEXT, user_id INT, \n\
device_id TEXT,properties JSON, files JSON)');
      this.executeSql('INSERT INTO sites(id, idsite, name, lat, lng, created_at, \n\
start_entry_date, end_entry_date, collection_id, collection_name, user_id, device_id,\n\
properties , files) SELECT id, idsite, name, lat, lng, created_at, \n\
start_entry_date, end_entry_date, collection_id, collection_name, user_id, device_id,\n\
properties , files FROM oldSites');
      this.executeSql('DROP TABLE oldSites');
    }
  });
  migrate();
}

function migrate() {
  console.log('migrating...');
  persistence.migrations.init(function () {
    console.log('migration init');
    persistence.migrate(function () {
      console.debug('migration complete!');
    });
  });
}
;