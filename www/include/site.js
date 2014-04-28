function getSiteByCollectionId(id) {
    Site.all().filter('collection_id', "=", id).list(null, function(sites) {
        var siteData = {siteList: []};
        sites.forEach(function(site) {
            var dd = site.created_at().getDate();
            var mm = site.created_at().getMonth() + 1;
            var yyyy = site.created_at().getFullYear();
            var fullDate = mm + "/" + dd + "/" + yyyy;
            siteData.siteList.push({id: site.id, name: site.name(), date: fullDate});
        });
        var siteTemplate = Handlebars.compile($("#site-template").html());
        $('#site-list').html(siteTemplate(siteData));
        $('#site-list').listview("refresh");
    });
}

function  getSiteByUserId(id) {
    $("#offlinesite-list").hide();
    Site.all().filter('user_id', '=', id).list(function(sites) {
        var siteofflineData = {siteofflineList: []};
        sites.forEach(function(site) {
            var dd = site.created_at().getDate();
            var mm = site.created_at().getMonth() + 1;
            var yyyy = site.created_at().getFullYear();
            var fullDate = mm + "/" + dd + "/" + yyyy;
            siteofflineData.siteofflineList.push({id: site.id, name: site.name(), collectionName: site.collection_name(), date: fullDate});
        });
        var siteofflineTemplate = Handlebars.compile($('#siteoffline-template').html());
        $('#offlinesite-list').html(siteofflineTemplate(siteofflineData));
        $('#offlinesite-list').listview("refresh");
    });
}

function getSiteBySiteId(id) {
    Site.all().filter('id', "=", id).one(function(site) {
        var siteUpdateData = {name: site.name(), lat: site.lat(), lng: site.lng()};
        var siteUpdateTemplate = Handlebars.compile($("#site-update-template").html());
        $('#div-site-update-name').html(siteUpdateTemplate(siteUpdateData));
        $('#div-site-update-name').trigger("create");
        getFieldUpdateByFieldId(site.field_id());
    });
}

function updateSiteBySiteId(id) {
    Site.all().filter('id', "=", id).one(function(site) {
        site.name($("#updatesitename").val());
        site.lat($("#updatelolat").val());
        site.lng($("#updatelolng").val());
        var storedFieldId = JSON.parse(localStorage["field_id_arr"]);
        var fieldIdJSON = {};
        for (var i = 0; i < storedFieldId.length; i++) {
            var each_field = storedFieldId[i];
            var val_each_field = $('#update' + each_field).val();
            fieldIdJSON[each_field] = val_each_field;
        }
        site.field_id(fieldIdJSON);
        persistence.flush();
    });
}

function updateLatLngBySiteId(sId) {
    Site.all().filter('id', "=", sId).one(function(site) {
        site.lat($("#updatelolat").val());
        site.lng($("#updatelolng").val());
        persistence.flush();
        location.href = "#page-update-site";
    });
}

function deleteSiteBySiteId(sId) {
    Site.all().filter('id', "=", sId).one(null, function(site) {
        persistence.remove(site);
        alert("t");
        persistence.flush();
    });
}

function sendSiteToServer(key, id) {
    if (isOnline()) {
        Site.all().filter(key, "=", id).list(function(sites) {
            sites.forEach(function(site) {
                data = {site: {
                        collection_id: site.collection_id(),
                        name: site.name(),
                        lat: site.lat(),
                        lng: site.lng(),
                        properties: site.field_id()}
                };
                $.ajax({
                    url: App.URL_SITE + cId + "/sites?auth_token=" + storeToken(),
                    type: "POST",
                    data: data,
                    crossDomain: true,
                    datatype: 'json',
                    success: function(data) {
                        persistence.remove(site);
                        persistence.flush();
                        $('#sendToServer').show();
                    },
                    error: function(error) {
                        alert("err : " + error);
                    }
                });
            });
        });
    }
    else {
        alert("No internet found.");
    }
}

//==================================== Add site to Sever ====================================================

function buildDataForSite() {
    var cId = localStorage.getItem("cId");
    var sname = $('#sitename').val();
    var slat = $('#lat').val();
    var slng = $('#lng').val();
    var storedFieldId = JSON.parse(localStorage["field_id_arr"]);
    var properties = {};
    var files = {};
    for (var i = 0; i < storedFieldId.length; i++) {
        var each_field = storedFieldId[i];
        $field = $('#' + each_field);
        if ($field && $field[0].tagName.toLowerCase() === 'img') {
            for (var p = 0; p < PhotoList.getPhotos().length; p++) {
                if (PhotoList.getPhotos()[p].id === each_field) {
                    var fileName = PhotoList.getPhotos()[p].name();
                    properties[each_field] = fileName;
                    files[fileName] = PhotoList.getPhotos()[p].data;
                    break;
                }
            }
        }
        else if ($field && $field[0].getAttribute("type") === 'date') {
            var date = $field.val();
            date = new Date(date);
            date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            properties["" + each_field + ""] = date;
        } else {
            var data = $field.val();
            properties[each_field] = data;
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
    if (isOnline()){
        alert("online");
        addSiteOnline(data);
    }
    else {
        alert("offline");
        addSiteOffline(data);
        resetSiteForm();
    }
    PhotoList.clear();
}

function resetSiteForm() {
    window.location.href = "#page-site-list";
    $('#form_create_site ')[0].reset();
}

function addSiteOnline(data) {
    alert("addSite");
    var cId = localStorage.getItem("cId");
    var url = App.END_POINT + "/v1/collections/" + cId + "/sites?auth_token=" + storeToken();
    $.ajax({
        url: url,
        type: "POST",
        data: {site: data},
        crossDomain: true,
        datatype: 'json',
        success: function() {
            location.href = "#submitLogin-page";
        }
    });
}

function addSiteOffline(data) {
    App.userId = localStorage.getItem("userId");
    App.collectionName = localStorage.getItem("collectionName");
    var today = new Date();
    var siteParams = data;

    siteParams = {
        created_at: today,
        collection_name: App.collectionName,
        user_id: App.userId
    };

    var site = new Site(siteParams);
    persistence.add(site);
    persistence.flush();
}

PhotoList = {
    photos: [],
    format: "png",
    add: function(id, data) {
        photo = new Photo(id, data);
        PhotoList.remove(id);
        PhotoList.photos.push(photo);
    },
    remove: function(id) {
        for (var i = 0; i < PhotoList.count(); i++) {
            var photo = PhotoList.getPhotos()[i];
            if (photo.id == id) {
                return PhotoList.photo.splice(i, 1);
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
    this.format = format || "png";
    this.name = function() {
        return this.id + "." + this.format;
    };
}

SiteCamera = {
    takePhoto: function(idField) {
        SiteCamera.id = idField;
        navigator.camera.getPicture(SiteCamera.onSuccess, SiteCamera.onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: Camera.EncodingType.PNG
        });
    },
    onSuccess: function(imageData) {
        var image = document.getElementById(SiteCamera.id);
        image.src = 'data:image/png;base64,' + imageData;
        PhotoList.add(SiteCamera.id, imageData);

    },
    onFail: function() {
        alert("Failed");
    }
};
