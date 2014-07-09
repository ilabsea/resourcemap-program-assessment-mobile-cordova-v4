function getCollectionByUserIdOffline() {
  var currentUser = getCurrentUser();
  var collectionData = [];
  Collection.all().filter('user_id', '=', currentUser.id).list(null, function(collections) {
    var asyncTotal = 0;
    collections.forEach(function(collection) {
      SiteModel.countByCollectionId(collection.idcollection(), function(count) {
        var item = dataCollection(collection, currentUser, count, false);
        asyncTotal++;
        collectionData.push(item);

        if (asyncTotal === collections.length) {
          displayCollectionList(collectionData);
        }
      });
    });
  });
}

function getCollectionByUserIdOnline() {
  CollectionModel.fetch(function(response) {
    var collectionData = [];
    $.each(response, function(key, collection) {
      var currentUser = getCurrentUser();
      SiteModel.countByCollectionId(collection.id, function(count) {
        var item = dataCollection(collection, currentUser, count, true);
        collectionData.push(item);

        if (key === response.length - 1) {
          displayCollectionList(collectionData);
          synCollectionForCurrentUser(collectionData);
        }
      });
    });
  });
}

function getCollection() {
  if (!isOnline()) {
    getCollectionByUserIdOffline();
  } else {
    getCollectionByUserIdOnline();
  }
}