LayerController = {
  activeLayer: null,
  layers: [],
  submited: false,
  site: { properties: {}, files: {} },
  isOnline: true,

  synForCurrentCollection: function (newFields) {
    var cId = CollectionController.id;
    FieldOffline.fetchByCollectionId(cId, function (fields) {
      FieldOffline.remove(fields);
      FieldOffline.add(newFields);
    });
  },

  downloadForm: function () {
    console.log('Download form');
    var cId = CollectionController.id;
    var self = this;
    FieldModel.fetch(cId, function (layers) {
      console.log(layers);
      LayerController.synForCurrentCollection(self.layers);
    }, LayerController.errorFetchingField);
  }
};
