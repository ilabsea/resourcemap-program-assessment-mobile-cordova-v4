SitesPermission = {
  fetch: function(cId, successCallback) {
    $.ajax({
      url: App.URL_SITE + cId + "/sites_permission?auth_token=" + App.Session.getAuthToken(),
      type: "GET",
      datatype: 'json',
      success: successCallback,
      cache: false,
      error: function(error) {
        console.log("Retriving sites from server : ", error);
      }
    });
  }
};