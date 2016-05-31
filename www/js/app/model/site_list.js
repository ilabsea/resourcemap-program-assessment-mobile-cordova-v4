SiteList = {
  menu: function () {
    console.log('changed')
    App.emptyHTML();
    var cId = App.DataStore.get("cId");
    var value = $('#site-list-menu').val();
    $("#btn_sendToServer").hide();

    console.log('option: ', value)
    switch (value) {
      case "1":
        SiteController.getAllByCollectionId(cId);
        break;
      case "2":
        SiteOffline.sitePage = 0;
        SiteController.getByCollectionIdOffline(cId);
        $("#btn_sendToServer").show();
        break;
      case "3":
        SiteController.getByCollectionIdOnline(cId);
        break;
      case "4":
        SessionController.logout();

      default:
        console.log("no value");
    }
  }
};
