function addCollectionsToLocalDB(collections) {
  $.each(collections, function(index, collection) {
    var collectionParams = {
      idcollection: collection.idcollection,
      name: collection.name,
      description: collection.description,
      user_id: collection.user_id
    };
    var collectionObj = new Collection(collectionParams);
    persistence.add(collectionObj);
  });
  persistence.flush();
}

function removeCollectionsToLocalDB(collections) {
  collections.forEach(function(collection) {
    persistence.remove(collection);
  });
  persistence.flush();
}

function dataCollection(collection, currentUser, count, fromServer) {
  var item = {
    name: collection.name,
    description: collection.description,
    user_id: currentUser.id
  };
  if (fromServer) {
    item.idcollection = collection.id;
  }
  else {
    item.idcollection = collection.idcollection;
    $("#nav_site_online").addClass('ui-disabled');
  }

  if (count == 0) {
    item.displayCount = "";
    item.linkpagesite = "#page-create-site";
  } else {
    item.displayCount = count;
    item.linkpagesite = "#page-site-list";
  }
//  if (count == 0 && countOnline == 0) {
//    item.displayCount = "";
//    item.linkpagesite = "#page-create-site";
//  }
//  else if(count == 0 && countOnline > 0){
//    item.displayCount = "";
//    item.linkpagesite = "#page-site-online";
//    $("#nav_site_offline").addClass('ui-disabled');
//  }else if(count > 0 && countOnline == 0){
//    item.displayCount = count;
//    item.linkpagesite = "#page-site-list";
//    $("#nav_site_online").addClass('ui-disabled');
//  }
//  else {
//    item.displayCount = count;
//    item.linkpagesite = "#page-site-list";
//  }
  return item;
}

function synCollectionForCurrentUser(newCollections) {
  var currentUser = getCurrentUser();
  Collection.all().filter('user_id', '=', currentUser.id).list(function(collections) {
    removeCollectionsToLocalDB(collections);
    addCollectionsToLocalDB(newCollections);
  });
}

function displayCollectionList(collectionData) {
  var collectionTemplate = Handlebars.compile($("#collection-template").html());
  $('#collection-list').html(collectionTemplate({collectionList: collectionData}));
  $('#collection-list').listview("refresh");
}