SiteController = {
  add: function() {
    var data = buildDataForSite();
    if (isOnline())
      SiteController.addOnline(data, resetSiteForm);
    else
      SiteController.addOffline(data, resetSiteForm);
  },
  addOnline: function(data, callback) {
    ViewBinding.setBusy(true);
    SiteModel.create(data, callback, function() {
      ViewBinding.setAlert("Please send data again.");
    });
  },
  addOffline: function(data, callback) {
    SiteOffline.add(data);
    callback();
  },
  display: function(element, siteData) {
    App.Template.process("site/list.html", siteData, function(content) {
      element.html(content);
      element.listview("refresh");
    });
  },
  getAllByCollectionId: function(cId) {
    SiteController.getByCollectionIdOffline(cId);
    SiteController.getByCollectionIdOnline(cId);
  },
  getByCollectionIdOffline: function(cId) {
    SiteOffline.fetchByCollectionId(cId, function(sites) {
      var siteData = [];
      sites.forEach(function(site) {
        var fullDate = dateToParam(site.created_at());
        siteData.push({
          id: site.id, 
          name: site.name(), 
          collectionName: "offline", 
          date: fullDate,
          link: "#page-update-site"
        });
      });
      SiteController.display($('#site-list') ,{siteList: siteData});
    });
  },
  getByCollectionIdOnline: function(cId) {
    SiteModel.fetch(cId, function(response) {
      var siteOnlineData = [];
      $.each(response["sites"], function(key, data) {
        var date = data.created_at;
        date = new Date(date);
        date = dateToParam(date);
        var item = {id: data.id,
          name: data.name,
          lat: data.lat,
          lng: data.lng,
          date: date,
          link: "#page-update-site-online"
        };
        siteOnlineData.push(item);
        if (key === response["total"] - 1) {
          SiteController.display($('#site-list-online'), {siteList: siteOnlineData});
        }
      });
    });
  },
  getByUserId: function(userId) {
    SiteOffline.fetchByUserId(userId, function(sites) {
      var siteofflineData = [];
      sites.forEach(function(site) {
        var fullDate = dateToParam(site.created_at());
        var item = {id: site.id,
          name: site.name(),
          collectionName: site.collection_name(),
          date: fullDate,
          link: "#page-update-site"
        };
        siteofflineData.push(item);
      });
      SiteController.display($('#offlinesite-list'), {siteList: siteofflineData});
    });
  }
};

function renderUpdateSiteForm() {
  var id = localStorage.getItem("sId");
  Site.all().filter('id', "=", id).one(function(site) {
    var siteUpdateData = {name: site.name(), lat: site.lat(), lng: site.lng()};
    displayUpdateSiteLatLng(siteUpdateData);
    renderFieldsBySite(site);
  });
}

function renderUpdateSiteFormFromServer() {
  ViewBinding.setBusy(true);
  SiteModel.fetchOne(function(response) {
    var siteOnlineUpdateData = {name: response.name, lat: response.lat, lng: response.long};
    displayUpdateSiteLatLngFromServer(siteOnlineUpdateData);
    renderFieldsBySiteFromServer(response);
  });
}

function updateSiteBySiteId() {
  var id = localStorage.getItem("sId");
  Site.all().filter('id', "=", id).one(function(site) {
    site.name($("#updatesitename").val());
    site.lat($("#updatelolat").val());
    site.lng($("#updatelolng").val());
    queryFieldByCollectionIdOffline(function(fields) {
      var propertiesFile = {properties: {}, files: {}};
      fields.forEach(function(field) {
        propertiesFile = updateFieldValueBySiteId(propertiesFile, field, "#update_", false);
      });
      site.properties(propertiesFile.properties);
      site.files(propertiesFile.files);
      persistence.flush();
      clearFilePathStorage("fileDataOffline");
      clearFilePathStorage("fileNameOffline");
      location.href = "index.html#page-site-list";
    });
  });
}

function updateSiteBySiteIdFromServer() {
  var data;
  ViewBinding.setBusy(true);
  FieldModel.fetch(function(fields) {
    var propertiesFile = {properties: {}, files: {}};
    $.each(fields, function(key, field) {
      propertiesFile = updateFieldValueBySiteId(propertiesFile, field, "#update_online_", true);
    });
    data = {
      "_method": "put",
      "auth_token": App.Session.getAuthToken(),
      "site": {
        "name": $("#updatesitename_online").val(),
        "lat": $("#updatelolat_online").val(),
        "lng": $("#updatelolng_online").val(),
        "properties": propertiesFile.properties,
        "files": propertiesFile.files
      }
    };
    SiteModel.update(data, function() {
      clearFilePathStorage("filePath");

      var sId = localStorage.getItem("sId");
      $.each(data.site.properties, function(key, idField) {
        PhotoList.remove(sId, key);
      });

      App.redirectTo("#page-site-list");
    }, function() {
      alert(i18n.t("global.please_reupdate_your_site"));
    });
  });
}

function deleteSiteBySiteId(sId) {
  Site.all().filter('id', "=", sId).one(function(site) {
    persistence.remove(site);
    persistence.flush();
    location.href = "#page-site-list";
  });
}

function sendSiteToServerByCollectiion() {
  var cId = localStorage.getItem("cId");
  sendSiteToServer("collection_id", cId);
}

function sendSiteToServerByUser() {
  var currentUser = SessionController.currentUser();
  sendSiteToServer("user_id", currentUser.id);
}

function sendSiteToServer(key, id) {
  if (isOnline()) {
    Site.all().filter(key, "=", id).list(function(sites) {
      if (sites.length > 0)
        submitSiteServer(sites);
    });
  }
  else
    alert(i18n.t("global.no_internet_connection"));
}

function submitSiteServer(sites) {
  var site = sites[0];
  ViewBinding.setBusy(true);
  var data = {site: {
      collection_id: site.collection_id(),
      name: site.name(),
      lat: site.lat(),
      lng: site.lng(),
      properties: site.properties(),
      files: site.files()
    }
  };
  SiteModel.create(data["site"], function() {
    persistence.remove(site);
    persistence.flush();
    $('#sendToServer').show();
    sites.splice(0, 1);
    if (sites.length === 0) {
      window.location.href = "#page-collection-list";
    }
    else
      submitSiteServer(sites);
  }, function() {
    $("#info_sign_in").show();
    location.href = "#page-login";
  });
}