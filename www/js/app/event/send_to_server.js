$(function () {

  $(document).delegate('#btn_sendToServer', 'click', function () {
    SiteController.submitAllToServerByCollectionIdUserId();
  });

  $(document).delegate('#btn_sendToServerAll', 'click', function () {
    SiteController.submitAllToServerByUserId();
  });
});