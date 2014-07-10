function getSiteByCollectionId() {
    var id = localStorage.getItem("cId");
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

function displayAllSites() {
    getSiteByCollectionId();
    getSiteByCollectionIdFromServer();
}

function getSiteByCollectionIdFromServer() {
    var cId = localStorage.getItem("cId");
    SiteModel.fetch(cId, function(response) {
        var siteOnlineData = [];
        $.each(response["sites"], function(key, data) {
            var date = data.created_at;
            date = new Date(date);
            date = dateToParam(date);
            var item = {id: data.id,
                name: data.name,
                lat: data.lat,
                lng: data.lng,
                date: date
            };
            siteOnlineData.push(item);
            if (key === response["total"] - 1) {
                displaySiteByCollectionIdFromServer(siteOnlineData);
            }
        });
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

function renderUpdateSiteFormFromServer() {
    SiteModel.fetchOne(function(response) {
        var siteOnlineUpdateData = {name: response.name, lat: response.lat, lng: response.long};
        var siteOnlineUpdateTemplate = Handlebars.compile($("#site-update-online-template").html());
        $('#div-site-update-name-online').html(siteOnlineUpdateTemplate(siteOnlineUpdateData));
        $('#div-site-update-name-online').trigger("create");
        renderFieldsBySiteFromServer(response);
    });
}

function updateSiteBySiteId() {
    ViewBinding.setBusy(true);
    var id = localStorage.getItem("sId");
    Site.all().filter('id', "=", id).one(function(site) {
        site.name($("#updatesitename").val());
        site.lat($("#updatelolat").val());
        site.lng($("#updatelolng").val());
        queryFieldByCollectionIdOffline(function(fields) {
            var propertiesFile = {properties: {}, files: {}};
            fields.forEach(function(field) {
                propertiesFile = updateFieldValueBySiteId(propertiesFile, field, "#update_", false);
            });
            site.properties(propertiesFile.properties);
            site.files(propertiesFile.files);
            persistence.flush();
            location.href = "index.html#page-site-list";
        });
    });
}

function updateSiteBySiteIdFromServer() {
    var data;
    FieldModel.fetch(function(field) {
        var propertiesFile = {properties: {}, files: {}};
        $.each(field, function(key, field) {
            propertiesFile = updateFieldValueBySiteId(propertiesFile, field, "#update_online_", true);
        });
        ViewBinding.setBusy(true);
        data = {
            "_method": "put",
            "auth_token": getAuthToken(),
            "site": {
                "name": $("#updatesitename_online").val(),
                "lat": $("#updatelolat_online").val(),
                "lng": $("#updatelolng_online").val(),
                "properties": propertiesFile.properties,
                "files": propertiesFile.files
            }
        };
        SiteModel.update(data, function() {
            location.href = "#page-site-list";
        }, function() {
            alert(i18n.t("global.please_reupdate_your_site"));
        });
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
        alert(i18n.t("global.no_internet_connection"));
}

function submitSiteServer(sites) {
    var site = sites[0];
    ViewBinding.setBusy(true);
    var data = {site: {
            collection_id: site.collection_id(),
            name: site.name(),
            lat: site.lat(),
            lng: site.lng(),
            properties: site.properties(),
            files: site.files()
        }
    };
    SiteModel.create(data["site"], function() {
        persistence.remove(site);
        persistence.flush();
        $('#sendToServer').show();
        sites.splice(0, 1);
        if (sites.length === 0) {
            window.location.href = "#submitLogin-page";
        }
        else
            submitSiteServer(sites);
    }, function() {
        $("#info_sign_in").show();
        location.href = "#page-login";
    });
}

function  addSiteToServer() {
    var data = buildDataForSite();
    if (isOnline()) {
        addSiteOnline(data, resetSiteForm);
    }
    else {
        addSiteOffline(data, resetSiteForm);
    }
}

function addSiteOnline(data, callback) {
    ViewBinding.setBusy(true);
    SiteModel.create(data, callback, function() {
        ViewBinding.setAlert("Please send data again.");
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
