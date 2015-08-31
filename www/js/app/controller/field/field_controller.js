var FieldController = {
  getByCollectionId: function () {
    if (App.isOnline())
      FieldOnlineController.renderByCollectionId();
    else
      FieldOfflineController.renderByCollectionId();
  },
  synForCurrentCollection: function (newFields) {
    var cId = App.DataStore.get("cId");
    FieldOffline.fetchByCollectionId(cId, function (fields) {
      FieldOffline.remove(fields);
      FieldOffline.add(newFields);
    });
  }
};