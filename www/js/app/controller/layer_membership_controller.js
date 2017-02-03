var LayerMembershipController = {
  permission: function (layer_id) {
    var my_membership = MyMembershipObj.getMembership();

    var permission = {};
    if (my_membership.admin)
      permission = {admin: true} ;
    else{
      LayerMembershipObj.getMembershipByLayerId(layer_id);
    }

    return can_edit_layer;
  },
}
