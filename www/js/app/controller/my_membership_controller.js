var MyMembershipController = {
  otherSiteMembership: function(site, callback, layer_id){
    var cId = CollectionController.id;
    MembershipOffline.fetchByCollectionId(cId, function(member){
      var uId = UserSession.getUser().id;
      if (member.admin){
        callback(true);
      }else if(member.write){
        callback(true);
      }else if(member.read){
        callback(false);
      }else{
        if(site.id){
          // for edit site: check by the customSite Permission or Layer Permission
          SiteMembershipOffline.fetchByCollectionUserId(cId, site.id, uId, function(siteMembership){
            if(siteMembership){
              callback(siteMembership.write);
            }else {
              if(layer_id != undefined){
                LayerMembershipOffline.fetchByUserLayerId(uId, layer_id, function(layer_membership){
                  can_entry = layer_membership.write;
                  callback(can_entry);
                });
              }else {
                callback(false)
              }
            }
          });
        }else{
          // for new site : check Layer Permission
          LayerMembershipOffline.fetchByUserLayerId(uId, layer_id, function(layer_membership){
            can_entry = layer_membership.write;
            callback(can_entry);
          });
        }
      }
    });
  },

  layerMembership: function (site, layer_id, callback){
    uId = UserSession.getUser().id;
    if(typeof site.user_id == 'undefined'){
      MyMembershipController.isCollectionOwner(function(is_owner){
        if(is_owner){
          callback(true);
        }else{
          LayerMembershipOffline.fetchByUserLayerId(uId, layer_id, function(layer_membership){
            can_entry = layer_membership.write;
            callback(can_entry);
          });
        }
      });
    }else{
      MyMembershipController.otherSiteMembership(site, function(can_entry){
        callback(can_entry);
      }, layer_id);
    }

  },

  isCollectionOwner: function(callback){
    cId = CollectionController.id
    MembershipOffline.fetchByCollectionId(cId, function(member){
      callback(member.admin);
    });
  },

  fetchMembershipByCollectionId: function (cId) {
    MembershipModel.fetch(cId, function(membership){
      MembershipOffline.deleteByCollectionId(cId, function(){
        MembershipOffline.add(membership, cId);
      });
    });

    LayerMembershipModel.fetchMembership(cId, function (memberships){
      uId = UserSession.getUser().id;
      LayerMembershipOffline.deleteByCollectionId(cId, function(){
        LayerMembershipOffline.add(uId, memberships);
      });
    });

    SiteMembershipModel.fetch(cId, function(memberships){
      SiteMembershipOffline.deleteByCollectionId(cId, function(){
        SiteMembershipOffline.add(memberships, cId)
      });
    });
  },
};
