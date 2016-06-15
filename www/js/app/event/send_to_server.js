$(document).on("mobileinit", function() {

  $(document).delegate('#btn_sendToServer', 'click', function () {
    SiteController.submitAllToServerByCollectionIdUserId();
  });

  $(document).delegate('#btn_sendToServerAll', 'click', function () {
    SiteController.submitAllToServerByUserId();
  });

  $(document).on('pagebeforechange', function (event, data) {
    var sitePages = ['page-create-site', 'page-update-site', 'page-update-site-online']

    if(!$.mobile.activePage)
      return true;

    var currentPageId = $.mobile.activePage.attr('id')

    var redirect = false

    if(typeof data.toPage == 'string'  ){
       var changePage = data.toPage.indexOf(currentPageId) == -1
       var notSelectPopup = data.toPage.match(/(listbox|dialog)$/) == null
       var dirty = FieldController.layerDirty()
       var isSiteForm = $.inArray(currentPageId, sitePages) != -1
       var safe = SiteController.safe;

       if( isSiteForm && changePage && notSelectPopup && dirty && !safe) {
         if(!confirm("Are you sure to leave this page")) {
           ViewBinding.setBusy(false);
           event.preventDefault()
           return false;
         }
       }
       SiteController.safe = false
    }

  });


});
