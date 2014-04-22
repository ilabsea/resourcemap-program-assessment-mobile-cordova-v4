function addCollection(idcollection, name, description) {
    App.userId = localStorage.getItem("userId");
    var collectionParams = {
        idcollection: idcollection,
        name: name,
        description: description,
        user_id: App.userId
    };
    var collection = new Collection(collectionParams);
    persistence.add(collection);
    persistence.flush();
}

function getCollectionByUserId(userId) {
    Collection.all().filter('user_id', '=', userId).list(null, function(collections) {
        var collectionData = {collectionList: []};
        var i = 0;
        collections.forEach(function(collection) {
            var count = 0;
            Site.all().filter('collection_id', "=", collection.idcollection()).count(null, function(l) {
                count = l;
                i++;
                collectionData.collectionList.push({idcollection: collection.idcollection(), name: collection.name(), count: count});
                if (i === collections.length)
                    displayCollectionList(collectionData);
            });
        });
    });
}

//============================================ online ==========================================
function getCollection() {
    if (!isOnline()) {
        App.userId = localStorage.getItem("userId");
        getCollectionByUserId(App.userId);
    } else {
        $.ajax({
            type: "get",
            url: App.LIST_COLLECTION + storeToken(),
            dataType: "json",
            crossDomain: true,
            success: function(response) {
                App.userId = localStorage.getItem("userId");
                Collection.all().filter('user_id', '=', App.userId).list(function(collections) {
                    collections.forEach(function(collection) {
                        persistence.remove(collection);
                        persistence.flush();
                    });
                });
                var collectionData = {collectionList: []};
                $.each(response, function(key, data) {
                    var idcollection = data.id;
                    var name = data.name;
                    var description = data.description;
                    var count = 0;
                    Site.all().filter('collection_id', "=", idcollection).count(null, function(l) {
                        count = l;
                        collectionData.collectionList.push({idcollection: idcollection, name: name, count: count});
                        if (key === response.length - 1) {
                            displayCollectionList(collectionData);
                        }
                    });
                    Collection.all().filter('idcollection', "=", idcollection).one(null, function(collection) {
                        if (collection === null)
                            addCollection(idcollection, name, description);
                    });
                });
            }
        });
    }
}

function displayCollectionList(collectionData) {
    var collectionTemplate = Handlebars.compile($("#collection-template").html());
    $('#collection-list').html(collectionTemplate(collectionData));
    $('#collection-list').listview("refresh");
}