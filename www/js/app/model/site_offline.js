SiteOffline = {
  limit: 7,
  sitePage: 0,
  nbSites: 0,
  add: function (data) {
    var collectionName = App.DataStore.get("collectionName");
    var today = new Date();
    var siteParams = data;
    siteParams["created_at"] = today;
    siteParams["collection_name"] = collectionName;
    siteParams["user_id"] = SessionController.currentUser().id;
    siteParams["device_id"] = uuid.v1();
    var site = new Site(siteParams);
    persistence.add(site);
    persistence.flush();
  },
  fetchFieldsByCollectionIdUserId: function (cId, userId, offset, callback) {
    Site.all()
        .filter('collection_id', "=", cId)
        .filter('user_id', '=', userId)
        .limit(SiteOffline.limit)
        .skip(offset)
        .listFields(null, {name: "TEXT", created_at: "DATE"}, callback);
  },
  fetchOneByCollectionIdUserId: function (cId, userId, callback) {
    Site.all()
        .filter('collection_id', "=", cId)
        .filter('user_id', '=', userId)
        .one(null, callback)
  },
  fetchBySiteId: function (sId, callback) {
    Site.all().filter('id', "=", sId).one(null, callback);
  },
  fetchFieldsByUserId: function (userId, offset, callback) {
    Site.all()
        .filter('user_id', '=', userId)
        .limit(SiteOffline.limit)
        .skip(offset)
        .listFields(null, {name: "TEXT", collection_name: "TEXT", collection_id: "INT", created_at: "DATE"}, callback);
  },
  fetchOneByUserId: function (userId, callback) {
    Site.all()
        .filter('user_id', '=', userId)
        .one(null, callback);
  },
  deleteBySiteId: function (sId) {
    SiteOffline.fetchBySiteId(sId, function (site) {
      persistence.remove(site);
      persistence.flush();
      App.redirectTo("#page-site-list");
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
