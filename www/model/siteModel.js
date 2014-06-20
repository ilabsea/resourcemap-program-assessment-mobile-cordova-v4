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
      crossDomain: true,
      datatype: 'json',
      success: successCallback,
      error: errorCallback,
      complete: function() {
        ViewBinding.setBusy(false);
      }
    });
  },
  fetch: function(collectionID, successCallback) {
    $.ajax({
      url: App.END_POINT + "/v1/collections/" + collectionID + "/sites.json?auth_token=" + getAuthToken(),
      type: "GET",
      crossDomain: true,
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
      crossDomain: true,
      datatype: 'json',
      success: successCallback,
      error: function(error) {
        console.log("Retriving sites from server : ", error);
      },
      complete: function() {
        ViewBinding.setBusy(false);
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
      error: errorCallback,
      complete: function() {
        ViewBinding.setBusy(false);
      }
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