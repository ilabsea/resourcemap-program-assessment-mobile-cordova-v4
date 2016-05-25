CollectionController = {
  displayList: function (collectionData) {
    App.Template.process("list.html", collectionData, function (content) {
      $('#collection-list').html(content);
      $('#collection-list').listview("refresh");
    });
  },
  displayName: function (collectionName) {
    App.Template.process("collection/name.html", collectionName, function (content) {
      $('.title').html(content);
    });
  },
  get: function () {
    var currentUser = SessionController.currentUser();
    if (!App.isOnline()) {
      CollectionController.getByUserIdOffline(currentUser);
    } else {
      CollectionController.getByUserIdOnline(currentUser);
    }
  },
  getByUserIdOffline: function (currentUser) {
    CollectionOffline.fetchByUserId(currentUser, function (collections) {
      var collectionData = [];
      var asyncTotal = 0;
      collections.forEach(function (collection) {
        var currentUser = SessionController.currentUser();
        SiteOffline.countByCollectionIdUserId(collection.idcollection(), currentUser.id, function (count) {
          var item = CollectionController.dataCollection(collection, currentUser, count, false);
          asyncTotal++;
          collectionData.push(item);

          if (asyncTotal === collections.length) {
            CollectionController.displayList({collectionList: collectionData});
          }
        });
      });
    });
  },
  getByUserIdOnline: function (currentUser) {
    CollectionModel.fetch(function (collections) {
      var userCollection = {user: currentUser, collections: collections };
      SiteOffline.countSiteOfflineByUserCollections(userCollection, function(result){
        var collectionData = [];
        $.each(collections, function(index, collection){
          var countSiteOffline = result[collection.id] || '';
          var item = CollectionController.dataCollection(collection, currentUser, countSiteOffline, true);
          collectionData.push(item);
          if (index === collections.length - 1) {
            CollectionController.displayList({collectionList: collectionData});
            CollectionController.synCollectionForCurrentUser(collectionData);
          }
        });
      });
    });
  },
  synCollectionForCurrentUser: function (newCollections) {
    var currentUser = SessionController.currentUser();
    CollectionOffline.destroyAllByUserId(currentUser.id, function(){
      CollectionOffline.add(newCollections);
    })

  },
  dataCollection: function (collection, currentUser, count, fromServer) {
    var item = {
      name: collection.name,
      description: collection.description,
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
  }
};
