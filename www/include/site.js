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
    if (format.indexOf("-") !== -1) { //native HTML5 date
        var items = format.split("-");
        return items[1] + "/" + items[2] + "/" + items[0];
    }
    else if(format.indexOf("/") !== -1) { //native HTML5 date
        var items = format.split("/");
        return items[2] + "-" + items[0] + "-" + items[1];
    }else{
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

function getSiteByCollectionId(id) {
    Site.all().filter('collection_id', "=", id).list(null, function(sites) {
        var siteData = {siteList: []};
        sites.forEach(function(site) {
            var fullDate = dateToParam(site.created_at());
            siteData.siteList.push({id: site.id, name: site.name(), date: fullDate});
        });
        var siteTemplate = Handlebars.compile($("#site-template").html());
        $('#site-list').html(siteTemplate(siteData));
        $('#site-list').listview("refresh");
    });
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

function  getSiteByUserId(id) {
    Site.all().filter('user_id', '=', id).list(null, function(sites) {
        var siteofflineData = {siteofflineList: []};
        sites.forEach(function(site) {
            var fullDate = dateToParam(site.created_at());
            var item = {id: site.id,
                name: site.name(),
                collectionName: site.collection_name(),
                date: fullDate};
            siteofflineData.siteofflineList.push(item);
        });
        var siteofflineTemplate = Handlebars.compile($('#siteoffline-template').html());
        $('#offlinesite-list').html(siteofflineTemplate(siteofflineData));
        $('#offlinesite-list').listview("refresh");
    });
}

function renderUpdateSiteForm() {
    var id = localStorage.getItem("sId");
    Site.all().filter('id', "=", id).one(function(site) {
        var siteUpdateData = {name: site.name(), lat: site.lat(), lng: site.lng()};
        var siteUpdateTemplate = Handlebars.compile($("#site-update-template").html());
        $('#div-site-update-name').html(siteUpdateTemplate(siteUpdateData));
        $('#div-site-update-name').trigger("create");
        renderFieldsBySite(site);
    });
}

function updateSiteBySiteId() {
    var id = localStorage.getItem("sId");
    Site.all().filter('id', "=", id).one(function(site) {
        site.name($("#updatesitename").val());
        site.lat($("#updatelolat").val());
        site.lng($("#updatelolng").val());
        queryFieldByCollectionIdOffline(function(fields) {
            var properties = {};
            var files = {};
            fields.forEach(function(field) {
                var item = buildField(field, {fromServer: false});
                if (item.isPhoto) {
                    var idfield = item["idfield"];
                    var lPhotoList = PhotoList.getPhotos().length;
                    if (lPhotoList == 0)
                        properties[idfield] = "";
                    else {
                        for (var i = 0; i < PhotoList.getPhotos().length; i++) {
                            if (PhotoList.getPhotos()[i].id == idfield) {
                                var fileName = PhotoList.getPhotos()[i].name();
                                properties[idfield] = fileName;
                                files[fileName] = PhotoList.getPhotos()[i].data;
                                break;
                            }
                        }
                    }
                }
                else if (item.widgetType === "date") {
                    var nodeId = "#update_" + item["idfield"];
                    var value = $(nodeId).val();
                    value = new Date(value);
                    value = dateToParam(value);
                    properties[item["idfield"]] = value;
                }
                else {
                    var nodeId = "#update_" + item["idfield"];
                    var value = $(nodeId).val();
                    if(value == null) value ="";
                    properties[item["idfield"]] = value;
                }
            });
            site.properties(properties);
            site.files(files);
            persistence.flush();
            location.href = "index.html#page-site-list";
        });
    });
}

function updateLatLngBySiteId(sId) {
    Site.all().filter('id', "=", sId).one(function(site) {
        site.lat($("#updatelolat").val());
        site.lng($("#updatelolng").val());
        persistence.flush();
    });
}

function deleteSiteBySiteId(sId) {
    Site.all().filter('id', "=", sId).one(function(site) {
        persistence.remove(site);
        persistence.flush();
        location.href = "#page-site-list";
    });
}

function sendSiteToServerByCollectiion() {
    var cId = localStorage.getItem("cId");
    sendSiteToServer("collection_id", cId);
}
function sendSiteToServerByUser() {
    var currentUser = getCurrentUser();
    sendSiteToServer("user_id", currentUser.id);
}

function sendSiteToServer(key, id) {
    if (isOnline()) {
        Site.all().filter(key, "=", id).list(function(sites) {
            if (sites.length > 0)
                submitSiteServer(sites);
        });
    }
    else
        alert("No internet connection.");
}

function submitSiteServer(sites) {
    var site = sites[0];
    showSpinner();
    var data = {site: {
            collection_id: site.collection_id(),
            name: site.name(),
            lat: site.lat(),
            lng: site.lng(),
            properties: site.properties(),
            files: site.files()
        }
    };
    $.ajax({
        url: App.END_POINT + "/v1/collections/" + site.collection_id() + "/sites?auth_token=" + getAuthToken(),
        type: "POST",
        data: data,
        crossDomain: true,
        datatype: 'json',
        success: function() {
            persistence.remove(site);
            persistence.flush();
            hideSpinner();
            $('#sendToServer').show();
            sites.splice(0, 1);
            if (sites.length === 0) {
                window.location.href = "#submitLogin-page";
            }
            else
                submitSiteServer(sites);
        },
        error: function(error) {
            hideSpinner();
            $("#info_sign_in").show();
            location.href = "#page-login";
        }
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
            else if ($field.length > 0 && $field[0].getAttribute("type") === 'date') {
                var date = $field.val();
                if (date) {
                    date = convertDateWidgetToParam(date);
                    properties["" + each_field + ""] = date;
                }
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

function  addSiteToServer() {
    var data = buildDataForSite();
    if (isOnline()) {
        addSiteOnline(data, resetSiteFormOnline);
    }
    else {
        addSiteOffline(data, resetSiteFormOffline);
    }
}

function resetSiteFormOnline() {
    hideSpinner();
    PhotoList.clear();
    location.href = "#submitLogin-page";
}

function resetSiteFormOffline() {
    PhotoList.clear();
    window.location.href = "#page-site-list";
    $('#form_create_site ')[0].reset();
}

function addSiteOnline(data, callback) {
    var cId = localStorage.getItem("cId");
    var url = App.END_POINT + "/v1/collections/" + cId + "/sites?auth_token=" + getAuthToken();
    showSpinner();
    $.ajax({
        url: url,
        type: "POST",
        data: {site: data},
        crossDomain: true,
        datatype: 'json',
        success: callback,
        error: function(error) {
            hideSpinner();
            alert("Please resend the data.");
        }
    });
}

function addSiteOffline(data, callback) {
    var collectionName = localStorage.getItem("collectionName");
    var today = new Date();
    var siteParams = data;
    siteParams["created_at"] = today;
    siteParams["collection_name"] = collectionName;
    siteParams["user_id"] = getCurrentUser().id;
    var site = new Site(siteParams);
    persistence.add(site);
    persistence.flush();
    callback();
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
function closeDialog(){
    $('#cameraDialog').dialog('close');
}

