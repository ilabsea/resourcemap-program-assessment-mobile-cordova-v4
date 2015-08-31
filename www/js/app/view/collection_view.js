var CollectionView = {
  displayList: function (collectionData) {
    App.Template.process("collection/list.html", collectionData, function (content) {
      $('#collection-list').html(content);
      $('#collection-list').listview("refresh");
    });
  },
  displayName: function (collectionName) {
    App.Template.process("collection/name.html", collectionName, function (content) {
      $('.title').html(content);
    });
  },
};