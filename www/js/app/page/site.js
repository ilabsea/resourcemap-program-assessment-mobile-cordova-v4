$(function () {

  $(document).delegate('#page-site-list', 'pageshow', function () {
    App.emptyHTML();
    $("#btn_sendToServer").hide();
    var cId = App.DataStore.get("cId");
    SiteOfflineController.countByCollectionId(cId);
    SiteModel.sitePage = 0;
    SiteOffline.sitePage = 0;
    SiteController.getAllByCollectionId();
    $("#site-list-menu").get(0).selectedIndex = 0;
  });

  $(document).delegate('#page-site-list', 'pagehide', function () {
    if ($.mobile.activePage.is("#page-create-site")) {
      ViewBinding.setBusy(true);
    }
  });

  $(document).delegate('#btn_create_site', 'click', function () {
    MyMembershipObj.setSite("");
    FieldController.getByCollectionId();
    $('#form_create_site')[0].reset();
  });

  $(document).delegate('#page-create-site', 'pageshow', function () {
    SiteController.setEntryDate();
  });

  $(document).delegate('#page-site-list #site-list-online li', 'click', function () {
    var sId = $(this).attr('data-id');
    if (sId == "load-more-site-online") {
      $("#" + sId).remove();
      SiteModel.sitePage++;
      SiteOnlineController.getByCollectionId();
    } else {
      App.DataStore.set("sId", sId);
      requireReload(SiteOnlineController.renderUpdateSiteForm);
    }
  });

  $(document).delegate('#page-site-list #site-list li', 'click', function () {
    var sId = $(this).attr('data-id');
    if (sId == "load-more-site-offline") {
      $("#" + sId).remove();
      SiteOffline.sitePage++;
      SiteOfflineController.getByCollectionId();
    } else {
      App.DataStore.set("sId", sId);
      $("#btn_back_site_list_all").hide();
      $("#btn_back_site_list").show();
      requireReload(SiteOfflineController.renderUpdateSiteForm);
    }
  });

  $(document).delegate('#page-site-list-all li', 'click', function () {
    var sId = $(this).attr('data-id');
    var uId = SessionController.currentUser().id;
    if (sId == "load-more-site-all") {
      $("#" + sId).remove();
      SiteOffline.sitePage++;
      SiteController.getByUserId(uId);
    } else {
      App.DataStore.set("sId", sId);
      $("#btn_back_site_list_all").show();
      $("#btn_back_site_list").hide();
      requireReload(SiteOfflineController.renderUpdateSiteForm);
    }
  });

  $(document).delegate('#btn_delete-site', 'click', function () {
    var sId = App.DataStore.get("sId");
    SiteOfflineController.deleteBySiteId(sId);
  });

  $(document).delegate('#page-site-list-all', 'pagebeforeshow', function () {
    App.emptyHTML();
    var currentUser = SessionController.currentUser();
    SiteOffline.sitePage = 0;
    SiteController.getByUserId(currentUser.id);
  });

  $(document).delegate(
      '#page-site-list , #page-collection-list , \n\
#page-site-list-all ', 'pageshow', function () {
        App.DataStore.clearConfig("configNumberSkipLogic");
        App.DataStore.clearConfig("configNumber");
        App.DataStore.clearConfig("configSelectManyForSkipLogic");
        App.DataStore.clearConfig("configLocations");
      });

  $(document).delegate('#updatelolat, #updatelolng', 'change', function () {
    FieldHelper.renderLocationField("#updatelolat", "#updatelolng", "update_");
  });

  $(document).delegate('#updatelolat_online, #updatelolng_online', 'change', function () {
    FieldHelper.renderLocationField("#updatelolat_online", "#updatelolng_online", "update_online_");
  });

  $(document).delegate('#lat, #lng', 'change', function () {
    FieldHelper.renderLocationField("#lat", "#lng", "");
  });
});