var CollectionOfflineController = {
  getByUserId: function (currentUser) {
    CollectionOffline.fetchByUserId(currentUser, function (collections) {
      var collectionData = [];
      var asyncTotal = 0;
      collections.forEach(function (collection) {
        var currentUser = SessionController.currentUser();
        SiteOffline.countByCollectionIdUserId(collection.idcollection(), currentUser.id, function (count) {
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
};