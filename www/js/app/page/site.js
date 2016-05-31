$(function () {
  $.mobile.defaultPageTransition = '';
  $.mobile.defaultDialogTransition = '';

  $(document).delegate('#page-site-list', 'pageshow', function () {
    App.emptyHTML()
    SiteModel.sitePage = 0;
    SiteOffline.sitePage = 0;
    SiteController.getAllByCollectionId();
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
      SiteController.getByCollectionIdOnline();
    }
    else {
      App.DataStore.set("sId", sId);
      requireReload(SiteController.renderUpdateSiteFormOnline);
    }
  });

  $(document).delegate('#page-site-list #site-list li', 'click', function () {
    var sId = $(this).attr('data-id');
    if (sId == "load-more-site-offline") {
      $("#" + sId).remove();
      SiteOffline.sitePage++;
      SiteController.getByCollectionIdOffline();
    }
    else {
      App.DataStore.set("sId", sId);
      $("#btn_back_site_list_all").hide();
      $("#btn_back_site_list").show();
      requireReload(SiteController.renderUpdateSiteFormOffline);
    }
  });

  $(document).delegate('#btn_delete-site', 'click', function () {
    var sId = App.DataStore.get("sId");
    SiteController.deleteBySiteId(sId);
  });

  $(document).delegate('#page-site-list-all li', 'click', function () {
    var sId = $(this).attr('data-id');
    var uId = UserSession.getUser().id;
    if (sId == "load-more-site-all") {
      $("#" + sId).remove();
      SiteOffline.sitePage++;
      SiteController.getByUser();
    }
    else {
      App.DataStore.set("sId", sId);
      $("#btn_back_site_list_all").show();
      $("#btn_back_site_list").hide();
      requireReload(SiteController.renderUpdateSiteFormOffline);
    }
  });

  $(document).delegate('#page-site-list-all', 'pagebeforeshow', function () {
    SiteOffline.sitePage = 0;
    App.emptyHTML();
    SiteController.getByUser();
  });

  var selector = '#page-site-list , #page-collection-list , #page-site-list-all';
  $(document).delegate(selector, 'pageshow', function () {
        App.DataStore.clearConfig("configNumberSkipLogic");
        App.DataStore.clearConfig("configNumber");
        App.DataStore.clearConfig("configSelectManyForSkipLogic");
        App.DataStore.clearConfig("configLocations");
  });

  $(document).delegate('#updatelolat, #updatelolng', 'change', function () {
    FieldController.renderLocationField("#updatelolat", "#updatelolng", "update_");
  });

  $(document).delegate('#updatelolat_online, #updatelolng_online', 'change', function () {
    FieldController.renderLocationField("#updatelolat_online", "#updatelolng_online", "update_online_");
  });

  $(document).delegate('#lat, #lng', 'change', function () {
    FieldController.renderLocationField("#lat", "#lng", "");
  });


});
