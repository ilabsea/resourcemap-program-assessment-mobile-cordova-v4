var MembershipOnlineController = {
  getByCollectionId: function (cId) {
    App.log("cId : ", cId);
    MembershipModel.fetch(cId, function (members) {
      MembershipController.synMembership(cId, members);
    });
  }
};