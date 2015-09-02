SiteController = {
  form: "",
  setEntryDate: function () {
    var start_entry_date = new Date().toISOString();
    $("#start_entry_date").val(start_entry_date);
  },
  add: function () {
    var data = SiteHelper.buildDataForSite();
    if (App.isOnline())
      SiteOnlineController.add(data, SiteController.resetForm);
    else
      SiteOfflineController.add(data);
  },
  getAllByCollectionId: function () {
    SiteOfflineController.getByCollectionId();
    if (App.isOnline()) {
      SiteOnlineController.getByCollectionId();
      MyMembershipController.getMembershipByCollectionId();
    }
  },
  getByUserId: function (userId) {
    var offset = SiteOffline.sitePage * SiteOffline.limit;
    SiteOffline.fetchByUserId(userId, offset, function (sites) {
      var siteofflineData = [];
      sites.forEach(function (site) {
        var fullDate = dateToParam(site.created_at());
        var item = {id: site.id,
          name: site.name(),
          collectionName: site.collection_name(),
          date: fullDate,
          link: "#page-form-site"
        };
        siteofflineData.push(item);
      });
      SiteOffline.countByUserId(userId, function (count) {
        var siteLength = sites.length + offset;
        var hasMoreSites = false;
        if (siteLength < count) {
          hasMoreSites = true;
        }
        var sitesRender = {
          hasMoreSites: hasMoreSites,
          state: "all",
          siteList: siteofflineData};
        SiteController.display($('#offlinesite-list'), sitesRender);
      });
    });
  },
  renderSiteForm: function () {
    var form = {
      editable: "",
      name: "",
      lat: "",
      lng: ""
    };
    SiteView.displayDefaultLayer("site/form.html",
        $('#div_default_layer'), form);
    FieldController.getByCollectionId();
  },
  resetForm: function () {
    PhotoList.clear();
    $('#form_site')[0].reset();
    App.redirectTo("#page-site-list");
  }
};