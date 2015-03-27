$(function() {

  $(document).delegate('#btn_sendToServer', 'click', function() {
    var cId = App.DataStore.get("cId");
    SiteOfflineController.submitAllToServerByCollectionId("collection_id", cId);
  });

  $(document).delegate('#btn_sendToServerAll', 'click', function() {
    var currentUser = SessionHelper.currentUser();
    SiteOfflineController.submitAllToServerByUserId("user_id", currentUser.id);
  });
});