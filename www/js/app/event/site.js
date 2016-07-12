$(document).on("mobileinit", function() {
  $(document).delegate('#page-site-list', 'pageshow', function () {
    resetRightMenuItem();
    App.emptyHTML();
    App.validateDbConnection(function() {
      SiteModel.sitePage = 0;
      SiteOffline.sitePage = 0;
      SiteController.render();
    });
  });

  $(document).delegate('#btn_create_site', 'click', function () {
    MyMembershipObj.setSite("");
    SiteController.id = null;
    SiteController.renderNewSiteForm();
  });

  $(document).delegate('#page-site-list #site-list-online', 'click', function (event) {
    App.checkNodeTargetSuccess(event.target, function(a) {
      var li = a.parentNode;
      var sId = li.getAttribute('data-id');
      if (sId == "load-more-site-online") {
        li.remove()
        SiteModel.sitePage++;
        SiteController.getByCollectionIdOnline();
      }
      else {
        SiteController.id = sId;
        requireReload(SiteController.renderUpdateSiteFormOnline);
      }
    })
  });

  $(document).delegate('#page-save-site', 'pageshow', function () {
    if(SiteController.type){
      $("#btn_back_site_list_all").show();
      $("#btn_back_site_list").hide();
    }
    else{
      $("#btn_back_site_list_all").hide();
      $("#btn_back_site_list").show();
    }

    App.validateDbConnection(function() {
      SiteController.setEntryDate();
    });
  });

  $(document).delegate('#page-site-list #site-list', 'click', function (event) {
    SiteController.type=''

    App.checkNodeTargetSuccess(event.target, function(a) {
      var li = a.parentNode;
      var sId = li.getAttribute('data-id');
      if (sId == "load-more-site-offline") {
        li.remove()
        SiteOffline.sitePage++;
        SiteController.getByCollectionIdOffline();
      }
      else {
        SiteController.id = sId;
        requireReload(SiteController.renderUpdateSiteFormOffline);
      }
    })
  });

  $(document).delegate('#btn_delete_site', 'click', function () {
    if(confirm("Are you sure you want to delete the site?")) {
      SiteController.deleteBySiteId();
    }
  });

  $(document).delegate('#page-site-list-all', 'click', function (event) {
    SiteController.type = 'all'

    App.checkNodeTargetSuccess(event.target, function(a) {
      var li = a.parentNode;
      var sId = li.getAttribute('data-id');
      if (sId == "load-more-site-all") {
        li.remove()
        SiteOffline.sitePage++;
        SiteController.getByUser();
      }
      else {
        SiteController.id = sId;
        requireReload(SiteController.renderUpdateSiteFormOffline);
      }
    })
  });

  $(document).delegate('#page-site-list-all', 'pagebeforeshow', function () {
    App.emptyHTML();
    SiteOffline.sitePage = 0;
    App.validateDbConnection(function() {
      SiteController.getByUser();
    });
  });

  $(document).delegate('#site_name, #site_lat, #site_lng', 'change', function () {
    $(this).val() == "" ? $this.addClass('error') : $this.removeClass("error");
  });

  $(document).delegate('#site_lat, #site_lng', 'change', function () {
    var lat = $("#site_lat").val();
    var lng = $("#site_lng").val();
    FieldController.updateLocationField(lat, lng);
  });
})

function submitSiteForm() {
  $('#btn_save_site').on('click', function() {
    SiteController.save()
  })
}

//reset the right menu bar
function resetRightMenuItem(){
  $("#site-list-menu").get(0).selectedIndex = 0;
  SiteList.menu();
}

$(function(){
  submitSiteForm();
});
