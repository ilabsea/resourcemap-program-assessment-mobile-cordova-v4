function migrationDefine() {
  persistence.defineMigration(1, {
    up: function () {
      this.addColumn('sites', 'start_entry_date', 'TEXT');
      this.addColumn('sites', 'end_entry_date', 'TEXT');
    },
    down: function () {
      this.removeColumn('sites', 'start_entry_date', 'TEXT');
      this.removeColumn('sites', 'end_entry_date', 'TEXT');
    }
  });
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

