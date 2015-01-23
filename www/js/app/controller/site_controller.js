SiteController = {
  display: function (element, siteData) {
    App.Template.process("site/list.html", siteData, function (content) {
      element.html(content);
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
    if (App.isOnline())
      SiteController.getByCollectionIdOnline();
  },
  getByCollectionIdOffline: function () {
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
      });
      SiteController.display($('#site-list'), {siteList: siteData});
    });
  },
  getByCollectionIdOnline: function () {
    var cId = App.DataStore.get("cId");
    SiteModel.fetch(cId, function (response) {
      var siteOnlineData = [];
      $.each(response["sites"], function (key, data) {
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
        if (key === response["total"] - 1) {
          SiteController.display($('#site-list-online'), {siteList: siteOnlineData});
        }
      });
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
      SiteController.display($('#offlinesite-list'), {siteList: siteofflineData});
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
        site.properties(propertiesFile.properties);
        site.files(propertiesFile.files);
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
      $.each(fields, function (key, field) {
        propertiesFile = FieldController.updateFieldValueBySiteId(propertiesFile, field, "#update_online_", true);
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
      SiteModel.update(data, function () {
        var sId = App.DataStore.get("sId");
        $.each(data.site.properties, function (key, idField) {
          PhotoList.remove(sId, key);
        });

        App.DataStore.clearPartlyAfterCreateSite();

        App.redirectTo("#page-site-list");
      }, function () {
        alert(i18n.t("global.please_reupdate_your_site"));
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
      SiteController.displayUpdateLatLng("site/updateOffline.html", $('#div-site-update-name'), siteUpdateData);
      FieldController.renderUpdateOffline(site);
    });
  },
  renderUpdateSiteFormOnline: function () {
    ViewBinding.setBusy(true);
    SiteModel.fetchOne(function (response) {
      var siteOnlineUpdateData = {
        name: response.name,
        lat: response.lat,
        lng: response.long
      };
      SiteController.displayUpdateLatLng("site/updateOnline.html", $('#div-site-update-name-online'), siteOnlineUpdateData);
      FieldController.renderUpdateOnline(response);
    });
  },
  submitAllToServerByCollectionId: function () {
    var cId = App.DataStore.get("cId");
    SiteController.processToServer("collection_id", cId);
  },
  submitAllToServerByUserId: function () {
    var currentUser = SessionController.currentUser();
    SiteController.processToServer("user_id", currentUser.id);
    ;
  },
  processToServer: function (key, id) {
    if (App.isOnline()) {
      Site.all().filter(key, "=", id).list(function (sites) {
        if (sites.length > 0)
          SiteController.processingToServer(sites);
      });
    }
    else
      alert(i18n.t("global.no_internet_connection"));
  },
  processingToServer: function (sites) {
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
    SiteModel.create(data["site"], function () {
      persistence.remove(site);
      persistence.flush();
      $('#sendToServer').show();
      sites.splice(0, 1);
      if (sites.length === 0)
        App.redirectTo("#page-collection-list");
      else
        SiteController.processingToServer(sites);
    }, function () {
      showElement($("#info_sign_in"));
      App.redirectTo("#page-login");
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
  },
  buildDataForSite: function () {
    var cId = App.DataStore.get("cId");
    var sname = $('#sitename').val();
    var slat = $('#lat').val();
    var slng = $('#lng').val();
    var properties = {};
    var files = {};
    var field_id_arr = App.DataStore.get("field_id_arr");
    if (field_id_arr != null) {
      var storedFieldId = JSON.parse(field_id_arr);
      for (var i = 0; i < storedFieldId.length; i++) {
        var each_field = storedFieldId[i];
        $field = $('#' + each_field);
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
          if (date) {
            date = convertDateWidgetToParam(date);
          }
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
          var data = $field.val();
          if (data == null)
            data = "";
          properties[each_field] = data;
        }
      }
    }
    var data = {
      collection_id: cId,
      name: sname,
      lat: slat,
      lng: slng,
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