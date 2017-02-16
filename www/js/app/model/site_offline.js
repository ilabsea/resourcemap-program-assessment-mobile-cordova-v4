SiteOffline = {
  limit: 2,
  sitePage: 0,
  nbSites: 0,

  add: function (data) {
    var today = new Date();
    var siteParams = data;
    siteParams["created_at"] = today;
    siteParams["user_id"] = UserSession.getUser().id;

    siteParams["properties"] = JSON.stringify(siteParams.properties);
    siteParams["files"] = JSON.stringify(siteParams.files);

    var site = new Site(siteParams);
    persistence.add(site);
    persistence.flush();
  },

  fetchByCollectionIdUserId: function (cId, userId, offset, callback) {
    Site.all()
        .filter('collection_id', "=", cId)
        .filter('user_id', '=', userId)
        .limit(SiteOffline.limit)
        .skip(offset)
        .list(null, callback);
  },

  minFetchByCollectionIdUserId: function (cId, userId, offset, callback) {
    Site.all()
        .filter('collection_id', "=", cId)
        .filter('user_id', '=', userId)
        .limit(SiteOffline.limit)
        .skip(offset)
        .listFields(null, {name: "TEXT", collection_name: "TEXT", collection_id: "INT", created_at: "DATE"}, callback);
  },

  fetchBySiteId: function (sId, callback) {
    Site.all().filter('id', "=", sId).one(callback);
  },

  fetchOneByUserId: function (userId, callback) {
    Site.all().filter('user_id', '=', userId).one(null, callback);
  },

  fetchOneByCollectionIdUserId: function (cId, userId, callback) {
    Site.all()
        .filter('collection_id', "=", cId)
        .filter('user_id', '=', userId)
        .one(null, callback);
  },

  minFetchByUserId: function (userId, offset, callback) {
    Site.all()
        .filter('user_id', '=', userId)
        .limit(SiteOffline.limit)
        .skip(offset)
        .listFields(null, {name: "TEXT", collection_name: "TEXT", collection_id: "INT", created_at: "DATE"}, callback);
  },

  deleteBySiteId: function (sId, callback) {
    Site.all().filter('id', "=", sId)
                    .destroyAll(null, callback);
  },

  countSiteOfflineByUserCollections: function(options, callback){
    Site.all()
        .filter('collection_id', "in", options.collectionIds)
        .filter('user_id', '=', options.userId)
        .listFields(null, {name: "TEXT", created_at: "DATE", collection_id: 'INT'}, function(sites){
          var result = {};
          $.each(sites, function(index, siteOffline){
            var collectionId = siteOffline.collection_id;
            result[collectionId] = result[collectionId] || 0;
            result[collectionId] +=1;
          });
          callback(result);
        });
  },

  countByCollectionIdUserId: function (idcollection, userId, callback) {
    Site.all()
        .filter('collection_id', "=", idcollection)
        .filter('user_id', '=', userId)
        .count(null, function (count) {
          callback(count);
        });
  },
  countByUserId: function (userId, callback) {
    Site.all().filter('user_id', "=", userId).count(null, function (count) {
      callback(count);
    });
  }
};
