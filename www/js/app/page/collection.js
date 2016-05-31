$(function() {

  $(document).delegate('#page-collection-list', 'pagebeforeshow', function() {
    App.emptyHTML();
    hideElement($("#info_sign_in"));
    CollectionController.renderList();
  });

  $(document).delegate('#page-collection-list', 'click', function(e) {
    var $target = $(e.target);
    if( e.target.tagName.toLowerCase() == 'a'){
      var cId = $target.attr("data-id");
      var cName = $target.attr("data-name");

      App.DataStore.set("cId", cId);
      App.DataStore.set("collectionName", cName);
      CollectionController.displayName({name: cName});
    }
  });

});
