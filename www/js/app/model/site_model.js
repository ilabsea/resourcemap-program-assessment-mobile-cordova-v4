SiteModel = {
  create: function(attr, successCallback, errorCallback) {
    var cId = attr.collection_id;
    var url = App.URL_SITE + cId + "/sites?auth_token=" + App.Session.getAuthToken();
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
      url: App.URL_SITE + collectionID + "/sites.json?auth_token=" + App.Session.getAuthToken(),
      type: "GET",
      datatype: 'json',
      success: successCallback,
      timeout: 600000,
      error: function(error) {
        App.log("Retriving sites from server : ", error);
      }
    });
  },
  fetchOne: function(successCallback) {
    var cId = localStorage.getItem("cId");
    var sId = localStorage.getItem("sId");
    $.ajax({
      url: App.URL_SITE + cId + "/sites/" + sId + ".json",
      data: {"auth_token": App.Session.getAuthToken()},
      type: "GET",
      datatype: 'json',
      success: successCallback,
      timeout: 600000,
      error: function(error, t) {
        if(t==="timeout" || t==="notmodified") {
          alert('Internet connection problem.');
          App.redirectTo('#page-site-list');
        } 
      },
      complete: function() {
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
      url: App.URL_SITE + cId + "/sites/" + sId,
      dataType: "json",
      success: successCallback,
      error: errorCallback
    });
  }
};

SiteOffline = {
  add: function(data) {
    var collectionName = localStorage.getItem("collectionName");
    var today = new Date();
    var siteParams = data;
    siteParams["created_at"] = today;
    siteParams["collection_name"] = collectionName;
    siteParams["user_id"] = SessionController.currentUser().id;
    var site = new Site(siteParams);
    persistence.add(site);
    persistence.flush();
  },
  fetchBySiteId: function(sId, callback) {
    Site.all().filter('id', "=", sId).one(callback);
  },
  fetchByCollectionId: function(cId, callback) {
    Site.all().filter('collection_id', "=", cId).list(null, callback);
  },
  fetchByUserId: function(userId, callback) {
    Site.all().filter('user_id', '=', userId).list(null, callback);
  },
  deleteBySiteId: function(sId) {
    SiteOffline.fetchBySiteId(sId, function(site) {
      persistence.remove(site);
      persistence.flush();
      App.redirectTo("#page-site-list");
    });
  },
  countByCollectionId: function(idcollection, callback) {
    Site.all().filter('collection_id', "=", idcollection).count(null, function(count) {
      callback(count);
    });
  },
  countByUserId: function(userId, callback) {
    Site.all().filter('user_id', "=", userId).count(null, function(count) {
      callback(count);
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