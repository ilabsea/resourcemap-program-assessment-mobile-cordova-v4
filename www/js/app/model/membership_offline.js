MembershipOffline = {
  add: function (members, cId) {
    $.map(members, function (member) {
      var memberParams = {
        collection_id: cId,
        user_id: member.user_id,
        user_email: member.user_display_name,
        admin: member.admin
      };
      var member = new Membership(memberParams);
      persistence.add(member);
    });
    persistence.flush();
  },
  fetchByCollectionId: function (cId, callback) {
    Membership.all().filter('collection_id', '=', cId).list(null, callback);
  },
  remove: function (members) {
    members.forEach(function (member) {
      persistence.remove(member);
    });
    persistence.flush();
  }
};