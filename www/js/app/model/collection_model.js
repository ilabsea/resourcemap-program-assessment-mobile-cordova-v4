CollectionModel = {
  fetch: function (successCallback) {
    $.ajax({
      type: "get",
      url: App.LIST_COLLECTION + App.Session.getAuthToken(),
      dataType: "json",
      success: successCallback
    });
  },
  fetchMyMembership: function (cId, success) {
    var url = App.END_POINT + "/collections/" + cId + "/my_membership.json?auth_token="
        + App.Session.getAuthToken();
    $.ajax({
      type: "get",
      url: url,
      dataType: "json",
      success: success
    });
  }
};
