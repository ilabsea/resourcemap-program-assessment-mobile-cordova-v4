SiteController = {
  setEntryDate: function () {
    var start_entry_date = new Date().toISOString();
    $("#start_entry_date").val(start_entry_date);
  },
  display: function (element, siteData) {
    App.Template.process("site_list", siteData, function (content) {
      element.append(content);
      element.listview("refresh");
    });
  },
  displayUpdateLatLng: function (templateURL, element, siteUpdateData) {
    App.Template.process(templateURL, siteUpdateData, function (content) {
      element.html(content);
      element.trigger("create");
    });
  },
  add: function () {
    var data = SiteController.buildDataForSite();
    if (App.isOnline())
      SiteController.addOnline(data, SiteController.resetForm);
    else
      SiteController.addOffline(data);
  },
  addOnline: function (data, callback) {
    ViewBinding.setBusy(true);
    SiteModel.create(data, callback, function () {
      ViewBinding.setAlert("Please send data again.");
    });
  },
  addOffline: function (data) {
    SiteOffline.add(data);
    SiteController.resetForm();
  },
  getAllByCollectionId: function () {
    SiteController.getByCollectionIdOffline();
    if (App.isOnline()) {
      SiteController.getByCollectionIdOnline();
      MyMembershipController.getMembershipByCollectionId();
    }
  },
  getByCollectionIdOffline: function () {
    var cId = App.DataStore.get("cId");
    var uId = UserSession.getUser().id;
    var offset = SiteOffline.sitePage * SiteOffline.limit;
    SiteOffline.fetchByCollectionIdUserId(cId, uId, offset, function (sites) {
      var siteData = [];
      sites.forEach(function (site) {
        var fullDate = dateToParam(site.created_at);
        siteData.push({
          id: site.id,
          name: site.name,
          collectionName: "offline",
          date: fullDate,
          link: "#page-update-site"
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
          siteList: siteData };
        SiteController.display($('#site-list'), sitesRender);
      });
    });
  },
  getByCollectionIdOnline: function () {
    var cId = App.DataStore.get("cId");
    var offset = SiteModel.sitePage * SiteModel.limit;
    SiteModel.fetch(cId, offset, function (response) {
      var siteOnlineData = [];
      $.each(response["sites"], function (_, data) {
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
      SiteController.display($('#site-list-online'), siteData);
    });
  },
  getByUser: function () {
    var userId = UserSession.getUser().id;
    var offset = SiteOffline.sitePage * SiteOffline.limit;
    SiteOffline.fetchByUserId(userId, offset, function (sites) {

      var siteofflineData = [];
      sites.forEach(function (site) {
        var fullDate = dateToParam(site.created_at);
        var item = {
          id: site.id,
          name: site.name,
          collectionName: site.collection_name,
          date: fullDate,
          link: "#page-update-site"
        };
        siteofflineData.push(item);
      });
      SiteOffline.countByUserId(userId, function (count) {
        var siteLength = sites.length + offset;
        var hasMoreSites = false;
        if (siteLength < count) {
          hasMoreSites = true;
        }
        var sitesRender = {
          hasMoreSites: hasMoreSites,
          state: "all",
          siteList: siteofflineData};
        SiteController.display($('#offlinesite-list'), sitesRender);
      });
    });
  },
  deleteBySiteId: function (sId) {
    SiteOffline.deleteBySiteId(sId);
  },
  updateBySiteIdOffline: function () {
    var sId = App.DataStore.get("sId");
    SiteOffline.fetchBySiteId(sId, function (site) {
      site.name = $("#updatesitename").val();
      site.lat = $("#updatelolat").val();
      site.lng = $("#updatelolng").val();
      var cId = App.DataStore.get("cId");
      FieldOffline.fetchByCollectionId(cId, function (fields) {
        var propertiesFile = {properties: {}, files: {}};
        fields.forEach(function (field) {
          propertiesFile = FieldController.updateFieldValueBySiteId(propertiesFile, field, "#update_", false);
        });
        site.properties = propertiesFile.properties ;
        site.files = propertiesFile.files;
        persistence.flush();

        App.DataStore.clearPartlyAfterCreateSite();

        App.redirectTo("index.html#page-site-list");
      });
    });
  },
  updateBySiteIdOnline: function () {
    var data;
    ViewBinding.setBusy(true)
    FieldModel.fetch(function (fields) {
      var propertiesFile = {properties: {}, files: {}};
      $.each(fields, function (_, field) {
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
        ViewBinding.setBusy(false)
        App.redirectTo("#page-site-list");
      }, function (err) {
        if (err["responseJSON"]) {
          var error = SiteHelper.buildSubmitError(err["responseJSON"], data["site"], false);
          SiteHelper.displayError("site_error_upload", $('#page-error-submit-site'),
              error);
        }
      });
    });
  },

  renderNewSiteByForm: function(){
    FieldController.renderByCollectionId()
  },

  renderUpdateSiteFormOffline: function () {
    var sId = App.DataStore.get("sId");
    SiteOffline.fetchBySiteId(sId, function (site) {
      var siteUpdateData = {
        name: site.name,
        lat: site.lat,
        lng: site.lng
      };
      SiteController.displayUpdateLatLng("site_update_offline",
          $('#div-site-update-name'), siteUpdateData);
      FieldController.renderUpdateOffline(site);
    });
  },
  renderUpdateSiteFormOnline: function () {
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
      SiteController.displayUpdateLatLng("site_update_online",
      $('#div-site-update-name-online'), siteOnlineUpdateData);
      FieldController.renderUpdateOnline(site);
    });
  },
  submitAllToServerByCollectionIdUserId: function () {
    ViewBinding.setBusy(true);
    if (App.isOnline()) {
      SiteController.processToServerByCollectionIdUserId();
    }
    else{
      ViewBinding.setBusy(false);
      alert(i18n.t("global.no_internet_connection"));
    }
  },
  submitAllToServerByUserId: function () {
    ViewBinding.setBusy(true);
    if (App.isOnline()) {
      SiteController.processToServerByUserId();
    }
    else
      alert(i18n.t("global.no_internet_connection"));
  },
  processToServerByUserId: function(){
    var uId = UserSession.getUser().id;
    var offset = 0;
    SiteOffline.limit = 7;
    SiteOffline.countByUserId(uId, function(nbSites){
      SiteOffline.nbSites = nbSites;
      SiteOffline.fetchByUserId(uId, offset, function(sites){
        if (sites.length > 0)
          SiteController.processingToServer(sites, false);
      });
    });
  },
  processToServerByCollectionIdUserId: function () {
    var cId = App.DataStore.get("cId");
    var uId = UserSession.getUser().id;
    var offset = 0;
    SiteOffline.limit = 7;
    SiteOffline.countByCollectionIdUserId(cId, uId, function(nbSites){
      SiteOffline.nbSites = nbSites;
      SiteOffline.fetchByCollectionIdUserId(cId, uId, offset, function(sites){
        if (sites.length > 0){
          SiteController.processingToServer(sites, true);
        }
      });
    });
  },
  processingToServer: function (sites, isAllByCollectionId) {
    var site = sites[0];
    var data = {site: {
        device_id: site.device_id,
        external_id: site.id,
        start_entry_date: site.start_entry_date,
        end_entry_date: site.end_entry_date,
        collection_id: site.collection_id,
        name: site.name,
        lat: site.lat,
        lng: site.lng,
        properties: site.properties,
        files: site.files
      }
    };
    SiteModel.create(data["site"], function () {
      persistence.remove(site);
      persistence.flush();
      $('#sendToServer').show();
      sites.splice(0, 1);
      if (sites.length === 0){
        if(SiteOffline.nbSites - SiteOffline.limit > 0){
          if(isAllByCollectionId)
            SiteController.processToServerByCollectionIdUserId();
          else
            SiteController.processToServerByUserId();
        }else{
          App.redirectTo("#page-collection-list");
        }
      }
      else
        SiteController.processingToServer(sites, isAllByCollectionId);
    }, function (err) {
      if (err.statusText === "Unauthorized") {
        showElement($("#info_sign_in"));
        App.redirectTo("#page-login");
      } else {
        var error = SiteHelper.buildSubmitError(err["responseJSON"], data["site"], true);
        SiteHelper.displayError("site_error_upload", $('#page-error-submit-site'),
            error);
      }
    });
  },

  buildDataForSite: function () {
    var cId = App.DataStore.get("cId");
    var sname = $('#sitename').val();
    var slat = $('#lat').val();
    var slng = $('#lng').val();
    var start_entry_date = $("#start_entry_date").val();
    var end_entry_date = new Date().toISOString();
    var properties = {};
    var files = {};
    var field_id_arr = App.DataStore.get("field_id_arr");
    if (field_id_arr != null) {
      var storedFieldId = JSON.parse(field_id_arr);
      for (var i = 0; i < storedFieldId.length; i++) {
        var each_field = storedFieldId[i];
        var $field = $('#' + each_field);
        if ($field.length > 0){
            if ($field[0].tagName.toLowerCase() == 'img') {
              if ($("#wrapper_" + each_field).attr("class") != 'ui-disabled skip-logic-over-img') {
                var lPhotoList = PhotoList.getPhotos().length;
                for (var p = 0; p < lPhotoList; p++) {
                  var sId = localStorage.getItem("sId");
                  if (PhotoList.getPhotos()[p].id == each_field && PhotoList.getPhotos()[p].sId == sId) {
                    var fileName = PhotoList.getPhotos()[p].name();
                    properties[each_field] = fileName;
                    files[fileName] = PhotoList.getPhotos()[p].data;
                    break;
                  }
                }
              }
            }
            else if ($field[0].getAttribute("type") === 'date') {
              var date = $field.val();
              date = convertDateWidgetToParam(date);
              properties["" + each_field + ""] = date;
            }
            else if ($field[0].getAttribute("class") === "tree" ||
                $field[0].getAttribute("class") === "tree unhighlighted" ||
                $field[0].getAttribute("class") === "tree calculation") {
              var node = $field.tree('getSelectedNode');
              var data = node.id;
              if (data === null)
                data = "";
              properties[each_field] = data;
            }
            else {
              var value = $field.val();
              if (value == null)
                value = "";
              properties[each_field] = value;

            }
        }
      }
    }
    var data = {
      collection_id: cId,
      name: sname,
      lat: slat,
      lng: slng,
      start_entry_date: start_entry_date,
      end_entry_date: end_entry_date,
      properties: properties,
      files: files
    };
    return data;
  },
  resetForm: function () {
    PhotoList.clear();
    $('#form_create_site')[0].reset();
    App.redirectTo("#page-site-list");
  }
};
