SiteModel = {
  limit: 15,
  sitePage: 0,
  create: function (data, successCallback, errorCallback) {
    var cId = data.collection_id;
    var url = App.END_POINT + "/v1/collections/" + cId + "/sites?auth_token=" + App.Session.getAuthToken();
    $.ajax({
      url: url,
      type: "POST",
      data: {site: data, rm_wfp_version: App.VERSION},
      datatype: 'json',
      success: successCallback,
      error: errorCallback
    });
  },
  fetch: function (collectionID, offset, successCallback) {
    var url = App.URL_SITE + collectionID
        + "/sites.json?offset=" + offset + "&limit="
        + SiteModel.limit + "&auth_token="
        + App.Session.getAuthToken();
    $.ajax({
      url: url,
      type: "GET",
      datatype: 'json',
      success: successCallback,
      timeout: 600000,
      error: function (error) {
        App.log("Retriving sites from server : ", error);
      }
    });
  },

  fetchOne: function (cId, sId, successCallback) {

    $.ajax({
      url: App.END_POINT + "/v1/collections/" + cId + "/sites/" + sId + ".json",
      data: {"auth_token": App.Session.getAuthToken(),
        "rm_wfp_version": App.VERSION},
      type: "GET",
      datatype: 'json',
      timeout: 600000,
      success: successCallback,
      error: function (error, t) {
        if (t === "timeout" || t === "error" || t === "notmodified") {
          alert('Internet connection problem.');
          App.redirectTo('#page-site-list');
        }
      }
    });
  },
  update: function (cId, sId, data, successCallback, errorCallback) {
    $.ajax({
      data: data,
      type: "post",
      url: App.END_POINT + "/v1/collections/" + cId + "/sites/" + sId,
      dataType: "json",
      success: successCallback,
      error: errorCallback
    });
  }
};
