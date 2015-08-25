persistence.defineMigration(2, {
  up: function() {
    this.addColumn('Site', 'start_entry_date', 'DATE');
    this.addColumn('Site', 'end_entry_date', 'DATE');
    this.action(function(tx, nextAction){
      Site.all().list(tx, function(sites){
        sites.forEach(function(site){
          site.start_entry_date = "";
          site.end_entry_date = "";
          persistence.add(site);
        });
        persistence.flush(tx, function() {
          nextAction();
        });
      });
    });
  }
});

function migrate(  ){
    console.log('migrating...');
    persistence.migrations.init( function(){
        console.log('migration init');
        persistence.migrate( function(){
            console.debug('migration complete!');
        } );
    });
};