var SiteMembershipModel = {
  fetch: function (cId, success) {
    var url = App.endPoint() + "/collections/" + cId + "/site_permissions.json?auth_token="
        + App.Session.getAuthToken();
    $.ajax({
      type: "get",
      url: url,
      dataType: "json",
      success: success
    });
  }
}
