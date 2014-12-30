CollectionModel = {
  fetch: function(successCallback) {
    $.ajax({
      type: "get",
      url: App.LIST_COLLECTION + App.Session.getAuthToken(),
      dataType: "json",
      success: successCallback
    });
  }
};

CollectionOffline = {
  add: function(collections) {
    $.map(collections, function(collection) {
      var collectionParams = {
        idcollection: collection.idcollection,
        name: collection.name,
        description: collection.description,
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
  }
};