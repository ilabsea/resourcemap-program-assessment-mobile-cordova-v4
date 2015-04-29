var SitesByTerm = {
  fetch: function (value, success) {
    var cId = App.DataStore.get("cId");
    $.ajax({
      url: App.URL_COLLECTION + cId + "/sites_by_term.json",
      type: "GET",
      crossDomain: true,
      data: {
        "auth_token": App.Session.getAuthToken(),
        "term": value
      },
      success: success
    });
  }
};

var sitesByTermOffline = {
  
};