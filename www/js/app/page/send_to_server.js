$(function () {

  $(document).delegate('#btn_sendToServer', 'click', function () {
    SiteOfflineController.submitAllToServerByCollectionIdUserId();
  });

  $(document).delegate('#btn_sendToServerAll', 'click', function () {
    SiteOfflineController.submitAllToServerByUserId();
  });
});