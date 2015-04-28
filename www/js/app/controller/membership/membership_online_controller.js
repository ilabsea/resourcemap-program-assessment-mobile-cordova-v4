var MembershipOnlineController = {
  getByCollectionId: function (cId) {
    MembershipModel.fetch(cId, function (members) {
      MembershipController.synMembership(cId, members);
    });
  }
};