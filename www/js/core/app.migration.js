persistence.defineMigration(1, {
  up: function() {
    this.createTable('layer_memberships', function(t){
      t.integer('collection_id');
      t.integer('user_id');
      t.integer('user_offline_id');
      t.integer('layer_id');
      t.boolean('read');
      t.boolean('write');
    });
  },
  down: function() {
    this.dropTable('layer_memberships');
  }
});

persistence.defineMigration(2, {
  up: function() {
    this.createTable('memberships', function(t){
      t.integer('collection_id');
      t.integer('user_id');
      t.text('user_email');
      t.boolean('admin');
      t.boolean('can_edit_other');
      t.boolean('can_view_other');
    });
  },
  down: function() {
    this.dropTable('memberships');
  }
});

persistence.defineMigration(3, {
  up: function() {
    this.createTable('site_memberships', function(t){
      t.integer('user_id');
      t.integer('collection_id');
      t.integer('site_id');
      t.boolean('none');
      t.boolean('read');
      t.boolean('write');
    });
  },
  down: function() {
    this.dropTable('site_memberships');
  }
});

function migrate(){
    console.log('migrating...');
    persistence.migrations.init( function(){
        console.log('migration init');
        // this should migrate up to the latest version, in our case: 2
        persistence.migrate( function(){
            console.log('migration complete!');
        } );
    });
}
