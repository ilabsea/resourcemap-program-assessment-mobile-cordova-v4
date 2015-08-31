CollectionController = {
  get: function () {
    var currentUser = SessionController.currentUser();
    if (!App.isOnline()) {
      CollectionOfflineController.getByUserId(currentUser);
    } else {
      CollectionOnlineController.getByUserId(currentUser);
    }
  },
  synCollectionForCurrentUser: function (newCollections) {
    var currentUser = SessionController.currentUser();
    CollectionOffline.fetchByUserId(currentUser, function (collections) {
      CollectionOffline.remove(collections);
      CollectionOffline.add(newCollections);
    });
  },
};