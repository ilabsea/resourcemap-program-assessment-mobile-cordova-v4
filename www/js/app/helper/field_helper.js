FieldHelper = {
  buildField: function (fieldObj, options) {
    options = options || {};
    var id = null;
    var fieldsBuild = [];
    var fieldsWrapper = {
      cId: localStorage.getItem("cId"),
      userId: SessionController.currentUser().id,
      fields: fieldsBuild
    };
    if (options["fromServer"]) {
      fieldsWrapper.name_wrapper = fieldObj.name;
      fieldsWrapper.id_wrapper = fieldObj.id;
    }
    else {
      fieldsWrapper.name_wrapper = fieldObj.name_wrapper;
      fieldsWrapper.id_wrapper = fieldObj.id_wrapper;
    }
    $.each(fieldObj.fields, function (key, fields) {
      if (options["fromServer"])
        id = fields.id;
      else
        id = fields.idfield;

      var kind = fields.kind;
      var widgetType = kind;
      var config = fields.config;
      var slider = "";
      var ctrue = "";
      var is_required = "";
      var is_mandatory = fields.is_mandatory;
      var is_enable_field_logic = fields.is_enable_field_logic;
      var readonly = '';
      var invisible = "";

      if (widgetType === "numeric") {
        widgetType = "number";
        if (config.field_logics) {
          App.DataStore.set("configNumberSkipLogic_" + id,
              JSON.stringify(config.field_logics));
        }
        if (config.allows_decimals) {
          App.DataStore.set("configNumber_" + id,
              JSON.stringify(config));
        }
      }

      if (widgetType === "select_one" && is_enable_field_logic) {
        config = FieldHelper.buildFieldSelectOne(config);
        if (!config.field_logics)
          is_enable_field_logic = false;
      }

      if (widgetType === "select_many" && is_enable_field_logic)
        App.DataStore.set("configSelectManyForSkipLogic_" + id,
            JSON.stringify(fields));

      if (widgetType === "yes_no") {
        widgetType = "select_one";
        config = FieldHelper.buildFieldYesNo(config, options["fromServer"]);
        slider = "slider";
        ctrue = "true";
      }

      if (widgetType === "phone")
        widgetType = "tel";

      if (widgetType === "location") {
        widgetType = "select_one";
        App.DataStore.set("configLocations_" + id,
            JSON.stringify(config));
      }

      if (widgetType === "calculation") {
        widgetType = "text";
        readonly = 'readonly';
        if(fields.is_display_field )
          invisible = "invisble-div";
      }

      if (is_mandatory)
        is_required = "required";

      fieldsWrapper.fields.push({
        idfield: id,
        name: fields.name,
        kind: kind,
        code: fields.code,
        multiple: (kind === "select_many" ? "multiple" : ""),
        isPhoto: (kind === "photo" ? true : false),
        widgetType: widgetType,
        invisible: invisible,
        config: config,
        slider: slider,
        ctrue: ctrue,
        is_mandatory: is_mandatory,
        required: is_required,
        isHierarchy: (kind === "hierarchy" ? true : false),
        configHierarchy: (kind === "hierarchy" ?
            Hierarchy.generateField(fields.config, "", id) : ""),
        is_enable_field_logic: is_enable_field_logic,
        readonly: readonly
      });
    });

    return fieldsWrapper;
  },
  buildFieldSelectOne: function (config) {
    $.each(config.options, function (i, option) {
      if (config.field_logics) {
        $.map(config.field_logics, function (field_logic) {
          if (option.id === field_logic.value && !config.options[i]["field_id"])
            config.options[i]["field_id"] = field_logic.field_id;
        });
      }
    });
    return config;
  },
  buildFieldYesNo: function (config, fromServer) {
    var field_id0, field_id1;
    if (fromServer) {
      if (config) {
        var field_logics = config.field_logics;
        if (field_logics) {
          field_id0 = field_logics[0].field_id;
          field_id1 = field_logics[1].field_id;
        }
      }
    } else {
      field_id0 = config.options[0].field_id;
      field_id1 = config.options[1].field_id;
    }
    config = {
      options: [{
          id: 0,
          label: "NO",
          code: "1",
          field_id: field_id0
        },
        {id: 1,
          label: "YES",
          code: "2",
          field_id: field_id1
        }]
    };

    return config;
  },
  buildFieldsUpdate: function (layers, site, fromServer) {
    var field_collections = [];
    $.map(layers, function (layer) {
      var item = FieldHelper.buildFieldsLayer(layer, site, fromServer);
      field_collections.push(item);
    });
    return field_collections;
  },
  buildFieldsLayer: function (layer, site, fromServer) {
    if (fromServer) {
      var itemLayer = FieldHelper.buildField(layer, {fromServer: fromServer});
      var p = site.properties;
    }
    else {
      var itemLayer = FieldHelper.buildField(layer._data, {fromServer: fromServer});
      var p = site.properties();
    }

    for (propertyCode in p) {
      $.map(itemLayer.fields, function (item) {
        var propertyValue = p[propertyCode];
        FieldHelper.setFieldsValue(item, propertyCode,
            propertyValue, site, fromServer);
      });
    }
    return itemLayer;
  },
  setFieldsValue: function (item, propertyCode, pValue, site, fromServer) {
    if (item.code === propertyCode || parseInt(item["idfield"])
        === parseInt(propertyCode)) {
      switch (item.kind) {
        case "photo" :
          FieldHelper.setFieldPhotoValue(item, pValue, site, fromServer);
          break;
        case "select_many":
        case "select_one":
          FieldHelper.setFieldSelectValue(item, pValue);
          break;
        case "location":
          FieldHelper.buildFieldLocationUpdate(site, item, fromServer);
          FieldHelper.setFieldLocationValue(item, pValue);
          break;
        case "hierarchy":
          FieldHelper.setFieldHierarchyValue(item, pValue);
          break;
        case "date":
          if (pValue) {
            var date = pValue.split("T")[0];
            if (!fromServer)
              item.__value = convertDateWidgetToParam(date);
            else
              item.__value = date;
          }
          break;
        default:
          item.__value = pValue;
      }
    }
  },
  setFieldPhotoValue: function (item, value, site, fromServer) {
    var sId = App.DataStore.get("sId");
    if (fromServer) {
      App.DataStore.set(sId + "_" + item["idfield"], value);
      item.__value = SiteCamera.imagePath(value);
    }
    else {
      var files = site.files();
      var imageId = value;
      var imageData = files[imageId];
      if (imageData == null) {
        item.__value = "";
      } else {
        item.__value = SiteCamera.dataWithMimeType(imageData);
        App.DataStore.set(sId + "_" + item["idfield"] + "_fileName", imageId);
        App.DataStore.set(sId + "_" + item["idfield"] + "_fileData", imageData);
      }
    }
  },
  setFieldLocationValue: function (item, value) {
    item.__value = value;
    for (var k = 0; k < item.config.locationOptions.length; k++) {
      item.config.locationOptions[k]["selected"] = "";
      if (item.config.locationOptions[k].code == item.__value) {
        item.config.locationOptions[k]["selected"] = "selected";
      }
    }
  },
  setFieldSelectValue: function (item, value) {
    item.__value = value;
    for (var k = 0; k < item.config.options.length; k++) {
      item.config.options[k]["selected"] = "";
      if (typeof item.__value == "boolean") {
        if (item.config.options[k].id == item.__value
            || item.config.options[k].code == item.__value[j]) {
          item.config.options[k]["selected"] = "selected";
        }

      } else {
        if (item.__value instanceof Array) {
          for (var j = 0; j < item.__value.length; j++) {
            if (item.config.options[k].id == item.__value[j]
                || item.config.options[k].code == item.__value[j]) {
              item.config.options[k]["selected"] = "selected";
            }
          }
        } else {
          if (item.config.options[k].id == item.__value
              || item.config.options[k].code == item.__value) {
            item.config.options[k]["selected"] = "selected";
          }
        }
      }
    }
  },
  setFieldHierarchyValue: function (item, value) {
    item.__value = value;
    item.configHierarchy = Hierarchy.generateField(item.config, item.__value,
        item.idfield);
    item._selected = Hierarchy._selected;
  },
  generateCodeToIdSelectManyOption: function (field, arr_code) {
    var arr_id = [];
    $.map(field.config.options, function (option) {
      for (var i in arr_code) {
        if (option.code == arr_code[i]) {
          arr_id.push(option.id);
        }
      }
    });
    if (arr_id.length === 0)
      arr_id = arr_code;
    return arr_id;
  },
  buildFieldLocationUpdate: function (site, item, fromServer) {
    var lat = fromServer ? site.lat : site.lat();
    var lng = fromServer ? site.long : site.lng();
    item.config.locationOptions = Location.getLocations(lat, lng, item.config);
  }
};