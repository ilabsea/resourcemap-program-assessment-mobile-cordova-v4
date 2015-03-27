CollectionController = {
  get: function() {
    var currentUser = SessionHelper.currentUser();
    if (!App.isOnline()) {
      CollectionController.getByUserIdOffline(currentUser);
    } else {
      CollectionController.getByUserIdOnline(currentUser);
    }
  },
  getByUserIdOffline: function(currentUser) {
    CollectionOffline.fetchByUserId(currentUser, function(collections) {
      var asyncTotal = 0;
      var collectionData = [];
      $.map(collections, function(collection) {
        SiteOffline.countByCollectionId(collection.idcollection(), function(count) {
          var item = CollectionController.dataCollection(collection, currentUser, count, false);
          asyncTotal++;
          collectionData.push(item);

          if (asyncTotal === collections.length) {
            CollectionView.displayList({collectionList: collectionData});
          }
        });
      });
    });
  },
  getByUserIdOnline: function(currentUser) {
    CollectionModel.fetch(function(collections) {
      var collectionData = [];
      $.each(collections, function(key, collection) {
        SiteOffline.countByCollectionId(collection.id, function(count) {
          var item = CollectionController.dataCollection(collection, currentUser, count, true);
          collectionData.push(item);

          if (key === collections.length - 1) {
            CollectionView.displayList({collectionList: collectionData});
            CollectionController.synCollectionForCurrentUser(collectionData);
          }
        });
      });
    });
  },
  synCollectionForCurrentUser: function(newCollections) {
    var currentUser = SessionHelper.currentUser();
    CollectionOffline.fetchByUserId(currentUser, function(collections) {
      CollectionOffline.remove(collections);
      CollectionOffline.add(newCollections);
    });
  },
  dataCollection: function(collection, currentUser, count, fromServer) {
    var item = {
      name: collection.name,
      description: collection.description,
      is_visible_location: collection.is_visible_location,
      is_visible_name: collection.is_visible_name,
      user_id: currentUser.id,
      linkpagesite: "#page-site-list"
    };
    if (fromServer)
      item.idcollection = collection.id;
    else
      item.idcollection = collection.idcollection;

    if (count == 0)
      item.displayCount = "";
    else
      item.displayCount = count;

    return item;
  },
  getOne: function(cId) {
    if (App.isOnline()) {
      CollectionModel.fetchOne(function(collection) {
        App.DataStore.set("collection", JSON.stringify(collection));
      });
    } else {
      CollectionOffline.fetchOne(cId, function(collection) {
        App.DataStore.set("collection", JSON.stringify(collection));
      });
    }
  }
};