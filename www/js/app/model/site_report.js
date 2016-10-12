SiteReport = {
  limit: 5,
  sitePage: 0,
  pdf: function (site, successCallback, errorCallback) {
    var url = App.endPoint() + "/v1/site_pdfs?auth_token=" + App.Session.getAuthToken();

    $.ajax({
      url: url,
      type: "POST",
      data: {id: site.uuid},
      datatype: 'json',
      success: successCallback,
      error: errorCallback
    });
  },

  page: function(site) {
    var collectionId = site['collection_id']
    var uuid = site['uuid']
    var url = RmSetting.url() + "/collections/" + collectionId + "/sites/" + uuid + "/share";
    console.log('page ', url);
    navigator.app.loadUrl(url, { openExternal:true })
  }
};
