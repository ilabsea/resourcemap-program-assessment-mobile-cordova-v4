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

function displaySiteByCollectionIdFromServer(siteOnlineData) {
    var siteOnlineTemplate = Handlebars.compile($("#site-online-template").html());
    $('#site-list-online').html(siteOnlineTemplate({siteOnlineList: siteOnlineData}));
    $('#site-list-online').listview("refresh");
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
                if (lPhotoList == 0)
                    properties[each_field] = "";
                else {
                    for (var p = 0; p < lPhotoList; p++) {
                        if (PhotoList.getPhotos()[p].id == each_field) {
                            var fileName = PhotoList.getPhotos()[p].name();
                            properties[each_field] = fileName;
                            files[fileName] = PhotoList.getPhotos()[p].data;
                            break;
                        }
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

function updateFieldValueBySiteId(propertiesFile, field, idHTMLForUpdate, fromServer) {
    var pf = propertiesFile;
    if (fromServer)
        var itemLayer = buildField(field, {fromServer: fromServer});
    else
        var itemLayer = buildField(field._data, {fromServer: fromServer});
    
    var items = itemLayer.fields;
    $.each(items, function(i, item) {
        if (item.isPhoto) {
            var idfield = item["idfield"];
            var lPhotoList = PhotoList.getPhotos().length;
            if (lPhotoList == 0)
                propertiesFile.properties[idfield] = "";
            else {
                for (var i = 0; i < PhotoList.getPhotos().length; i++) {
                    if (PhotoList.getPhotos()[i].id == idfield) {
                        var fileName = PhotoList.getPhotos()[i].name();
                        propertiesFile.properties[idfield] = fileName;
                        propertiesFile.files[fileName] = PhotoList.getPhotos()[i].data;
                        break;
                    }
                }
            }
        }
        else if (item.widgetType === "date") {
            var nodeId = idHTMLForUpdate + item["idfield"];
            var value = $(nodeId).val();
            if (value != "") {
                value = new Date(value);
                value = dateToParam(value);
            }
            propertiesFile.properties[item["idfield"]] = value;
        }
        else {
            var nodeId = idHTMLForUpdate + item["idfield"];
            var value = $(nodeId).val();
            if (value == null)
                value = "";
            propertiesFile.properties[item["idfield"]] = value;
        }
    });
    return pf;
}

function resetSiteForm() {
    PhotoList.clear();
    location.href = "#page-site-list";
    $('#form_create_site ')[0].reset();
}

PhotoList = {
    photos: [],
    add: function(photo) {
        PhotoList.remove(photo.id);
        PhotoList.photos.push(photo);
    },
    remove: function(id) {
        for (var i = 0; i < PhotoList.count(); i++) {
            var photo = PhotoList.getPhotos()[i];
            if (photo.id === id) {
                return PhotoList.photos.splice(i, 1);
            }
        }
    },
    getPhotos: function() {
        return PhotoList.photos;
    },
    clear: function() {
        PhotoList.photos = [];
    },
    count: function() {
        return PhotoList.getPhotos().length;
    }
};

function Photo(id, data, format) {
    this.id = id;
    this.data = data;
    this.format = format;
    this.name = function() {
        var date = new Date();
        return "" + date.getTime() + "_" + this.id + "." + this.format;
    };
}

SiteCamera = {
    format: "jpeg",
    dataWithMimeType: function(data) {
        return 'data:image/jpeg;base64,' + data;
    },
    takePhoto: function(idField, updated, cameraType) {
        var type;
        if (cameraType == "camera") {
            type = Camera.PictureSourceType.CAMERA;
        }
        else {
            type = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        }
        SiteCamera.id = idField;
        SiteCamera.updated = updated;
        var cameraOptions = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: type,
            encodingType: Camera.EncodingType.JPEG
        };
        navigator.camera.getPicture(SiteCamera.onSuccess, SiteCamera.onFail, cameraOptions);
    },
    onSuccess: function(imageData) {
        var imageId = SiteCamera.imageId();
        var image = document.getElementById(imageId);
        var photo = new Photo(SiteCamera.id, imageData, SiteCamera.format);
        image.src = SiteCamera.dataWithMimeType(imageData);
        PhotoList.add(photo);

    },
    imageId: function() {
        return  (SiteCamera.updated == 'update') ? ("update_image_" + SiteCamera.id) : SiteCamera.id;
    },
    onFail: function() {
    }
};

function openCameraDialog(idField, updated) {
    $('#currentCameraImage').val(idField);
    $('#currentCameraImageType').val(updated);
    $.mobile.changePage("#cameraDialog", {role: "dialog"});
    localStorage['no_update_reload'] = 1;
}

function invokeCamera(cameraType) {
    var idField = $('#currentCameraImage').val();
    var updated = $('#currentCameraImageType').val();
    SiteCamera.takePhoto(idField, updated, cameraType);
    closeDialog();
}

function closeDialog() {
    $('#cameraDialog').dialog('close');
}