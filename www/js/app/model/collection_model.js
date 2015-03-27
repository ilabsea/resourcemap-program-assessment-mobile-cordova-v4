CollectionModel = {
  fetch: function(successCallback) {
    $.ajax({
      type: "get",
      url: App.LIST_COLLECTION + App.Session.getAuthToken(),
      dataType: "json",
      success: successCallback
    });
  },
  fetchOne: function(callback) {
    $.ajax({
      type: "get",
      url: App.URL_COLLECTION + App.DataStore.get("cId") + ".json?auth_token=" + App.Session.getAuthToken(),
      dataType: "json",
      success: callback
    });
  }
};