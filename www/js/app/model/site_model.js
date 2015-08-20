SiteModel = {
  limit: 15,
  sitePage: 0,
  create: function (attr, successCallback, errorCallback) {
    var cId = attr.collection_id;
    var url = App.END_POINT + "/v1/collections/" + cId + "/sites?auth_token="
        + App.Session.getAuthToken();
    $.ajax({
      url: url,
      type: "POST",
      data: {site: attr, rm_wfp_version: App.VERSION},
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
  fetchOne: function (successCallback) {
    var cId = localStorage.getItem("cId");
    var sId = localStorage.getItem("sId");
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
      },
      complete: function () {
        ViewBinding.setBusy(true);
      }
    });
  },
  update: function (data, successCallback, errorCallback) {
    var cId = localStorage.getItem("cId");
    var sId = localStorage.getItem("sId");
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

ViewBinding = {
  __busy: false,
  __msg: "",
  setBusy: function (status) {
    this.__busy = status;
    if (this.__busy)
      Spinner.show();
    else
      Spinner.hide();
  },
  setAlert: function (msg) {
    this.__msg = msg;
    if (!this.__msg)
      alert(this.__msg);
  }
};

SiteList = {
  menu: function () {
    App.emptyHTML();
    var cId = App.DataStore.get("cId");
    var value = $('#site-list-menu').val();
    $("#btn_sendToServer").hide();
    switch (value) {
      case "1":
        SiteController.getAllByCollectionId(cId);
        break;
      case "2":
        SiteController.getByCollectionIdOffline(cId);
        $("#btn_sendToServer").show();
        break;
      case "3":
        SiteController.getByCollectionIdOnline(cId);
        break;
      case "4":
        SessionController.logout();
    }
  }
};