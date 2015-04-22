var MembershipController = {
  get: function(cId){
    if (!App.isOnline()) {
      MembershipOfflineController.getByCollectionId(cId);
    } else {
      MembershipOnlineController.getByCollectionId(cId);
    }
  },
  synMembership: function(cId,newMembers){
    MembershipOffline.fetchByCollectionId(cId, function(members) {
      App.log("members synmembership : ", members);
      MembershipOffline.remove(members);
      MembershipOffline.add(newMembers);
    });
  }
};