SiteController = {
  safe: false,
  isOnline: true,
  id: null,

  setEntryDate: function () {
    var start_entry_date = new Date().toISOString();
    $("#start_entry_date").val(start_entry_date);
  },

  display: function (element, siteData) {
    var content = App.Template.process("site_list", siteData);
    element.append(content);
    element.listview("refresh");
  },

  displayUpdateLatLng: function (templateURL, element, siteUpdateData) {
    var content = App.Template.process(templateURL, siteUpdateData);
    element.html(content);
    element.trigger("create");
  },

  validate: function(){
    var $site = $("#site_name");
    if($site.val().trim() == ""){
      $site.addClass("error");
      return false;
    }
    else
      $site.removeClass("error")

    var valid = FieldController.validateLayers()
    return valid;

  },

  render: function () {
    SiteController.renderOffline();
    if (App.isOnline()) {
      SiteController.renderOnline();
      MyMembershipController.getMembershipByCollectionId();
    }
  },

  renderOffline: function () {
    var collectionId = CollectionController.id;
    var uId = UserSession.getUser().id;
    var offset = SiteOffline.sitePage * SiteOffline.limit;
    SiteOffline.fetchByCollectionIdUserId(collectionId, uId, offset, function (sites) {
      var result = [];
      sites.forEach(function (site) {
        var fullDate = dateToParam(site.created_at);
        result.push({
          id: site.id,
          name: site.name,
          collectionName: "offline",
          date: fullDate,
          link: "#page-save-site"
        });
      });

      SiteOffline.countByCollectionIdUserId(collectionId, uId, function (count) {
        var siteLength = sites.length + offset;
        var hasMoreSites = false;
        if (siteLength < count) {
          hasMoreSites = true;
        }
        var sitesRender = {
          hasMoreSites: hasMoreSites,
          state: "offline",
          siteList: result };
        SiteController.display($('#site-list'), sitesRender);
      });
    });
  },

  renderOnline: function () {
    var collectionId = CollectionController.id;
    var offset = SiteModel.sitePage * SiteModel.limit;
    SiteModel.fetch(collectionId, offset, function (response) {
      var result = [];
      $.each(response["sites"], function (_, data) {
        var date = data.created_at;
        date = new Date(date);
        date = dateToParam(date);
        var item = {id: data.id,
          name: data.name,
          collectionName: "",
          date: date,
          link: "#page-save-site"
        };
        result.push(item);
      });
      var hasMoreSites = false;
      var siteLength = response["sites"].length + offset;
      if (siteLength < response["total"]) {
        hasMoreSites = true;
      }
      var siteData = {
        hasMoreSites: hasMoreSites,
        state: "online",
        siteList: result };
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
          link: "#page-save-site"
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

  deleteBySiteId: function () {
    SiteOffline.deleteBySiteId(this.id, function(){
      SiteController.redirectSafe("#page-site-list")
    });
  },

  validate: function(){
    var items = ['site_name', 'site_lat', 'site_lng']
    var valid = true;
    $.each(items, function(_, item){
      var $elm = $("#" + item)
      var value = $.trim($elm.val())
      if(value == "")
        valid = false

      value == "" ? $elm.addClass('error') : $elm.removeClass("error")
    })
    return valid;
  },

  save: function () {
    var $btn = $("#btn_save_site");
    var label = $btn.text();
    $btn.text(i18n.t('global.validating'));
    var valid = this.validate() && FieldController.validateLayers()

    if(!valid) {
      $btn.text(label)
      return false;
    }
    $btn.text(i18n.t('global.saving'))

    if(this.id)
      FieldController.isOnline ? this.updateOnline() : this.updateOffline() ;
    else
      FieldController.isOnline ? this.addOnline() : this.addOffline();
  },

  params: function() {
    var params = FieldController.params()
    return  {
      "name": $("#site_name").val(),
      "lat": $("#site_lat").val(),
      "lng": $("#site_lng").val(),
      "collection_id": CollectionController.id,
      "collection_name": CollectionController.name,
      "start_entry_date": $("#start_entry_date").val(),
      "end_entry_date": new Date().toISOString(),

      "properties": params.properties,
      "files": params.files
    }
  },

  addOffline: function () {
    console.log("add offline");
    var data = this.params();
    SiteOffline.add();
    SiteController.cleanAndRedirectBack();
  },

  updateOffline: function () {
    console.log("update offline");
    SiteOffline.fetchBySiteId(this.id, function (site) {
      site.name = $("#updatesitename").val();
      site.lat = $("#updatelolat").val();
      site.lng = $("#updatelolng").val();

      var params = FieldController.params();

      site.properties = params.properties ;
      site.files = params.files;
      persistence.flush();

      ViewBinding.setBusy(false);
      SiteController.redirectSafe("#page-site-list");

    });
  },

  addOnline: function () {
    console.log("add online");
    ViewBinding.setBusy(true)
    var data = this.params();
    delete data['collection_name']

    SiteModel.create(data, function(){
      ViewBinding.setBusy(false)
       SiteController.cleanAndRedirectBack();
    }, function () {
      ViewBinding.setBusy(false)
      ViewBinding.setAlert("Please send data again.");
    });
  },

  updateOnline: function () {
    console.log("update online");
    var cId = CollectionController.id;
    var sId = SiteController.id;
    var data = this.params();
    delete data['collection_name']

    data = {
      "_method": "put",
      "auth_token": App.Session.getAuthToken(),
      "rm_wfp_version": App.VERSION,
      "site": data
    }
    console.log("data: ", data);
    SiteModel.update(cId, sId, data, function () {
      ViewBinding.setBusy(false);
      SiteController.cleanAndRedirectBack()
    },
    function (err) {
      if (err["responseJSON"]) {
        var error = SiteHelper.buildSubmitError(err["responseJSON"], data["site"], false);
        SiteHelper.displayError("site_error_upload", $('#page-error-submit-site'),error);
      }
    });
  },

  renderNewSiteForm: function(){
    var siteUpdateData = {
      name: '',
      lat: '',
      lng: ''
    }
    $("#btn_save_site").text(i18n.t('global.save_site'));
    $("#btn_delete_site").hide();

    SiteController.displayUpdateLatLng("site_form", $('#div-site'), siteUpdateData);
    FieldController.renderNewSiteForm()
  },

  renderUpdateSiteFormOffline: function () {
    SiteOffline.fetchBySiteId(this.id, function (site) {
      var siteUpdateData = {
        name: site.name,
        lat: site.lat,
        lng: site.lng
      };
      SiteController.displayUpdateLatLng("site_form", $('#div-site'), siteUpdateData);
      FieldController.renderUpdateOffline(site);
    });
    $("#btn_save_site").text(i18n.translate('global.update'));
    $("#btn_delete_site").show();
  },

  renderUpdateSiteFormOnline: function () {
    var cId = CollectionController.id;
    var sId = SiteController.id;

    SiteModel.fetchOne(cId, sId, function (site) {
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

      SiteController.displayUpdateLatLng("site_form", $('#div-site'), siteOnlineUpdateData);
      FieldController.renderUpdateOnline(site);
    });

    $("#btn_save_site").text(i18n.t('global.update'))
    $("#btn_delete_site").hide();
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
    else{
      ViewBinding.setBusy(false);
      alert(i18n.t("global.no_internet_connection"));
    }
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
        else{
          ViewBinding.setBusy(false);
          alert('There is no site to submit');
        }
      });
    });
  },

  processToServerByCollectionIdUserId: function () {
    var collectionId = CollectionController.id;
    var uId = UserSession.getUser().id;
    var offset = 0;
    SiteOffline.limit = 7;
    SiteOffline.countByCollectionIdUserId(collectionId, uId, function(nbSites){
      SiteOffline.nbSites = nbSites;
      SiteOffline.fetchByCollectionIdUserId(collectionId, uId, offset, function(sites){
        if (sites.length > 0){
          SiteController.processingToServer(sites, true);
        }else{
          ViewBinding.setBusy(false);
          alert('There is no site to submit');
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
          ViewBinding.setBusy(false);
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

  updatePosition: function(lat, lng) {
    $("#site_lat").val(lat);
    $("#site_lng").val(lng);
  },

  cleanAndRedirectBack: function () {
    PhotoList.clear();
    SiteController.redirectSafe("#page-site-list");
  },

  redirectSafe: function(url){
    this.safe = true;
    App.redirectTo(url);
  }
};
