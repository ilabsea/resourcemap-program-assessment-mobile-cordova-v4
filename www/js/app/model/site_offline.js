SiteOffline = {
  add: function(data) {
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
  fetchBySiteId: function(sId, callback) {
    Site.all().filter('id', "=", sId).one(callback);
  },
  fetchByCollectionId: function(cId, callback) {
    Site.all().filter('collection_id', "=", cId).list(null, callback);
  },
  fetchByUserId: function(userId, callback) {
    Site.all().filter('user_id', '=', userId).list(null, callback);
  },
  deleteBySiteId: function(sId) {
    SiteOffline.fetchBySiteId(sId, function(site) {
      persistence.remove(site);
      persistence.flush();
      App.redirectTo("#page-site-list");
    });
  },
  countByCollectionId: function(idcollection, callback) {
    Site.all().filter('collection_id', "=", idcollection).count(null, function(count) {
      callback(count);
    });
  },
  countByUserId: function(userId, callback) {
    Site.all().filter('user_id', "=", userId).count(null, function(count) {
      callback(count);
    });
  }
};