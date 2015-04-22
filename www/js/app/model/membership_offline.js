MembershipOffline = {
  add: function (data, cId) {
    var memberParams = {
      collection_id: cId,
      user_id: data.user_id,
      user_email: data.user_display_name,
      admin: data.admin
    };
    var member = new Membership(memberParams);
    persistence.add(member);
    persistence.flush();
  },
  fetchByCollectionId: function(cId, callback){
    Membership.all().filter('collection_id', '=', cId).list(null, callback);
  },
  remove: function(members) {
    members.forEach(function(member) {
      persistence.remove(member);
    });
    persistence.flush();
  }
};