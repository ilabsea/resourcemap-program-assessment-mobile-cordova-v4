var SiteHelper = {
  buildDataForSite: function () {
    var cId = App.DataStore.get("cId");
    var sname = $('#sitename').val();
    var slat = $('#lat').val();
    var slng = $('#lng').val();
    var properties = {};
    var files = {};
    var field_id_arr = App.DataStore.get("field_id_arr");
    if (field_id_arr != null) {
      var storedFieldId = JSON.parse(field_id_arr);
      for (var i = 0; i < storedFieldId.length; i++) {
        var each_field = storedFieldId[i];
        var $field = $('#' + each_field);
        if ($field.length > 0 && $field[0].tagName.toLowerCase() == 'img') {
          var lPhotoList = PhotoList.count();
          for (var p = 0; p < lPhotoList; p++) {
            if (PhotoList.getPhotos()[p].id == each_field) {
              var fileName = PhotoList.getPhotos()[p].name;
              properties[each_field] = fileName;
              files[fileName] = PhotoList.getPhotos()[p].data;
              break;
            }
          }
        }
        else if ($field.length > 0 && $field[0].getAttribute("type") === 'date') {
          var date = $field.val();
          if (date)
            date = convertDateWidgetToParam(date);
          properties["" + each_field + ""] = date;
        }
        else if ($field[0].getAttribute("class") === "tree" ||
            $field[0].getAttribute("class") === "tree unhighlighted") {
          var node = $field.tree('getSelectedNode');
          var data = node.id;
          if (data === null)
            data = "";
          properties[each_field] = data;
        }
        else {
          var data = $field.val();
          if (data == null)
            data = "";
          properties[each_field] = data;
        }
      }
    }
    var data = {
      collection_id: cId,
      name: sname,
      lat: slat,
      lng: slng,
      properties: properties,
      files: files
    };
    return data;
  },
  buildSubmitError: function (error, site) {
    var p = [];
    if (error.properties) {
      $.map(error.properties, function (error) {
        $.each(error, function (key, err) {
          p.push({msg: err, id: key});
        });
      });
    }
    var result = {
      isLat: error["lat"] ? true : false,
      isLng: error["lng"] ? true : false,
      lat: error["lat"],
      lng: error["lng"],
      name: site["name"],
      properties: error["properties"],
      errorProperties: p
    };
    return result;
  },
  resetForm: function () {
    PhotoList.clear();
    $('#form_create_site')[0].reset();
    App.redirectTo("#page-site-list");
  }
};