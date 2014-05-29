function addCollection(idcollection, name, description) {
    var collectionParams = {
        idcollection: idcollection,
        name: name,
        description: description,
        user_id: getCurrentUser().id
    };
    var collection = new Collection(collectionParams);
    persistence.add(collection);
    persistence.flush();
}

function getCollectionByUserIdOffline() {
    var currentUser = getCurrentUser();
    var collectionData = [];
    Collection.all().filter('user_id', '=', currentUser.id).list(null, function(collections) {
        var i = 0;
        collections.forEach(function(collection) {
            var count = 0;
            Site.all().filter('collection_id', "=", collection.idcollection()).count(null, function(l) {
                count = l;
                var linkpagesite;
                if (count == 0) {
                    count = "";
                    linkpagesite = "#page-create-site";
                }
                else
                    linkpagesite = "#page-site-list";
                i++;
                var item = {idcollection: collection.idcollection(),
                    name: collection.name(),
                    count: count,
                    linkpagesite: linkpagesite
                };
                collectionData.push(item);
                if (i === collections.length)
                    displayCollectionList(collectionData);
            });
        });
    });
    if (collectionData == "") {
        displayCollectionList(collectionData);
    }
}
function getCollectionByUserIdOnline() {
    $.ajax({
        type: "get",
        url: App.LIST_COLLECTION + getAuthToken(),
        dataType: "json",
        crossDomain: true,
        success: function(response) {
            var currentUser = getCurrentUser();
            Collection.all().filter('user_id', '=', currentUser.id).list(function(collections) {
                collections.forEach(function(collection) {
                    persistence.remove(collection);
                    persistence.flush();
                });
            });
            var collectionData = [];
            $.each(response, function(key, data) {
                var idcollection = data.id;
                var name = data.name;
                var description = data.description;
                var count = 0;
                Site.all().filter('collection_id', "=", idcollection).count(null, function(l) {
                    count = l;
                    var linkpagesite;
                    if (count == 0) {
                        count = "";
                        linkpagesite = "#page-create-site";
                    }
                    else
                        linkpagesite = "#page-site-list";
                    var item = {idcollection: idcollection,
                        name: name,
                        count: count,
                        linkpagesite: linkpagesite
                    };
                    collectionData.push(item);
                    if (key === response.length - 1) {
                        console.log("Her", collectionData);
                        displayCollectionList(collectionData);
                    }
                });
                Collection.all().filter('idcollection', "=", idcollection).one(null, function(collection) {
                    if (collection === null)
                        addCollection(idcollection, name, description);
                });
            });
            if (collectionData == "") {
                displayCollectionList(collectionData);
            }
        }
    });
}
//============================================ online ==========================================
function getCollection() {
    if (!isOnline()) {
        getCollectionByUserIdOffline();
    } else {
        getCollectionByUserIdOnline();
    }
}

function displayCollectionList(collectionData) {
    var collectionTemplate = Handlebars.compile($("#collection-template").html());
    $('#collection-list').html(collectionTemplate({collectionList: collectionData}));
    $('#collection-list').listview("refresh");
}