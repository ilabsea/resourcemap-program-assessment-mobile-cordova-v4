FieldHelper = {
  buildField: function(fieldObj, options, layerMemberships) {
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
      $.each(layerMemberships, function(key, layerMembership) {
        if(fieldObj.id === layerMembership.layer_id)
          fieldsWrapper.membership = layerMembership;
      });
    }
    else {
      fieldsWrapper.name_wrapper = fieldObj.name_wrapper;
      fieldsWrapper.id_wrapper = fieldObj.id_wrapper;
    }
    $.each(fieldObj.fields, function(key, fields) {
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

      if (widgetType === "numeric") {
        widgetType = "number";
        if (config.range)
          is_required = "required";
      }

      if (widgetType === "select_one" && is_enable_field_logic)
        config = FieldHelper.buildFieldSelectOne(config);

      if (widgetType === "select_many" && is_enable_field_logic)
        App.DataStore.set("configSelectManyForSkipLogic_" + id,
            JSON.stringify(fields));

      if (widgetType === "yes_no") {
        widgetType = "select_one";
        config = FieldHelper.buildFieldYesNo(is_enable_field_logic, config,
            options["fromServer"]);

        slider = "slider";
        ctrue = "true";
      }

      if (widgetType === "phone")
        widgetType = "tel";

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
        config: config,
        slider: slider,
        ctrue: ctrue,
        is_mandatory: is_mandatory,
        required: is_required,
        isHierarchy: (kind === "hierarchy" ? true : false),
        configHierarchy: (kind === "hierarchy" ?
            Hierarchy.generateField(fields.config, "", id) : ""),
        is_enable_field_logic: is_enable_field_logic
      });
    });

    return fieldsWrapper;
  },
  buildFieldSelectOne: function(config) {
    var configOptions;
    $.each(config.options, function(i, option) {
      $.each(config.field_logics, function(j, field_logic) {
        if (option.id === field_logic.value)
          config.options[i]["field_id"] = field_logic.field_id;
      });
    });
    configOptions = config;
    return configOptions;
  },
  buildFieldYesNo: function(is_enable_field_logic, config, fromServer) {
    var configOptions;
    if (is_enable_field_logic) {
      var field_logics = config.field_logics;
      var field_id0 = fromServer ?
          field_logics[0].field_id : config.options[0].field_id;
      var field_id1 = fromServer ?
          field_logics[1].field_id : config.options[1].field_id;
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
    }
    else
      config = {
        options: [{"id": 0, "code": "1", "label": "NO"},
          {"id": 1, "code": "2", "label": "YES"}]
      };

    configOptions = config;

    return configOptions;
  },
  buildFieldsUpdate: function(layers, site, fromServer) {
    var field_collections = [];
    $.each(layers, function(key, layer) {
      var item = FieldHelper.buildFieldsLayer(layer, site, fromServer);
      field_collections.push(item);
    });
    return field_collections;
  },
  buildFieldsLayer: function(layer, site, fromServer) {
    if (fromServer) {
      var itemLayer = FieldHelper.buildField(layer, {fromServer: fromServer});
      var p = site.properties;
    }
    else {
      var itemLayer = FieldHelper.buildField(layer._data, {fromServer: fromServer});
      var p = site.properties();
    }

    for (propertyCode in p) {
      $.each(itemLayer.fields, function(i, item) {
        var propertyValue = p[propertyCode];
        FieldHelper.setFieldsValue(item, propertyCode,
            propertyValue, site, fromServer);
      });
    }
    return itemLayer;
  },
  setFieldsValue: function(item, propertyCode, pValue, site, fromServer) {
    if (item.code === propertyCode || parseInt(item["idfield"])
        === parseInt(propertyCode)) {
      if (item.widgetType === "photo")
        FieldHelper.setFieldPhotoValue(item, pValue, site, fromServer);
      else if (item.widgetType === "select_many"
          || item.widgetType === "select_one")
        FieldHelper.setFieldSelectValue(item, pValue);
      else if (item.widgetType === "hierarchy")
        FieldHelper.setFieldHierarchyValue(item, pValue);
      else if (item.widgetType === "date" && pValue)
        item.__value = convertDateWidgetToParam(pValue);
      else
        item.__value = pValue;
    }
  },
  setFieldPhotoValue: function(item, value, site, fromServer) {
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
  setFieldSelectValue: function(item, value) {
    item.__value = value;
    for (var k = 0; k < item.config.options.length; k++) {
      item.config.options[k]["selected"] = "";
      if (item.__value == true || item.__value == false) {
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
  setFieldHierarchyValue: function(item, value) {
    item.__value = value;
    item.configHierarchy = Hierarchy.generateField(item.config, item.__value,
        item.idfield);
    item._selected = Hierarchy._selected;
  }
};