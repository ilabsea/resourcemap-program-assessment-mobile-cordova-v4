function dateToParam(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    if (mm < 10) { mm = '0' + mm; }
    var yyyy = date.getFullYear();
    return  mm + "/" + dd + "/" + yyyy;
}
function convertDateWidgetToParam(format){
   var items =  format.split("-");
   return items[1]+ "/" + items[2] + "/" + items[0];
}

function originalDateFormat(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    if (mm < 10) { mm = '0' + mm; }
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

function  getSiteByUserId(id) {
    $("#offlinesite-list").hide();
    Site.all().filter('user_id', '=', id).list(function(sites) {
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
        var params = {};
        params["name"] = ($("#updatesitename").val());
        params["lat"]  = ($("#updatelolat").val());
        params["lng"]  = ($("#updatelolng").val());
        queryFieldByCollectionIdOffline(function(fields) {
            var properties = {};
            var files = {};
            fields.forEach(function(field) {
                var item = buildField(field, {fromServer: false});
                if (item.isPhoto) {
                    var idfield = item["idfield"];
                    for (var i = 0; i < PhotoList.getPhotos().length; i++) {
                        if (PhotoList.getPhotos()[i].id === idfield) {
                            var fileName = PhotoList.getPhotos()[i].name();
                            properties[idfield] = fileName;
                            files[fileName] = PhotoList.getPhotos()[i].data;
                            break;
                        }
                    }
                }
                else if( item.widgetType === "date"){
                    var nodeId = "#update_" + item["idfield"];
                    var value = $(nodeId).val();
                    value = new Date(value);
                    value = dateToParam(value);
                    properties[item["idfield"]] = value;
                }
                else {
                    var nodeId = "#update_" + item["idfield"];
                    var value = $(nodeId).val();
                    properties[item["idfield"]] = value;
                }
            });
            
            params["properties"] = properties;          
            params["files"] = files;           
            updateSite(site,params);
            location.href = "#page-site-list";
        });
    });
}

function updateSite(site,dataParams){
    persistence.remove(site);
    persistence.flush();
     var params = {
         name : site.name(),
         lat : site.lat(),
         lng  : site.lng(),
         collection_id: site.collection_id(),
         collection_name:  site.collection_name(),
         user_id:  site.user_id(),
         created_at:  site.created_at(),     
         properties : site.properties(),
         files: site.files()
     };
    params = overideProperty(params, dataParams);
    var newSite = new Site(params);
    persistence.add(newSite);
    persistence.flush();
}

function overideProperty(params, dataParams){
    for (proName in dataParams){
        if(typeof dataParams[proName] === "object"){
            for(subProperty in dataParams[proName]){
               params[proName][subProperty]= dataParams[proName][subProperty];
            }
        }
        else 
            params[proName] = dataParams[proName];
    } 
    return params;
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
        alert("No internet found.");
}

function submitSiteServer(sites) {
    var cId = localStorage.getItem("cId");
    var site = sites[0];
    $(".loader").show();
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
        url: App.END_POINT + "/v1/collections/" + cId + "/sites?auth_token=" + getAuthToken(),
        type: "POST",
        data: data,
        crossDomain: true,
        datatype: 'json',
        success: function() {
            persistence.remove(site);
            persistence.flush();
            $(".loader").hide();
            $('#sendToServer').show();
            sites.splice(0, 1);
            if (sites.length === 0) {
                window.location.href = "#submitLogin-page";
            }
            else
                submitSiteServer(sites);
        },
        error: function(error) {
            alert("error");
        }
    });
}

function buildDataForSite() {
    var cId = localStorage.getItem("cId");
    var sname = $('#sitename').val();
    var slat = $('#lat').val();
    var slng = $('#lng').val();
    var storedFieldId = JSON.parse(localStorage["field_id_arr"]);
    var properties = {};
    var files = {};
    for (var i = 0; i < storedFieldId.length; i++) {
        var each_field = (storedFieldId[i]);
        $field = $('#' + (each_field));
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
            if(date){
                date = convertDateWidgetToParam(date);
                properties["" + each_field + ""] = date;
            }
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
    if (isOnline()) {
        addSiteOnline(data, resetSiteFormOnline);
    }
    else {
        addSiteOffline(data, resetSiteFormOffline);
    }
}

function resetSiteFormOnline() {
    alert("resetSiteFormOnline");
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
    var url = App.URL_SITE + cId + "/sites?auth_token=" +getAuthToken() ;
    $.ajax({
        url: url,
        type: "POST",
        data: {site: data},
        crossDomain: true,
        datatype: 'json',
        success: callback
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
    format: "png",
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
    alert("Photo");
    this.id = id;
    this.data = data;
    this.format = format || "png";
    this.name = function() {
        var date = new Date();
        return "" + date.getTime() + "_" + this.id + "." + this.format;
    };
}

SiteCamera = {
    dataWithMimeType: function(data) {
        return 'data:image/png;base64,' + data;
    },
    takePhoto: function(idField, updated) {
        alert("takePhoto");
        SiteCamera.id = idField;
        SiteCamera.updated = updated;
        navigator.camera.getPicture(SiteCamera.onSuccess, SiteCamera.onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType:      Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType:    Camera.EncodingType.PNG
        });
    },
    onSuccess: function(imageData) {
        var imageId = SiteCamera.updated ? "update_" + SiteCamera.id : SiteCamera.id;
        var image = document.getElementById(imageId);
        var photo = new Photo(SiteCamera.id, imageData);
        image.src = SiteCamera.dataWithMimeType(imageData);
        PhotoList.add(photo);
    },
    onFail: function() {
        alert("Failed");
    }
};