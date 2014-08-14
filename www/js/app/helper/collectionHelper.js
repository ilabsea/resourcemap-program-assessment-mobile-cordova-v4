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
        item.linkpagesite = "#page-site-list";
    } else {
        item.displayCount = count;
        item.linkpagesite = "#page-site-list";
    }
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
    App.Template.process("collection/list.html", collectionData, function(content) {
        $('#collection-list').html(content);
        $('#collection-list').listview("refresh");
    });
}

function displayCollectionName(collectionName) {
    App.Template.process("collection/name.html", collectionName, function(content) {
        $('.title').html(content);
    });
}