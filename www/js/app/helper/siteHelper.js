function dateToParam(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    if (mm < 10) {
        mm = '0' + mm;
    }
    var yyyy = date.getFullYear();
    return  mm + "/" + dd + "/" + yyyy;
}

function convertDateWidgetToParam(format) {
    var d;
    if (format.indexOf("-") !== -1) { //native HTML5 date
        var items = format.split("-");
        d = items[1] + "/" + items[2] + "/" + items[0];
        return d;
    }
    else if (format.indexOf("/") !== -1) { //native HTML5 date
        var items = format.split("/");
        d = items[2] + "-" + items[0] + "-" + items[1];
        return d;
    }
    else {
        return format;//unsported
    }
}

function originalDateFormat(date) {
    var dd = date.getDate();
    if (dd < 10) {
        dd = '0' + dd;
    }
    var mm = date.getMonth() + 1;
    if (mm < 10) {
        mm = '0' + mm;
    }
    var yyyy = date.getFullYear();
    return  yyyy + "-" + mm + "-" + dd;
}

function countSiteByUserId(id) {
    Site.all().filter('user_id', '=', id).count(null, function(count) {
        if (count == 0) {
            $('#btn_viewOfflineSite').hide();
        } else {
            $('#btn_viewOfflineSite').show();
        }
    });
}

function countSiteByCollectionId(id) {
    Site.all().filter('collection_id', '=', id).count(null, function(count) {
        if (count == 0) {
            $("#site-list-menu option[value='2']").attr('disabled', true);
            $("#site-list-menu").change();
        } else {
            $("#site-list-menu option[value='2']").removeAttr('disabled');
        }
        $("#site-list-menu").selectmenu("refresh", true);
    });
}

function buildDataForSite() {
    var cId = localStorage.getItem("cId");
    var sname = $('#sitename').val();
    var slat = $('#lat').val();
    var slng = $('#lng').val();
    var properties = {};
    var files = {};
    if (localStorage["field_id_arr"] != null) {
        var storedFieldId = JSON.parse(localStorage["field_id_arr"]);
        for (var i = 0; i < storedFieldId.length; i++) {
            var each_field = (storedFieldId[i]);
            $field = $('#' + (each_field));
            if ($field.length > 0 && $field[0].tagName.toLowerCase() == 'img') {
                var lPhotoList = PhotoList.getPhotos().length;
                for (var p = 0; p < lPhotoList; p++) {
                    var sId = localStorage.getItem("sId");
                    if (PhotoList.getPhotos()[p].id == each_field && PhotoList.getPhotos()[p].sId == sId) {
                        var fileName = PhotoList.getPhotos()[p].name();
                        properties[each_field] = fileName;
                        files[fileName] = PhotoList.getPhotos()[p].data;
                        break;
                    }
                }
            }
            else if ($field.length > 0 && $field[0].getAttribute("type") == 'date') {
                var date = $field.val();
                if (date) {
                    date = convertDateWidgetToParam(date);
                }
                properties["" + each_field + ""] = date;
            } else {
                var data = $field.val();
                if (data == null)
                    data = "";
                properties[each_field] = data;
            }
        }
    }
    var data = {collection_id: cId,
        name: sname,
        lat: slat,
        lng: slng,
        properties: properties,
        files: files
    };
    return data;
}

function resetSiteForm() {
    PhotoList.clear();
    location.href = "#page-site-list";
    $('#form_create_site ')[0].reset();
}