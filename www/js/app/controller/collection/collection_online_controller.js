var CollectionOnlineController = {
  getByUserId: function (currentUser) {
    CollectionModel.fetch(function (response) {
      var collectionData = [];
      $.each(response, function (key, collection) {
        SiteOffline.countByCollectionIdUserId(collection.id, currentUser.id, function (count) {
          var item = CollectionHelper.dataCollection(collection, currentUser, count, true);
          collectionData.push(item);

          if (key === response.length - 1) {
            CollectionView.displayList({collectionList: collectionData});
            CollectionController.synCollectionForCurrentUser(collectionData);
          }
        });
      });
    });
  },
};