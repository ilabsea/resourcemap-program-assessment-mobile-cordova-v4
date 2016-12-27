var MyMembershipController = {
  canEdit: function (site) {
    var member = MyMembershipObj.getMembership();
    var can_edit = false;
    if (member.admin)
      can_edit = true;
    if (member.can_edit_other)
      can_edit = true;
    if (site.user_id == member.user_id)
      can_edit = true;

    return can_edit;
  },

  getMembershipByCollectionId: function () {
    var cId = CollectionController.id;
    CollectionModel.fetchMyMembership(cId, function (membership) {
      MyMembershipObj.setMembership(membership);
    });
  }
};
