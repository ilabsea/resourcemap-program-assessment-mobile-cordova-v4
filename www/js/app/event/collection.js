$(document).on("mobileinit", function() {

  $(document).delegate('#page-collection-list', 'pagebeforeshow', function() {
    App.emptyHTML();
    setTimeout(function(){
      App.validateDbConnection(function() {
        CollectionController.renderList();
      });
    }, 500);
  });


  $(document).delegate('#page-collection-list', 'click', function(event) {
    //db should be ready before page rendering
    App.checkNodeTargetSuccess(event.target, function(a) {
      var li = a.parentNode;
      var id = li.getAttribute("data-id");
      var name = li.getAttribute("data-name");

      CollectionController.id = id;
      CollectionController.name = name;
      CollectionController.displayName({name: name});
    })
  });

});
