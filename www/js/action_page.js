App.initialize();
App.onDeviceReady();
$(function() {
  FastClick.attach(document.body);
  Translation.setLang(Translation.getLang());
  Translation.renderLang();

  $(document).delegate('#page-collection-list', 'pagebeforeshow', function() {
    App.emptyHTML();
    hideElement($("#info_sign_in"));
    CollectionController.get();
    var currentUser = SessionController.currentUser();
    SiteController.countByUserId(currentUser.id);
  });

  $(document).delegate('#page-collection-list li', 'click', function() {
    var cId = $(this).attr("data-id");
    App.DataStore.set("cId", cId);

    var cName = $(this).attr("data-name");
    App.DataStore.set("collectionName", cName);
    CollectionController.displayName({name: cName});
  });

  $(document).delegate('#page-site-list', 'pagebeforeshow', function() {
    $("#btn_sendToServer").hide();
    var cId = App.DataStore.get("cId");
    SiteController.countByCollectionId(cId);
    SiteController.getAllByCollectionId();
    $("#site-list-menu").get(0).selectedIndex = 0;
  });

  $(document).delegate('#btn_create_site', 'click', function() {
    FieldController.getByCollectionId();
    $('#form_create_site')[0].reset();
  });

  $(document).delegate('#page-site-list #site-list-online li', 'click', function() {
    var sId = $(this).attr("data-id");
    App.DataStore.set("sId", sId);
    requireReload(SiteController.renderUpdateSiteFormOnline);
  });

  $(document).delegate('#btn_delete-site', 'click', function() {
    var sId = App.DataStore.get("sId");
    SiteController.deleteBySiteId(sId);
  });

  $(document).delegate('#page-site-list-all', 'pagebeforeshow', function() {
    var currentUser = SessionController.currentUser();
    SiteController.getByUserId(currentUser.id);
  });

  $(document).delegate('#page-site-list-all', 'pageshow', function() {
    $("#offlinesite-list").show();
    $("#offlinesite-list").listview("refresh");
  });

  $(document).delegate('#page-site-list-all li', 'click', function() {
    var sId = $(this).attr("data-id");
    App.DataStore.set("sId", sId);
    $("#btn_back_site_list_all").show();
    $("#btn_back_site_list").hide();
    requireReload(SiteController.renderUpdateSiteFormOffline);
  });

  $(document).delegate('#btn_back_site_list', 'click', function() {
    var sId = App.DataStore.get("sId");
    for (var key in localStorage) {
      if (key.substring(0, sId.length) == sId)
        localStorage.removeItem(key);
    }
  });

  $(document).delegate('#btn_back_site_list_all', 'click', function() {
    var sId = App.DataStore.get("sId");
    for (var key in localStorage) {
      if (key.substring(0, sId.length) == sId)
        localStorage.removeItem(key);
    }
  });

  $(document).delegate('#btn_back_site_list_online', 'click', function() {
    var sId = App.DataStore.get("sId");
    for (var key in localStorage) {
      if (key.substring(0, sId.length) == sId)
        localStorage.removeItem(key);
    }
  });

  $(document).delegate('#logout', 'click', function() {
    SessionController.logout();
  });

  $(document).delegate('#create-icon-map', 'click', function() {
    $("#btn_back_create_site").show();
    $("#btn_back_update_site").hide();
    $("#btn_back_update_site_online").hide();
  });

  $(document).delegate('#btn_sendToServer', 'click', function() {
    var cId = App.DataStore.get("cId");
    SiteController.submitAllToServerByCollectionId("collection_id", cId);
  });

  $(document).delegate('#btn_sendToServerAll', 'click', function() {
    var currentUser = SessionController.currentUser();
    SiteController.submitAllToServerByUserId("user_id", currentUser.id);
  });

  $(document).delegate('#page-site-list #site-list li', 'click', function() {
    var sId = $(this).attr("data-id");
    App.DataStore.set("sId", sId);
    $("#btn_back_site_list_all").hide();
    $("#btn_back_site_list").show();
    requireReload(SiteController.renderUpdateSiteFormOffline);
  });

  function requireReload(callback) {
    if (localStorage['no_update_reload'] != undefined)
      localStorage.removeItem('no_update_reload');
    else {
      callback();
    }
  }

  $(document).delegate('#page-create-site', 'pagebeforeshow', function() {
    requireReload(function() {
      var lat = $("#lat").val();
      var lng = $("#lng").val();
      if (lat == "" && lng == "") {
        navigator.geolocation.getCurrentPosition(function(pos) {
          var lat = pos.coords.latitude;
          var lng = pos.coords.longitude;
          $("#lat").val(lat);
          $("#lng").val(lng);
          $("#mark_lat").val(lat);
          $("#mark_lng").val(lng);
        });
      }
    });
  });

  $(document).delegate('#update_icon_map', 'click', function() {
    $("#btn_back_create_site").hide();
    $("#btn_back_update_site_online").hide();
    $("#btn_back_update_site").show();
    $("#mark_lat").val($("#updatelolat").val());
    $("#mark_lng").val($("#updatelolng").val());
    localStorage['no_update_reload'] = 1;
  });

  $(document).delegate('#update_icon_map_online', 'click', function() {
    $("#btn_back_create_site").hide();
    $("#btn_back_update_site_online").show();
    $("#btn_back_update_site").hide();
    $("#mark_lat").val($("#updatelolat_online").val());
    $("#mark_lng").val($("#updatelolng_online").val());
    localStorage['no_update_reload'] = 1;
  });

  $(document).delegate('.validateSelectFields', 'change', function() {
    validateToRemoveStyle(this);
  });

  $(document).delegate('#page-map', 'pageshow', function() {
    mapObject.render();
  });

  $(document).delegate('.tree', 'click', function() {
    var $tree = $("#" + this.id);
    if ($tree.attr('require') === "required") {
      var node = $tree.tree('getSelectedNode');
      if (!node.id)
        $tree.css({"border": "1px solid red"});
      else
        $tree.css({"border": "1px solid #999999"});
    }
  });
});