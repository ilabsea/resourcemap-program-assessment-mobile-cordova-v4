SiteController = {
  safe: false,
  isOnline: true,
  id: null,

  display: function (siteData, online) {
    var $element = online ? $('#site-list-online') : $('#site-list-offline')
    var content = App.Template.process("site_list", siteData);
    $element.append(content);
    $element.listview("refresh");
  },

  displayAllOffline: function(siteData){
    var $element = $('#site-list-offline-all')
    var content = App.Template.process("site_list", siteData);
    $element.append(content);
    $element.listview("refresh")
  },

  displayUpdateLatLng: function (siteData) {
    var $element = $('#div-site')
    var content = App.Template.process("site_form", siteData);
    $element.html(content);
    $element.trigger("create");
  },

  validate: function(){
    var valid = true;
    $.each(["site_name", "site_lat", "site_lng"], function(_, element) {
      var $element = $("#" + element);
      if($element.val() == "") {
        $element.addClass("error")
        valid = false;
      }
      else
        $element.removeClass("error")
    })
    return valid;
  },

  validateForm: function(){
    valid = SiteController.validate() && FieldController.validateLayers()
    if(!valid)
      showValidateMessage("#validation-save-site");
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
          collection_id: site.collection_id,
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
        var sitesData = {
          hasMoreSites: hasMoreSites,
          state: "offline",
          siteList: result };
        SiteController.display(sitesData, false);
      });
    });
  },

  renderOnline: function () {
    var collectionId = CollectionController.id;
    var offset = SiteModel.sitePage * SiteModel.limit;
    SiteModel.fetch(collectionId, offset, function (response) {
      var result = [];
      $.each(response["sites"], function (_, site) {
        var date = site.created_at;
        date = new Date(date);
        date = dateToParam(date);
        var item = {id: site.id,
          name: site.name,
          collectionName: "",
          collection_id: site.collection_id,
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
      var sitesData = {
        hasMoreSites: hasMoreSites,
        state: "online",
        siteList: result };
      SiteController.display(sitesData, true);
    });
  },

  renderOfflineSites: function () {
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
          collection_id: site.collection_id,
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
        var siteData = {
          hasMoreSites: hasMoreSites,
          state: "all",
          siteList: siteofflineData};
        SiteController.displayAllOffline(siteData);
      });
    });
  },

  deleteOffline: function () {
    var sId = SiteController.id;

    SiteOffline.deleteBySiteId(sId, function(){
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
    var valid = SiteController.validateForm()

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
    var data = {
      "name": $("#site_name").val(),
      "lat": $("#site_lat").val(),
      "lng": $("#site_lng").val(),
      "collection_id": CollectionController.id,
      "collection_name": CollectionController.name,
      "end_entry_date": new Date().toISOString(),
      "properties": params.properties,
      "files": params.files
    }

    return data;
  },

  addOffline: function () {
    var data = this.params();
    data["start_entry_date"] = this.startEntryDate
    SiteOffline.add(data);
    SiteController.cleanAndRedirectBack();
  },

  updateOffline: function () {
    var data = this.params();
    SiteOffline.fetchBySiteId(this.id, function (site) {
      site.name = data.name;
      site.lat = data.lat;
      site.lng = data.lng;
      site.properties = data.properties ;
      site.files = data.files;
      persistence.flush();
      SiteController.cleanAndRedirectBack();
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
    }, function (err) {
      SiteController.displayReqeustError(err);
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
      SiteController.displayReqeustError(err);
    });
  },

  displayReqeustError: function(err) {
    ViewBinding.setBusy(false)
    console.log("error: ", error);
    if (err["responseJSON"]) {
      var error = SiteHelper.buildSubmitError(err["responseJSON"], data["site"], false);
      SiteHelper.displayError("site_error_upload", $('#page-error-submit-site'),error);
    }
  },

  renderNewSiteForm: function(){
    this.startEntryDate = new Date().toISOString()
    var siteData = {
      name: '',
      lat: '',
      lng: ''
    }
    $("#btn_save_site").text(i18n.t('global.save_site'));
    $("#btn_delete_site").hide();

    SiteController.displayUpdateLatLng(siteData);
    FieldController.renderNewSiteForm()
  },

  renderUpdateSiteFormOffline: function () {
    var sId = SiteController.id;

    SiteOffline.fetchBySiteId(sId, function (site) {
      console.log("site: ", site);
      var siteData = {
        name: site.name,
        lat: site.lat,
        lng: site.lng
      };
      SiteController.displayUpdateLatLng(siteData);
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
      var siteData = {
        editable: (can_edit ? "" : "readonly"),
        name: site.name,
        lat: site.lat,
        lng: site.long
      };

      SiteController.displayUpdateLatLng(siteData);
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
      }
      else {
        var error = SiteHelper.buildSubmitError(err["responseJSON"], data["site"], true);
        SiteHelper.displayError("site_error_upload", $('#page-error-submit-site'), error);
      }
    });
  },

  renderByMenu: function(value){
    $("#btn_sendToServer").show();

    if(value == "View all"){
      SiteController.render();
    }

    else if (value == "View offline"){
      SiteOffline.sitePage = 0;
      SiteController.renderOffline();
      $("#btn_sendToServer").show();
    }

    else if (value =="View online") {
      SiteController.renderOnline();
      $("#btn_sendToServer").hide();
    }

    else if(value == "Logout" )
      SessionController.logout();
  },

  updatePosition: function(lat, lng) {
    $("#site_lat").val(lat);
    $("#site_lng").val(lng);
  },

  cleanAndRedirectBack: function () {
    SiteController.redirectSafe(SiteController.currentPage);
  },

  redirectSafe: function(url){
    this.safe = true;
    App.redirectTo(url);
  }
};
