CollectionOffline = {
  add: function(collections) {
    $.map(collections, function(collection) {
      var collectionParams = {
        idcollection: collection.idcollection,
        name: collection.name,
        description: collection.description,
        is_visible_location: collection.is_visible_location,
        is_visible_name: collection.is_visible_name,
        user_id: collection.user_id
      };
      var collectionObj = new Collection(collectionParams);
      persistence.add(collectionObj);
    });
    persistence.flush();
  },
  remove: function(collections) {
    collections.forEach(function(collection) {
      persistence.remove(collection);
    });
    persistence.flush();
  },
  fetchByUserId: function(user, callback) {
    Collection.all().filter('user_id', '=', user.id).list(null, callback);
  },
  fetchOne: function(cId, callback) {
    Collection.all().filter('idcollection', "=", cId).one(callback);
  }
};