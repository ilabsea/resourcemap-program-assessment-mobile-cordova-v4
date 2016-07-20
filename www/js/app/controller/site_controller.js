SiteController = {
  setEntryDate: function () {
    var start_entry_date = new Date().toISOString();
    $("#start_entry_date").val(start_entry_date);
  },
  display: function (element, siteData) {
    App.Template.process("site/list.html", siteData, function (content) {
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
    var uId = SessionController.currentUser().id;
    var offset = SiteOffline.sitePage * SiteOffline.limit;
    SiteOffline.fetchFieldsByCollectionIdUserId(cId, uId, offset, function (sites) {
      var siteData = [];
      sites.forEach(function (site) {
        var fullDate = dateToParam(site.created_at());
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
          siteList: siteData};
        SiteController.display($('#site-list'), sitesRender);
      });
    });
  },
  getByCollectionIdOnline: function () {
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
      ViewBinding.setBusy(false);
      SiteController.display($('#site-list-online'), siteData);
    });
  },
  getByUserId: function (userId) {
    var offset = SiteOffline.sitePage * SiteOffline.limit;
    SiteOffline.fetchFieldsByUserId(userId, offset, function (sites) {
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
      site.name($("#updatesitename").val());
      site.lat($("#updatelolat").val());
      site.lng($("#updatelolng").val());
      var cId = App.DataStore.get("cId");
      FieldOffline.fetchByCollectionId(cId, function (fields) {
        var propertiesFile = {properties: {}, files: {}};
        fields.forEach(function (field) {
          propertiesFile = FieldController.updateFieldValueBySiteId(propertiesFile, field, "#update_", false);
        });
        site.properties(JSON.stringify(propertiesFile.properties));
        site.files(JSON.stringify(propertiesFile.files));
        persistence.flush();

        App.DataStore.clearPartlyAfterCreateSite();

        App.redirectTo("index.html#page-site-list");
      });
    });
  },
  updateBySiteIdOnline: function () {
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
        ViewBinding.setBusy(false);

        App.redirectTo("#page-site-list");
      }, function (err) {
        if (err["responseJSON"]) {
          ViewBinding.setBusy(false);
          var error = SiteHelper.buildSubmitError(err["responseJSON"], data["site"], false);
          SiteHelper.displayError("site/errorUpload.html", $('#page-error-submit-site'),
              error);
        }
      });
    });
  },
  renderUpdateSiteFormOffline: function () {
    var sId = App.DataStore.get("sId");
    SiteOffline.fetchBySiteId(sId, function (site) {
      var siteUpdateData = {
        name: site.name(),
        lat: site.lat(),
        lng: site.lng()
      };
      SiteController.displayUpdateLatLng("site/updateOffline.html",
          $('#div-site-update-name'), siteUpdateData);
      FieldController.renderUpdateOffline(site);
    });
  },
  renderUpdateSiteFormOnline: function () {
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
      SiteController.displayUpdateLatLng("site/updateOnline.html",
          $('#div-site-update-name-online'), siteOnlineUpdateData);
      FieldController.renderUpdateOnline(site);
    });
  },
  submitAllToServerByCollectionIdUserId: function () {
    if (App.isOnline()) {
      var cId = App.DataStore.get("cId");
      var uId = SessionController.currentUser().id;
      SiteOffline.countByCollectionIdUserId(cId, uId, function(totalOffline){
        SiteController.totalOffline = totalOffline;
        SiteController.processItem = 1;
        SiteController.processToServerByCollectionIdUserId();
      }); 
    }
    else{
      alert(i18n.t("global.no_internet_connection"));
    }
  },
  submitAllToServerByUserId: function () {
    if (App.isOnline()) {
      var uId = SessionController.currentUser().id;
      SiteOffline.countByUserId(uId, function(totalOffline){
        SiteController.totalOffline = totalOffline;
        SiteController.processItem = 1;
        SiteController.processToServerByUserId();
      });
    }
    else{
      alert(i18n.t("global.no_internet_connection"));
    }
  },
  processToServerByUserId: function(){
    var uId = SessionController.currentUser().id;
    SiteOffline.fetchOneByUserId(uId, function(site){
      if (site){
        SiteController.progressStatus(true);
        SiteController.processingToServer(site, function(){
          SiteController.processItem++;
          SiteController.processToServerByUserId();
        });
      }
      else{
        SiteController.progressStatus(false);
        App.redirectTo("#page-collection-list");
      }
    });
  },
  progressStatus: function(status) {
    ViewBinding.setBusy(status);
    if(status){
      var msg = "Progressing " + SiteController.processItem + " / " + SiteController.totalOffline;
      $('.ui-loader > h1').text(msg);
    }
  },
  processToServerByCollectionIdUserId: function () {
    var cId = App.DataStore.get("cId");
    var uId = SessionController.currentUser().id;
    SiteOffline.fetchOneByCollectionIdUserId(cId, uId, function(site){
      if(site){
        SiteController.progressStatus(true);
        SiteController.processingToServer(site, function() {
          SiteController.processItem++;
          SiteController.processToServerByCollectionIdUserId();
        });
      }
      else{
        SiteController.progressStatus(false);
        App.redirectTo("#page-collection-list");
      }
    });
  },
  processingToServer: function (site, callback) {
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
      callback();
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
        if ($field.length > 0 && $field[0].tagName.toLowerCase() == 'img') {
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
        else if ($field.length > 0 && $field[0].getAttribute("type") === 'date') {
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
