var SiteOfflineController = {
  add: function (data) {
    SiteOffline.add(data);
    SiteController.resetForm();
  },
  getByCollectionId: function () {
    var cId = App.DataStore.get("cId");
    var uId = SessionController.currentUser().id;
    var offset = SiteOffline.sitePage * SiteOffline.limit;
    SiteOffline.fetchByCollectionIdUserId(cId, uId, offset, function (sites) {
      var siteData = [];
      sites.forEach(function (site) {
        var fullDate = dateToParam(site.created_at());
        siteData.push({
          id: site.id,
          name: site.name(),
          collectionName: "offline",
          date: fullDate,
          link: "#page-form-site"
        });
      });
      SiteOffline.countByCollectionIdUserId(cId, uId, function (count) {
        var siteLength = sites.length + offset;
        var hasMoreSites = false;
        if (siteLength < count) {
          hasMoreSites = true;
        }
        var sitesRender = {
          hasMoreSites: hasMoreSites,
          state: "offline",
          siteList: siteData};
        SiteView.display($('#site-list'), sitesRender);
      });
    });
  },
  deleteBySiteId: function (sId) {
    SiteOffline.deleteBySiteId(sId);
  },
  updateBySiteId: function () {
    var sId = App.DataStore.get("sId");
    SiteOffline.fetchBySiteId(sId, function (site) {
      site.name($("#lat").val());
      site.lat($("#lat").val());
      site.lng($("#lng").val());
      var cId = App.DataStore.get("cId");
      FieldOffline.fetchByCollectionId(cId, function (fields) {
        var propertiesFile = {properties: {}, files: {}};
        fields.forEach(function (field) {
          propertiesFile = FieldHelper.updateFieldValueBySiteId(propertiesFile, field, false);
        });
        site.properties(propertiesFile.properties);
        site.files(propertiesFile.files);
        persistence.flush();

        App.DataStore.clearPartlyAfterCreateSite();

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
      SiteView.displayUpdateLatLng("site/update.html",
          $('#div-site-update-name'), siteUpdateData);
      FieldOfflineController.renderUpdate(site);
    });
  },
  submitAllToServerByCollectionIdUserId: function () {
    var cId = App.DataStore.get("cId");

    var user = SessionController.currentUser();
    SiteOfflineController.processToServerByCollectionIdUserId(cId, user.id);
  },
  submitAllToServerByUserId: function () {
    var currentUser = SessionController.currentUser();
    SiteOfflineController.processToServerByUserId(currentUser.id);
  },
  processToServerByCollectionIdUserId: function (cId, uId) {
    if (App.isOnline()) {
      Site.all()
          .filter('collection_id', "=", cId)
          .filter('user_id', '=', uId).list(function (sites) {
        if (sites.length > 0)
          SiteOfflineController.processingToServer(sites);
      });
    }
    else
      alert(i18n.t("global.no_internet_connection"));
  },
  processToServerByUserId: function (userId) {
    if (App.isOnline()) {
      Site.all().filter('user_id', '=', userId).list(function (sites) {
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
        start_entry_date: site.start_entry_date,
        end_entry_date: site.end_entry_date,
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
        SiteController.processingToServer(sites);
    }, function (err) {
      if (err.statusText === "Unauthorized") {
        showElement($("#info_sign_in"));
        App.redirectTo("#page-login");
      } else {
        var error = SiteHelper.buildSubmitError(err["responseJSON"], data["site"], true);
        SiteHelper.displayError("site/errorUpload.html", $('#page-error-submit-site'),
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
    var currentUser = SessionController.currentUser();
    SiteOffline.countByCollectionIdUserId(cId, currentUser.id, function (count) {
      var offline = "#site-list-menu option[value='2']";
      if (count == 0) {
        $(offline).attr('disabled', true);
        $("#site-list-menu").change();
      } else {
        $(offline).removeAttr('disabled');
      }
      $("#site-list-menu").selectmenu("refresh", true);
    });
  },
};