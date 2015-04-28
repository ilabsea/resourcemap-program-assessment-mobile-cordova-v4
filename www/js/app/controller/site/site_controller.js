SiteController = {
  add: function () {
    var data = SiteHelper.buildDataForSite();
    if (App.isOnline())
      SiteOnlineController.add(data, SiteHelper.resetForm);
    else
      SiteOfflineController.add(data);
  },
  getAllByCollectionId: function () {
    SiteOfflineController.getByCollectionId();
    if (App.isOnline())
      SiteOnlineController.getByCollectionId();
  }
};