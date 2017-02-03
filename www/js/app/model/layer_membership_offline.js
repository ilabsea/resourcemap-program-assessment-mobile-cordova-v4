var LayerMembershipOffline = {
  memberships: [],
  add: function (uId, layermemberships) {
    $.map(layermemberships, function (layermembership) {
      var params = {
        collection_id: layermembership.collection_id,
        user_id: layermembership.user_id,
        user_offline_id: uId,
        layer_id: layermembership.layer_id,
        read: layermembership.read,
        write: layermembership.write
      };
      var layermembershipObj = new LayerMembership(params);
      persistence.add(layermembershipObj);
    });
    persistence.flush();
  },
  fetchByUserLayerId: function(uId, layerId, callback){
    LayerMembership
      .all()
      .filter('user_offline_id', '=', uId)
      .filter('layer_id', '=', layerId)
      .one(callback);
  },
  remove: function (layermemberships) {
    layermemberships.forEach(function (layermembership) {
      persistence.remove(layermembership);
    });
    persistence.flush();
  },
  fetchByCollectionUserId: function (cId, uId, callback) {
    LayerMembership
      .all()
      .filter('collection_id', '=', cId)
      .filter('user_offline_id', '=', uId)
      .list(callback);
  },
}
