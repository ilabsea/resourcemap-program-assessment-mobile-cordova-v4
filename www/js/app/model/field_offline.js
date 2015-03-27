FieldOffline = {
  add: function (fields) {
    $.map(fields, function (field) {
      var fieldParams = {
        collection_id: field.cId,
        user_id: field.user_id,
        name_wrapper: field.name_wrapper,
        id_wrapper: field.id_wrapper,
        fields: field.fields,
        layer_membership: field.layer_membership
      };
      var fieldObj = new Field(fieldParams);
      persistence.add(fieldObj);
    });
    persistence.flush();
  },
  remove: function (fields) {
    fields.forEach(function (field) {
      persistence.remove(field);
    });
    persistence.flush();
  },
  fetchByCollectionId: function (cId, callback) {
    Field.all().filter('collection_id', '=', cId).list(callback);
  }
};