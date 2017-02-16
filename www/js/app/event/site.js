$(document).on("mobileinit", function() {
  $(document).delegate('#page-site-list', 'pageshow', function () {

    App.emptyHTML();

    var $menu = $("#site-list-menu");
    if($menu.length > 0){
      $menu[0].selectedIndex = 1;
      $menu.selectmenu("refresh");
    }
    $("#offline-wrapper").hide();

    App.validateDbConnection(function() {
      SiteModel.sitePage = 0;
      SiteOffline.sitePage = 0;

      SiteController.currentPage = '#page-site-list'
      SiteController.render();
    });
  });

  $(document).delegate('#btn_create_site', 'click', function () {
    MyMembershipObj.setSite("");
    SiteController.id = null;

    $("#btn_save_site").text(i18n.t('global.save_site'));
    $("#btn_delete_site").hide();
    $("#ui-site-menu").hide();

    SiteController.renderNewSiteForm();
  });

  $(document).delegate('#page-site-list #site-list-online li', 'click', function (event) {
      var li = this;
      var sId = li.getAttribute('data-id');
      var cId = li.getAttribute('data-collection-id');
      if (sId == "load-more-site-list") {
        SiteModel.sitePage++;
        SiteController.renderOnline();
        $(li).remove()
      }
      else {
        CollectionController.id = cId;
        SiteController.id = sId;
        $("#btn_save_site").text(i18n.t('global.update'))
        $("#btn_delete_site").hide();
        $("#ui-site-menu").show();
        App.redirectTo(li.getAttribute('data-href'));
        SiteController.renderUpdateSiteFormOnline();
      }
  });

  $(document).delegate('#page-save-site', 'pageshow', function () {
    if(SiteController.currentPage == '#page-site-list-all'){
      $("#btn_back_site_list_all").show();
      $("#btn_back_site_list").hide();
    }
    else{
      $("#btn_back_site_list_all").hide();
      $("#btn_back_site_list").show();
    }
  });

  $(document).delegate('#page-site-list #site-list-offline li .btn_view_site', 'click', function (event) {
      var li = this;
      var sId = li.getAttribute('data-id');
      var cId = li.getAttribute('data-collection-id')
      if (sId == "load-more-site-list") {
        SiteOffline.sitePage++;
        SiteController.renderOffline();
        $(li).parent().remove();
      }
      else {
        CollectionController.id = cId;
        SiteController.id = sId;
        $("#btn_save_site").text(i18n.translate('global.update'));
        $("#btn_delete_site").show();
        $("#ui-site-menu").hide();

        App.redirectTo(li.getAttribute('data-href'));
        SiteController.renderUpdateSiteFormOffline();
      }
  });

  $(document).delegate('.btn_select_site', 'click', function (event) {
    var siteId = $(this).attr('data-id');
    if ($(this).hasClass( "ui-icon-none" )){
      $(this).removeClass('ui-icon-none').addClass('ui-icon-check');
      $(this).attr('data-icon', 'check');
    }else{
      $(this).removeClass('ui-icon-check').addClass('ui-icon-none');
      $(this).attr('data-icon', 'none');
    }
  });

  $(document).delegate('#btn-confirm-delete-site', 'click', function () {
    this.href = SiteController.currentPage;
    SiteController.deleteOffline();
  });

  $(document).delegate('#page-site-list-all #site-list-offline-all li .btn_view_site', 'click', function (event) {
      var li = this;
      var sId = li.getAttribute('data-id');
      var cId = li.getAttribute('data-collection-id');
      if (sId == "load-more-site-list") {
        SiteOffline.sitePage++;
        SiteController.renderOfflineSites();
        $(li).parent().remove();
      }
      else {
        CollectionController.id = cId;
        SiteController.id = sId;
        $("#btn_save_site").text(i18n.t('global.update'))
        $("#btn_delete_site").show();
        $("#ui-site-menu").hide();

        App.redirectTo(li.getAttribute('data-href'))
        SiteController.renderUpdateSiteFormOffline();
      }
  });

  $(document).delegate('#page-site-list-all', 'pagebeforeshow', function () {
    App.emptyHTML();
    SiteOffline.sitePage = 0;
    App.validateDbConnection(function() {
      SiteController.currentPage = '#page-site-list-all'
      SiteController.renderOfflineSites();
    });
  });

  $(document).delegate('#site_name, #site_lat, #site_lng', 'change', function() {
    SiteController.validate()
  });

  $(document).delegate('#site_lat, #site_lng', 'change', function () {
    var lat = $("#site_lat").val();
    var lng = $("#site_lng").val();
    FieldController.updateLocationField(lat, lng);
  });

  $(document).delegate('#site-list-menu', 'change', function () {
    App.emptyHTML();
    var value = $('#site-list-menu').val();
    SiteController.renderByMenu(value);
  });


  $(document).delegate('#btn-send-server', 'click', function () {
    SiteController.sendToServer();
  });

  $(document).delegate('#btn-send-server-all', 'click', function () {
    SiteController.sendToServerAll();
  });

  $(document).on('pagebeforechange', function (event, data) {
    if(!$.mobile.activePage)
      return true;

    var currentPageId = $.mobile.activePage.attr('id')

    var redirect = false

    if(typeof data.toPage == 'string'  ){
       var changePage = data.toPage.indexOf(currentPageId) == -1
       var notSelectPopup = data.toPage.match(/(listbox|dialog|page-map)$/) == null

       var dirty = FieldController.layerDirty()

       var safe = SiteController.safe;

       if( currentPageId == "page-save-site" && changePage && notSelectPopup && dirty && !safe) {
         if(!confirm("Are you sure to leave this page")) {
           event.preventDefault();
           return false;
         }
         else
           FieldController.reset();
       }
       SiteController.safe = false
    }
  });

  $(document).delegate('#btn_save_site', 'click', function() {
    SiteController.save()
  });

  $(document).delegate('#btn-toggle-site, #btn-toggle-site-all', 'click', function() {
    $selectedSites = $('.btn_select_site');
    if($selectedSites.hasClass('ui-icon-none')){
      $(this).text(i18n.t('global.unselectAllSites'));
      $(this).removeClass('ui-icon-none').addClass('ui-icon-check');
      $selectedSites.removeClass('ui-icon-none').addClass('ui-icon-check');
    }else{
      $(this).text(i18n.t('global.selectAllSites'));
      $(this).removeClass('ui-icon-check').addClass('ui-icon-none');
      $selectedSites.removeClass('ui-icon-check').addClass('ui-icon-none');
    }
  });

})
