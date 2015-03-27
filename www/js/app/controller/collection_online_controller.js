var CollectionOnlineController = {
  getByUserId: function (currentUser) {
    CollectionModel.fetch(function (collections) {
      var collectionData = [];
      $.each(collections, function (key, collection) {
        SiteOffline.countByCollectionId(collection.id, function (count) {
          var item = CollectionHelper.dataCollection(collection, currentUser, count, true);
          collectionData.push(item);

          if (key === collections.length - 1) {
            CollectionView.displayList({collectionList: collectionData});
            CollectionController.synCollectionForCurrentUser(collectionData);
          }
        });
      });
    });
  },
  getOne: function () {
    CollectionModel.fetchOne(function (collection) {
      App.DataStore.set("collection", JSON.stringify(collection));
    });
  }
};