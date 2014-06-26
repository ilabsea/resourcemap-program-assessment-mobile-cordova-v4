FieldModel = {
  fetch: function(successCallback) {
    var cId = localStorage.getItem("cId");
    $.ajax({
      url: App.URL_FIELD + cId + "/fields?auth_token=" + getAuthToken(),
      type: "get",
      datatype: 'json',
      success: successCallback,
      error: function(error) {
        console.log("erro:  " + error);
      }
    });
  }
};