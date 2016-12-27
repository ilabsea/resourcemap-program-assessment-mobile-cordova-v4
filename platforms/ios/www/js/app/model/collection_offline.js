CollectionOffline = {
  add: function (collections) {
    for(var i=0; i<collections.length; i++){
      var collectionParams = {
        idcollection: collections[i].id,
        name: collections[i].name,
        description: collections[i].description,
        user_id:  UserSession.getUser().id
      };
      var collectionObj = new Collection(collectionParams);
      persistence.add(collectionObj);
    }
    persistence.flush();
  },
  remove: function (collections) {
    collections.forEach(function (collection) {
      persistence.remove(collection);
    });
    persistence.flush();
  },
  fetchByUser: function (callback) {
    Collection.all().filter('user_id', '=', UserSession.getUser().id).list(null, callback);
  },
  destroyAllByUser: function(callback) {
    Collection.all().filter('user_id', '=', UserSession.getUser().id)
                    .destroyAll(null, callback);
  }
};
