FieldOffline = {
  add: function(layers, collectionId, userId) {
    $.each(layers, function(index, layer) {
      var fieldParams = {
        collection_id: collectionId,
        user_id: userId,
        name_wrapper: layer.name,
        id_wrapper: layer.id,
        fields: layer.fields
      };

      var fieldObj = new Field(fieldParams);
      persistence.add(fieldObj);
    });
    persistence.flush();
  },
  remove: function(fields) {
    fields.forEach(function(field) {
      persistence.remove(field);
    });
    persistence.flush();
  },

  fetchByCollectionId: function(cId, callback) {
    Field.all().filter('collection_id', '=', cId).list(callback);
  }
};
