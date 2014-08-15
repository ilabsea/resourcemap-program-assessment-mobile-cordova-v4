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
        item.linkpagesite = "#page-site-list";
    } else {
        item.displayCount = count;
        item.linkpagesite = "#page-site-list";
    }
    return item;
}