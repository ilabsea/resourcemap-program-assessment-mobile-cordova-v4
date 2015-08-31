var CollectionOfflineController = {
  getByUserId: function (currentUser) {
    CollectionOffline.fetchByUserId(currentUser, function (collections) {
      var collectionData = [];
      var asyncTotal = 0;
      collections.forEach(function (collection) {
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
  }
};