var SiteOnlineController = {
  add: function (data, callback) {
    ViewBinding.setBusy(true);
    SiteModel.create(data, callback, function () {
      ViewBinding.setAlert("Please send data again.");
    });
  },
  getByCollectionId: function () {
    var cId = App.DataStore.get("cId");
    var offset = SiteModel.sitePage * SiteModel.limit;
    SiteModel.fetch(cId, offset, function (response) {
      var siteOnlineData = [];
      $.map(response["sites"], function (data) {
        var date = data.created_at;
        date = new Date(date);
        date = dateToParam(date);
        var item = {id: data.id,
          name: data.name,
          collectionName: "",
          date: date,
          link: "#page-update-site-online"
        };
        siteOnlineData.push(item);
      });
      var hasMoreSites = false;
      var siteLength = response["sites"].length + offset;
      if (siteLength < response["total"]) {
        hasMoreSites = true;
      }
      var siteData = {
        hasMoreSites: hasMoreSites,
        state: "online",
        siteList: siteOnlineData};
      SiteView.display($('#site-list-online'), siteData);
    });
  },
  updateBySiteId: function () {
    var data;
    ViewBinding.setBusy(true);
    FieldModel.fetch(function (fields) {
      var propertiesFile = {properties: {}, files: {}};
      $.map(fields, function (field) {
        propertiesFile = FieldController.updateFieldValueBySiteId(propertiesFile, field, "#update_online_", true);
      });
      data = {
        "_method": "put",
        "auth_token": App.Session.getAuthToken(),
        "rm_wfp_version": App.VERSION,
        "site": {
          "name": $("#updatesitename_online").val(),
          "lat": $("#updatelolat_online").val(),
          "lng": $("#updatelolng_online").val(),
          "properties": propertiesFile.properties,
          "files": propertiesFile.files
        }
      };
      SiteModel.update(data, function () {
        var sId = App.DataStore.get("sId");
        $.each(data.site.properties, function (key, idField) {
          PhotoList.remove(sId, key);
        });

        App.DataStore.clearPartlyAfterCreateSite();

        App.redirectTo("#page-site-list");
      }, function (err) {
        if (err["responseJSON"]) {
          var error = SiteHelper.buildSubmitError(err["responseJSON"], data["site"], false);
          SiteHelper.displayError("site/errorUpload.html", $('#page-error-submit-site'),
              error);
        }
      });
    });
  },
  renderUpdateSiteForm: function () {
    ViewBinding.setBusy(true);
    SiteModel.fetchOne(function (site) {
      MyMembershipObj.setSite(site);
      var can_edit = MyMembershipController.canEdit(site);
      if (!can_edit) {
        $("#btn_submitUpdateSite_online").hide();
      } else {
        $("#btn_submitUpdateSite_online").show();
      }
      var siteOnlineUpdateData = {
        editable: (can_edit ? "" : "readonly"),
        name: site.name,
        lat: site.lat,
        lng: site.long
      };
      SiteView.displayUpdateLatLng("site/updateOnline.html",
          $('#div-site-update-name-online'), siteOnlineUpdateData);
      FieldController.renderUpdateOnline(site);
    });
  },
};