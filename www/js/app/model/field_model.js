FieldModel = {
  fetch: function(successCallback) {
    var cId = localStorage.getItem("cId");
    $.ajax({
      url: App.URL_FIELD + cId + "/fields?auth_token=" + App.Session.getAuthToken(),
      type: "get",
      datatype: 'json',
      success: successCallback,
      error: function(error) {
        App.log("error: ", error);
        if (!App.isOnline())
          FieldController.renderByCollectionIdOffline();
      }
    });
  }
};

FieldOffline = {
  add: function(fields) {
    $.map(fields, function(field) {
      var fieldParams = {
        collection_id: field.cId,
        user_id: field.user_id,
        name_wrapper: field.name_wrapper,
        id_wrapper: field.id_wrapper,
        fields: field.fields
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