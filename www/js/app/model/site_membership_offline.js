var SiteMembershipOffline = {
  isHavingMembershiponSite: function(site){
    return false;
  },

  deleteByCollectionId: function (collection_id, callback) {
    SiteMembership.all().filter('collection_id', "=", collection_id)
                    .destroyAll(null, callback);
  },
  add: function (siteMemberships, cId) {
    uId = UserSession.getUser().id;
    $.map(siteMemberships, function (siteMembership) {
        params = {
          collection_id: siteMembership.collection_id,
          site_id: siteMembership.site_id,
          user_id: uId,
          none: siteMembership.none,
          read: siteMembership.read,
          write: siteMembership.write
        }
        var siteMembershipObj = new SiteMembership(params);
        persistence.add(siteMembershipObj);

    });
    persistence.flush();
  },
  fetchByCollectionUserId: function (cId, sId, uId, callback) {
    SiteMembership
      .all()
      .filter('collection_id', '=', cId)
      .filter('site_id', '=', sId)
      .filter('user_id', '=', uId)
      .one(null, callback);
  },
}
