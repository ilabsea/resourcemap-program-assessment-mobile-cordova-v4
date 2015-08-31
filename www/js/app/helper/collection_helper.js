var CollectionHelper = {
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