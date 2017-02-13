var MembershipOffline = {
  add: function (member, cId) {
    var memberParams = {
      collection_id: cId,
      user_id: member.user_id,
      user_email: member.user_display_name,
      admin: member.admin,
      can_view_other: member.can_view_other,
      can_edit_other: member.can_edit_other
    };
    var member = new Membership(memberParams);
    persistence.add(member);
    persistence.flush();
  },
  fetchByCollectionId: function (cId, callback) {
    Membership.all().filter('collection_id', '=', cId).one(null, callback);
  },
  deleteByCollectionId: function (collection_id, callback) {
    Membership.all().filter('collection_id', "=", collection_id)
                    .destroyAll(null, callback);
  }
};
