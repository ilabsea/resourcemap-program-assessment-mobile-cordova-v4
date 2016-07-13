SiteOffline = {
  limit: 7,
  sitePage: 0,
  nbSites: 0,
  add: function (data) {
    var today = new Date();
    var siteParams = data;
    siteParams["created_at"] = today;
    siteParams["user_id"] = UserSession.getUser().id;

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
  fetchBySiteId: function (sId, callback) {
    console.log("---sid", sId);
    Site.all().filter('id', "=", sId).one(callback);
  },
  fetchByUserId: function (userId, offset, callback) {
    Site.all()
        .filter('user_id', '=', userId)
        .limit(SiteOffline.limit)
        .skip(offset)
        .list(null, callback);
  },
  deleteBySiteId: function (sId, callback) {
    Site.all().filter('id', "=", sId)
                    .destroyAll(null, callback);
  },
  countSiteOfflineByUserCollections: function(options, callback){
    Site.all()
        .filter('collection_id', "in", options.collectionIds)
        .filter('user_id', '=', options.userId)
        .list(null, function (sites) {
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
