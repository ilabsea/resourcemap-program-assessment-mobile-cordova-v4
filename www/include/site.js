function addSite(cId, sname, slat, slng, properties) {
    App.userId = localStorage.getItem("userId");
    App.collectionName = localStorage.getItem("collectionName");
    var today = new Date();
    var siteParams = {
        name: sname,
        lat: slat,
        lng: slng,
        created_at: today,
        collection_id: cId,
        collection_name: App.collectionName,
        user_id: App.userId,
        field_id: properties
    };
    var site = new Site(siteParams);
    persistence.add(site);
    persistence.flush();
    window.location.href = "#page-site-list";
}

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
    var t;
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
    Site.all().filter('id', "=", sId).one(function(site) {
        persistence.remove(site);
        persistence.flush();
    });
}
//======================================= online Create site================================

function  addSiteToServer() {
    alert("not empty");
    var cId = localStorage.getItem("cId");
    var sname = $('#sitename').val();
    var slat = $('#lat').val();
    var slng = $('#lng').val();
    var storedFieldId = JSON.parse(localStorage["field_id_arr"]);
    var properties = {};
    for (var i = 0; i < storedFieldId.length; i++) {
        var each_field = storedFieldId[i];
        $field =  $('#' + each_field);
        if($field && $field[0].tagName.toLowerCase() === 'img'){
            alert("image data");
            if(window.imageDatas[each_field]){
                properties[ each_field] = window.imageMimeType + window.imageDatas[each_field]; 
                alert(properties[ each_field]);                
            }
        }
        else if($field.val()) {
           properties["" + each_field + ""] = $field.val();  
       }
    }
      if (isOnline()) {
        var data = {site: { collection_id: cId, 
                            name: sname,
                            lat: slat,
                            lng: slng,
                            properties: properties
            }}; 
        console.log("data: ", data);
        $.ajax({
            url: App.URL_SITE + cId + "/sites?auth_token=" + storeToken(),
            type: "POST",
            data: data,
            crossDomain: true,
            datatype: 'json',
            success: function(data) {
                console.log("data: " + data);
                alert("site has been saved.");
                location.href = "#submitLogin-page";
            },
            error: function(error) {
                for(prop in error)
                alert(error[prop]);
            }
        });
    }
    else {
        addSite(cId, sname, slat, slng, properties);
    }
    window.imageDatas = {};
}
function sendSiteToServer(key, id) {  
    alert("sendSiteToServer");
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
                        console.log("data: " + data);
                        alert("successfully saved.");
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
  
function cameraSuccess(url) {
    alert("success")
}
function cameraError(message) {
    alert("message34" + message)
}
window.currentImage  = '';
window.imageMimeType = 'data:image/jpeg;base64,';
window.id ;
window.imageDatas = {}
function camera(id) {
    window.id=id;
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: 0,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true
    });
    function onSuccess(imageData) {
        window.imageDatas[id] = imageData;
        var image = document.getElementById(id);
        image.src = window.imageMimeType + window.imageDatas[id] ;
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}

  