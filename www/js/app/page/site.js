$(function () {

  $(document).delegate('#page-site-list', 'pagebeforeshow', function () {
    $("#btn_sendToServer").hide();
    var cId = App.DataStore.get("cId");
    SiteOfflineController.countByCollectionId(cId);
    SiteController.getAllByCollectionId();
    $("#site-list-menu").get(0).selectedIndex = 0;
  });

  $(document).delegate('#btn_create_site', 'click', function () {
    FieldController.getByCollectionId();
    $('#form_create_site')[0].reset();
  });

  $(document).delegate('#page-create-site', 'pageshow', function () {
    SiteController.setEntryDate();
  });

  $(document).delegate('#page-site-list #site-list-online li', 'click', function () {
    var sId = $(this).attr("data-id");
    App.DataStore.set("sId", sId);
    requireReload(SiteOnlineController.renderUpdateSiteForm);
  });

  $(document).delegate('#btn_delete-site', 'click', function () {
    var sId = App.DataStore.get("sId");
    SiteOfflineController.deleteBySiteId(sId);
  });

  $(document).delegate('#page-site-list-all', 'pagebeforeshow', function () {
    var currentUser = SessionController.currentUser();
    SiteController.getByUserId(currentUser.id);
  });

  $(document).delegate('#page-site-list-all', 'pageshow', function () {
    $("#offlinesite-list").show();
    $("#offlinesite-list").listview("refresh");
  });

  $(document).delegate('#page-site-list-all li', 'click', function () {
    var sId = $(this).attr("data-id");
    App.DataStore.set("sId", sId);
    $("#btn_back_site_list_all").show();
    $("#btn_back_site_list").hide();
    requireReload(SiteOfflineController.renderUpdateSiteForm);
  });

  $(document).delegate(
      '#btn_back_site_in_create , #btn_back_site_list_online , \n\
#btn_back_site_list_all , #btn_back_site_list', 'click', function () {
        App.DataStore.clearConfig("configNumberSkipLogic");
        App.DataStore.clearConfig("configNumber");
        App.DataStore.clearConfig("configSelectManyForSkipLogic");
        App.DataStore.clearConfig("configLocations");
      });

  $(document).delegate('#page-site-list #site-list li', 'click', function () {
    var sId = $(this).attr("data-id");
    App.DataStore.set("sId", sId);
    $("#btn_back_site_list_all").hide();
    $("#btn_back_site_list").show();
    requireReload(SiteOfflineController.renderUpdateSiteForm);
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