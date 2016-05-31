CollectionController = {
  displayList: function (collectionData) {
    App.Template.process("collection_list", collectionData, function (content) {
      var $updateNode = $("#collection-list");
      $updateNode.html(content);
      $updateNode.listview("refresh");
    });
  },
  displayName: function (collectionName) {
    App.Template.process("collection_name", collectionName, function (content) {
      $('.title').html(content);
    });
  },
  renderList: function () {
    App.isOnline() ? CollectionController.getByUserIdOnline() : CollectionController.getByUserIdOffline();
  },

  // countByUser: function (userId) {
  //   var userId = UserSession.getUser().id;
  //   SiteOffline.countByUserId(userId, function (count) {
  //     if (count == 0) {
  //       $('#btn_viewOfflineSite').hide();
  //     } else {
  //       $('#btn_viewOfflineSite').show();
  //     }
  //   });
  // },

  getByUserIdOffline: function () {
    CollectionOffline.fetchByUser(function (collections) {
      CollectionController.renderCollectionListByUser(collections)
    });
  },
  getByUserIdOnline: function () {
    CollectionModel.fetch(function (collections) {
      CollectionController.renderCollectionListByUser(collections);
      CollectionController.synCollectionByUser(collections);
    });
  },

  renderCollectionListByUser: function(collections) {

    var collectionIds = $.map(collections, function(collection){
      return CollectionController.collectionId(collection)
    })
    var userId = UserSession.getUser().id;
    var options = {userId: userId, collectionIds: collectionIds}

    SiteOffline.countSiteOfflineByUserCollections(options, function(result){
      var collectionDatas = [];

      for(var i=0; i<collections.length; i++){
        var collection = collections[i]
        var collectionId = CollectionController.collectionId(collection)
        var countSiteOffline = result[collectionId] || '';
        var collectionData = CollectionController.prepareCollection(collection, userId, countSiteOffline);
        collectionDatas.push(collectionData);

        if (i === collections.length - 1) {
          CollectionController.displayList({collectionList: collectionDatas});
        }
      }
    });
  },

  collectionId: function(collection) {
    return collection.idcollection || collection.id
  },


  synCollectionByUser: function (newCollections) {
    CollectionOffline.destroyAllByUser(function(){
      CollectionOffline.add(newCollections);
    })

  },
  prepareCollection: function (collection, userId, count) {
    var item = {
      name: collection.name,
      description: collection.description,
      user_id: userId,
      linkpagesite: "#page-site-list"
    };
    item.idcollection = collection.idcollection || collection.id;
    item.displayCount = (count == 0) ?  "" : count;
    return item;
  }
};
