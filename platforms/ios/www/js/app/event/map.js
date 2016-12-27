$(document).on("mobileinit", function() {

  $(document).delegate('#icon_map', 'click', function () {
    $("#mark_lat").val($("#site_lat").val());
    $("#mark_lng").val($("#site_lng").val());
    // localStorage['no_update_reload'] = 1;
  });

  $(document).delegate('#btn_back_save_site', 'click', function () {
    var lat = $("#mark_lat").val();
    var lng = $("#mark_lng").val()
    SiteController.updatePosition(lat, lng)
    FieldController.updateLocationField(lat, lng);
  });


  $(document).delegate('#page-map', 'pageshow', function () {
    if (App.isOnline()) {
      mapObject.render();
      $(window).on('resize', function () {
        if ($.mobile.activePage.is("#page-map"))
          mapObject.setHeightContent();
      });
    }
  });

});
