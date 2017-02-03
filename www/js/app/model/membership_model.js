var MembershipModel = {
  fetch: function (cId, success) {
    var url = App.endPoint() + "/collections/" + cId + "/my_membership.json?auth_token="
        + App.Session.getAuthToken();
    $.ajax({
      type: "get",
      url: url,
      dataType: "json",
      success: success
    });
  }
}
