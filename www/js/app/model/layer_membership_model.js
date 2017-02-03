var LayerMembershipModel = {
  fetchMembership: function (cId, success) {
    var url = App.endPoint() + "/collections/" + cId + "/layer_memberships.json?auth_token="
        + App.Session.getAuthToken();
    $.ajax({
      type: "get",
      url: url,
      dataType: "json",
      success: success
    });
  }
}
