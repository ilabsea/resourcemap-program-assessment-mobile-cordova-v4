FieldModel = {
  fetch: function(successCallback) {
    var cId = localStorage.getItem("cId");
    $.ajax({
      url: App.URL_FIELD + cId + "/fields?auth_token=" + App.Session.getAuthToken(),
      type: "get",
      datatype: 'json',
      success: successCallback,
      timeout: 600000,
      error: function(error) {
        App.log("error: ", error);
        if (!App.isOnline())
          FieldController.renderByCollectionIdOffline();
      }
    });
  }
};