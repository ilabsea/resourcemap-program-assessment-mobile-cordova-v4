var CollectionOfflineController = {
  getByUserId: function (currentUser) {
    CollectionOffline.fetchByUserId(currentUser, function (collections) {
      var asyncTotal = 0;
      var collectionData = [];
      $.map(collections, function (collection) {
        SiteOffline.countByCollectionId(collection.idcollection(), function (count) {
          var item = CollectionHelper.dataCollection(collection, currentUser, count, false);
          asyncTotal++;
          collectionData.push(item);

          if (asyncTotal === collections.length) {
            CollectionView.displayList({collectionList: collectionData});
          }
        });
      });
    });
  },
  getOne: function (cId) {
    CollectionOffline.fetchOne(cId, function (collection) {
      App.DataStore.set("collection", JSON.stringify(collection));
    });
  }
};