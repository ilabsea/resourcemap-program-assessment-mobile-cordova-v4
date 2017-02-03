var MyMembershipController = {
  canEntryDataByLayerId: function (site, layer_id){
    var can_entry = MyMembershipController.canEditOtherSite(site);
    console.log('can entry : ', can_entry);
    if(can_entry == false){
      uId = UserSession.getUser().id;
      can_entry = LayerMembershipOffline.fetchByUserLayerId(uId, layer_id);
    }
    return can_entry;
  },

  canEditOtherSite: function (site, callback) {
    var cId = CollectionController.id;
    MembershipOffline.fetchByCollectionId(cId, function(member){
      var can_edit = false;
      if (member.admin)
        can_edit = true;
      if (member.can_edit_other)
        can_edit = true;
      if (site.user_id == member.user_id)
        can_edit = true;

    });
  },

  fetchMembershipByCollectionId: function (cId) {
    MembershipModel.fetch(cId, function(membership){
      console.log('fetch membership : ', membership);
      MembershipOffline.deleteByCollectionId(cId, function(){
        MembershipOffline.add(membership, cId);
      });
    });
  },
};
