var MyMembershipObj = {
  membership: "",
  site: "",
  setSite: function(site){
    MyMembershipObj.site = site;
  },
  getSite: function(){
    return MyMembershipObj.site;
  },
  setMembership: function (membership) {
    MyMembershipObj.membership = membership;
  },
  getMembership: function () {
    return MyMembershipObj.membership;
  }
};
