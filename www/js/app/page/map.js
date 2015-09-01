$(function () {

  $(document).delegate('#icon_map', 'click', function () {
    $("#mark_lat").val($("#lat").val());
    $("#mark_lng").val($("#lng").val());
    localStorage['no_update_reload'] = 1;
  });

  $(document).delegate('#btn_back_map', 'click', function () {
    FieldController.renderLocationField();
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