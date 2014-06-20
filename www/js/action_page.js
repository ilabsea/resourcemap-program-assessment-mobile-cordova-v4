App.initialize();
App.onDeviceReady();
$(function() {
  Translation.setLang(Translation.getLang());
  Translation.renderLang();

  $(document).delegate('#submitLogin-page', 'pagebeforeshow', function() {
    App.emptyHTML();
    $("#info_sign_in").hide();
    getCollection();
    var currentUser = getCurrentUser();
    countSiteByUserId(currentUser.id);
    $('#form_create_site')[0].reset();
  });
  $(document).delegate('#submitLogin-page li', 'click', function() {
    var cId = $(this).attr("data-id");
    localStorage.setItem("cId", cId);
  });
  $(document).delegate('#page-site-list', 'pagebeforeshow', function() {
    cId = localStorage.getItem("cId");
    getSiteByCollectionId(cId);
  });
  $(document).delegate('#page-site-list', 'pageshow', function() {
    $("#site-list").listview("refresh");
  });
  $(document).delegate('#page-site-list li', 'click', function() {
    var sId = $(this).attr("data-id");
    localStorage.setItem("sId", sId);
  });
  $(document).delegate('#page-site-online li', 'click', function() {
    var sId = $(this).attr("data-id");
    localStorage.setItem("sId", sId);
  });
  $(document).delegate('#page-site-online', 'pagebeforeshow', function() {
    App.emptyHTML();
  });
  $(document).delegate('#page-site-online', 'pageshow', function() {
    getSiteByCollectionIdFromServer();
  });
  $(document).delegate('#page-update-site-online', 'pagebeforeshow', function() {
    requireReload(renderUpdateSiteFormFromServer);
  });
  $(document).delegate('#btn_submitUpdateSite_online', 'click', function() {
    updateSiteBySiteIdFromServer();
  });
  $(document).delegate('#btn_delete-site', 'click', function() {
    var sId = localStorage.getItem("sId");
    deleteSiteBySiteId(sId);
  });
  $(document).delegate('#page-list-view-site', 'pagebeforeshow', function() {
    var currentUser = getCurrentUser();
    getSiteByUserId(currentUser.id);
  });
  $(document).delegate('#page-list-view-site', 'pageshow', function() {
    $("#offlinesite-list").show();
    $("#offlinesite-list").listview("refresh");
  });
  $(document).delegate('#page-list-view-site li', 'click', function() {
    var sId = $(this).attr("data-id");
    localStorage.setItem("sId", sId);
  });
  $(document).delegate('#logout', 'click', function() {
    logout();
  });
  $(document).delegate('#submitLogin-page', 'pagebeforehide', function() {
    getFieldsCollection();
  });
  $(document).delegate('#create-icon-map', 'click', function() {
    $("#btn_back_create_site").show();
    $("#btn_back_update_site").hide();
    $("#btn_back_update_site_online").hide();
  });
  $(document).delegate('#btn_sendToServer', 'click', function() {
    cId = localStorage.getItem("cId");
    sendSiteToServer("collection_id", cId);
  });
  $(document).delegate('#btn_sendToServerAll', 'click', function() {
    var currentUser = getCurrentUser();
    sendSiteToServer("user_id", currentUser.id);
  });
  $(document).delegate('#page-update-site', 'pagebeforeshow', function() {
    requireReload(renderUpdateSiteForm);
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

  $(document).delegate('#btn_submitUpdateSite', 'click', function() {
    sId = localStorage.getItem("sId");
    updateSiteBySiteId(sId);
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
  $(document).delegate('#page-map', 'pageshow', function() {
    mapObject.render();
  });
});

function showSpinner() {
  $.mobile.activePage.addClass("ui-disabled");
  $.mobile.loading('show', {
    text: "Please wait...",
    textVisible: true,
    theme: "a",
    html: ""
  });
}
function hideSpinner() {
  $.mobile.loading('hide');
  $.mobile.activePage.removeClass("ui-disabled");
}
