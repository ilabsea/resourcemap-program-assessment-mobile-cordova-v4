$(function() {
  $(document).delegate('#create-icon-map', 'click', function() {
    $("#btn_back_create_site").show();
    $("#btn_back_update_site").hide();
    $("#btn_back_update_site_online").hide();
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