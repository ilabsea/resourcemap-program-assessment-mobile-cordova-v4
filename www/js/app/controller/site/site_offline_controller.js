var SiteOfflineController = {
  add: function (data) {
    SiteOffline.add(data);
    SiteHelper.resetForm();
  },
  getByCollectionId: function () {
    var cId = App.DataStore.get("cId");
    SiteOffline.fetchByCollectionId(cId, function (sites) {
      var siteData = [];
      sites.forEach(function (site) {
        var fullDate = dateToParam(site.created_at());
        siteData.push({
          id: site.id,
          name: site.name(),
          collectionName: "offline",
          date: fullDate,
          link: "#page-update-site"
        });
        SiteList.add(new SiteObj(site.id, site.name()));
      });
      SiteView.display($('#site-list'), {siteList: siteData});
    });
  },
  getByUserId: function (userId) {
    SiteOffline.fetchByUserId(userId, function (sites) {
      var siteofflineData = [];
      sites.forEach(function (site) {
        var fullDate = dateToParam(site.created_at());
        var item = {id: site.id,
          name: site.name(),
          collectionName: site.collection_name(),
          date: fullDate,
          link: "#page-update-site"
        };
        siteofflineData.push(item);
      });
      SiteView.display($('#offlinesite-list'), {siteList: siteofflineData});
    });
  },
  updateBySiteId: function () {
    var sId = App.DataStore.get("sId");
    SiteOffline.fetchBySiteId(sId, function (site) {
      site.name($("#updatesitename").val());
      site.lat($("#updatelolat").val());
      site.lng($("#updatelolng").val());
      var cId = App.DataStore.get("cId");
      FieldOffline.fetchByCollectionId(cId, function (fields) {
        var propertiesFile = {properties: {}, files: {}};
        fields.forEach(function (field) {
          propertiesFile = FieldController.updateFieldValueBySiteId(propertiesFile, field, "#update_", false);
        });
        site.properties(propertiesFile.properties);
        site.files(propertiesFile.files);
        persistence.flush();
        PhotoList.clear();
        SearchList.clear();
        App.DataStore.clearAllSiteFormData();
        App.Cache.resetValue();
        App.redirectTo("index.html#page-site-list");
      });
    });
  },
  renderUpdateSiteForm: function () {
    var sId = App.DataStore.get("sId");
    SiteOffline.fetchBySiteId(sId, function (site) {
      var siteUpdateData = {
        name: site.name(),
        lat: site.lat(),
        lng: site.lng()
      };
      SiteView.displayUpdateLatLng("site/updateOffline.html",
          $('#div-site-update-name'), "", siteUpdateData);
      FieldOfflineController.renderUpdate(site);
    });
  },
  deleteBySiteId: function (sId) {
    SiteOffline.deleteBySiteId(sId);
  },
  submitAllToServerByCollectionId: function () {
    var cId = App.DataStore.get("cId");
    SiteOfflineController.processToServer("collection_id", cId);
  },
  submitAllToServerByUserId: function () {
    var currentUser = SessionHelper.currentUser();
    SiteOfflineController.processToServer("user_id", currentUser.id);
  },
  processToServer: function (key, id) {
    if (App.isOnline()) {
      Site.all().filter(key, "=", id).list(function (sites) {
        if (sites.length > 0)
          SiteOfflineController.processingToServer(sites);
      });
    }
    else
      alert(i18n.t("global.no_internet_connection"));
  },
  processingToServer: function (sites) {
    var site = sites[0];
    ViewBinding.setBusy(true);
    var data = {site: {
        device_id: site.device_id(),
        external_id: site.id,
        collection_id: site.collection_id(),
        name: site.name(),
        lat: site.lat(),
        lng: site.lng(),
        properties: site.properties(),
        files: site.files()
      }
    };
    SiteModel.create(data["site"], function () {
      persistence.remove(site);
      persistence.flush();
      $('#sendToServer').show();
      sites.splice(0, 1);
      if (sites.length === 0)
        App.redirectTo("#page-collection-list");
      else
        SiteOfflineController.processingToServer(sites);
    }, function (err) {
      if (err.statusText === "Unauthorized") {
        showElement($("#info_sign_in"));
        App.redirectTo("#page-login");
      } else {
        var error = SiteHelper.buildSubmitError(err["responseJSON"], data["site"]);
        SiteView.displayError("site/errorUpload.html", $('#page-error-submit-site'),
            error);
      }
    });
  },
  countByUserId: function (userId) {
    SiteOffline.countByUserId(userId, function (count) {
      if (count == 0) {
        $('#btn_viewOfflineSite').hide();
      } else {
        $('#btn_viewOfflineSite').show();
      }
    });
  },
  countByCollectionId: function (cId) {
    SiteOffline.countByCollectionId(cId, function (count) {
      var offline = "#site-list-menu option[value='2']";
      if (count == 0) {
        $(offline).attr('disabled', true);
        $("#site-list-menu").change();
      } else {
        $(offline).removeAttr('disabled');
      }
      $("#site-list-menu").selectmenu("refresh", true);
    });
  }
};