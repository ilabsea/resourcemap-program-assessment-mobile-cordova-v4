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
    var currentUser = SessionHelper.currentUser();
    SiteOfflineController.getByUserId(currentUser.id);
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
        if ($(this).attr("id") === "btn_back_site_in_create")
          ValidationHelper.resetFormValidate("#form_create_site");
        PhotoList.clear();
        App.DataStore.clearAllSiteFormData();
        App.Cache.resetValue();
      });

  $(document).delegate('#page-site-list #site-list li', 'click', function () {
    var sId = $(this).attr("data-id");
    App.DataStore.set("sId", sId);
    $("#btn_back_site_list_all").hide();
    $("#btn_back_site_list").show();
    requireReload(SiteOfflineController.renderUpdateSiteForm);
  });

  $(document).delegate('#page-create-site', 'pagebeforeshow', function () {
    InvisibleLayer.invisibleNameLatLng("wrapSiteLocation", "wrapSiteName", function () {
      requireReload(function () {
        var lat = $("#lat").val();
        var lng = $("#lng").val();
        if (lat == "" && lng == "") {
          Location.getCurrentLocation();
        }
      });
    });
  });

  $(document).delegate("#user_autocomplete li, #site_autocomplete li", "click", function () {
    var text = $(this).text();
    var ul = $(this).closest("ul");
    var id = $(ul).attr("data-input");
    $(id).val(text);
    UserList.add(new UserField(id, text));
    ul.children().addClass('ui-screen-hidden');
  });

  $(document).delegate("#site_autocomplete li", "click", function () {
    var text = $(this).text();
    var ul = $(this).closest("ul");
    var id = $(ul).attr("data-input");
    $(id).val(text);
    ul.children().addClass('ui-screen-hidden');
    $(id + "_hidden").val(this.id);
  });

  $(document).delegate("#page-create-site, \n\
#page-update-site, \n\
#page-update-site-online", "pageshow", function () {

    var cId = App.DataStore.get("cId");
    var members = [];
    var sites = [];
    MembershipOffline.fetchByCollectionId(cId, function (results) {
      results.forEach(function (result) {
        members.push({user_email: result.user_email()});
      });
    });

    SiteModel.fetch(cId, function (results) {
      sites = results;
    });

    $(document).delegate("#user_autocomplete", "filterablebeforefilter", function (e, data) {
      var $ul = $(this),
          $input = $(data.input),
          value = $input.val();
      $ul.html("");
      var str = $ul.attr("data-input");
      var id = str.substring(1, str.length);
      var matches = $.map(members, function (member) {
        if (member.user_email.toUpperCase().indexOf(value.toUpperCase()) === 0) {
          return member;
        }
      });
      var match_value = "";

      if (value && value.length > 0) {
        if (matches.length === 0)
          ValidationHelper.AddClassUserError(id);
        else {
          match_value = matches[0].user_email;
          ValidationHelper.removeClassUserError(id);
        }
        AutoComplete.display("field/user.html", $ul, {members: matches});
      } else
        ValidationHelper.removeClassUserError(id);
      var idfield = id.substring(id.lastIndexOf('_')+1);
      UserList.add(new UserField(idfield, match_value));
    });

    $(document).delegate("#site_autocomplete", "filterablebeforefilter", function (e, data) {
      var $ul = $(this),
          $input = $(data.input),
          value = $input.val();
      $ul.html("");
      if (value && value.length > 2) {
        AutoComplete.display("field/site.html", $ul, sites);
      }
    });
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

  function requireReload(callback) {
    if (localStorage['no_update_reload'] != undefined)
      localStorage.removeItem('no_update_reload');
    else {
      callback();
    }
  }
}
);