CollectionModel = {
    fetch: function(successCallback) {
        $.ajax({
            type: "get",
            url: App.LIST_COLLECTION + getAuthToken(),
            dataType: "json",
            crossDomain: true,
            success: successCallback
        });
    }
};