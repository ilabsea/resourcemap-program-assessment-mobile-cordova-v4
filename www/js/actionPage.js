App.initialize();
App.onDeviceReady();
$(function() {
    $(document).delegate('#submitLogin-page', 'pagebeforeshow', function() {
        getCollection();
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
    $(document).delegate('#page-site-list li', 'taphold', function() {
        var sId = $(this).attr("data-id");
        localStorage.setItem("sId", sId);
        deleteSiteBySiteId(sId);
//        $("#page-delete-site").popup();
    });
    $(document).delegate('#delete-site', 'click', function() {
        var sId = localStorage.getItem("sId");
        deleteSiteBySiteId(sId);
    });
    $(document).delegate('#page-list-view-site', 'pagebeforeshow', function() {
        App.userId = localStorage.getItem("userId");
        getSiteByUserId(App.userId);
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
    $(document).delegate('#page-create-site', 'pagebeforeshow', function() {
        getFieldsCollection();
        navigator.geolocation.getCurrentPosition(function(pos) {
            var lat = pos.coords.latitude;
            var lng = pos.coords.longitude;
            $("#lat").val(lat);
            $("#lng").val(lng);
            $("#mark_lat").val(lat);
            $("#mark_lng").val(lng);
        });
    });
    $(document).delegate('#create-icon-map', 'click', function() {
        $("#updateLatLng_map").hide();
    });
    $(document).delegate('#btn_sendToServer', 'click', function() {
        cId = localStorage.getItem("cId");
        sendSiteToServer("collection_id", cId);
    });
    $(document).delegate('#btn_sendToServerAll', 'click', function() {
        App.userId = localStorage.getItem("userId");
        sendSiteToServer("user_id", App.userId);
    });
    $(document).delegate('#page-update-site', 'pagebeforeshow', function() {
        sId = localStorage.getItem("sId");
        getSiteBySiteId(sId);
    });
    $(document).delegate('#btn_submitUpdateSite', 'click', function() {
        sId = localStorage.getItem("sId");
        updateSiteBySiteId(sId);
        location.href = "#page-site-list";
    });
    $(document).delegate('#update_icon_map', 'click', function() {
        $("#mark_lat").val($("#updatelolat").val());
        $("#mark_lng").val($("#updatelolng").val());
        $("#updateLatLng_map").show();
    });
    $(document).delegate('#updateLatLng_map', 'click', function() {
        sId = localStorage.getItem("sId");
        updateLatLngBySiteId(sId);
    });
    $(document).delegate('#page-map', 'pageshow', function() {
        var lat = $("#mark_lat").val();
        var lng = $("#mark_lng").val();
        var latlng = new google.maps.LatLng(lat, lng);
        var options = {
            zoom: 15,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        var $content = $("#map_canvas");
        $content.height(screen.height - 50);
        var map = new google.maps.Map($content[0], options);
        $.mobile.changePage($("#page-map"));
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: latlng,
            draggable: true
        });
        google.maps.event.addListener(marker, 'dragend', function() {
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            $("#updatelolat").val(lat);
            $("#updatelolng").val(lng);
            $("#lat").val(lat);
            $("#lng").val(lng);
            $("#mark_lat").val(lat);
            $("#mark_lng").val(lng);
        });
        var markerBounds = new google.maps.LatLngBounds();
        markerBounds.extend(latlng);
        map.fitBounds(markerBounds);
        google.maps.event.trigger(map_canvas, 'resize');
    });   
     $(document).delegate('#kh', 'click', function() {
         var kh = $(this).attr("id");
         localStorage.setItem("kh", kh);
         alert(kh);
         setLang(kh);
    });
});