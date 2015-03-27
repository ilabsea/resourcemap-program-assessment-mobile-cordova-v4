var CollectionHelper = {
  dataCollection: function (collection, currentUser, count, fromServer) {
    var item = {
      name: collection.name,
      description: collection.description,
      is_visible_location: collection.is_visible_location,
      is_visible_name: collection.is_visible_name,
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