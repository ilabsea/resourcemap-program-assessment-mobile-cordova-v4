$(document).on("mobileinit", function() {

  $(document).delegate('#page-collection-list', 'pagebeforeshow', function() {
    App.emptyHTML();
    App.validateDbConnection(function() {
      CollectionController.renderList();
    });
  });


  $(document).delegate('#page-collection-list', 'click', function(event) {
    //db should be ready before page rendering
    App.checkNodeTargetSuccess(event.target, function(a) {
      var li = a.parentNode;
      var cId = li.getAttribute("data-id");
      var cName = li.getAttribute("data-name");

      App.DataStore.set("cId", cId);
      App.DataStore.set("collectionName", cName);
      CollectionController.displayName({name: cName});
    })
  });

});
