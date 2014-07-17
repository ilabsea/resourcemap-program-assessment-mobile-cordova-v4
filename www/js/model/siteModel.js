SiteModel = {
  countByCollectionId: function(idcollection, callback) {
    Site.all().filter('collection_id', "=", idcollection).count(null, function(count) {
      callback(count);
    });
  },
  create: function(attr, successCallback, errorCallback) {
    var cId = attr.collection_id;
    var url = App.END_POINT + "/v1/collections/" + cId + "/sites?auth_token=" + getAuthToken();
    $.ajax({
      url: url,
      type: "POST",
      data: {site: attr},
      datatype: 'json',
      success: successCallback,
      error: errorCallback
    });
  },
  fetch: function(collectionID, successCallback) {
    $.ajax({
      url: App.END_POINT + "/v1/collections/" + collectionID + "/sites.json?auth_token=" + getAuthToken(),
      type: "GET",
      datatype: 'json',
      success: successCallback,
      error: function(error) {
        console.log("Retriving sites from server : ", error);
      }
    });
  },
  fetchOne: function(successCallback) {
    var cId = localStorage.getItem("cId");
    var sId = localStorage.getItem("sId");
    $.ajax({
      url: App.END_POINT + "/v1/collections/" + cId + "/sites/" + sId + ".json",
      data: {"auth_token": getAuthToken()},
      type: "GET",
      datatype: 'json',
      success: successCallback,
      error: function(error) {
        console.log("Retriving sites from server : ", error);
      },
      complete:function(){
          ViewBinding.setBusy(true);
      }
    });
  },
  update: function(data, successCallback, errorCallback) {
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
  setBusy: function(status) {
    this.__busy = status;
    if (this.__busy) {
      showSpinner();
    }
    else
      hideSpinner();
  },
  setAlert: function(msg) {
    this.__msg = msg;
    if (!this.__msg)
      alert(this.__msg);
  }
};

SiteList = {
  menu: function() {
    App.emptyHTML();
    var value = $('#site-list-menu').val();
    $("#btn_sendToServer").hide();
    switch (value) {
      case "1":
        displayAllSites();
        break;
      case "2":
        getSiteByCollectionId();
        $("#btn_sendToServer").show();
        break;
      case "3":
        getSiteByCollectionIdFromServer();
        break;
      case "4":
        logout();
    }
  }
};