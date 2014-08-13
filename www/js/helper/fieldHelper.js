function imagePath(imgFileName) {
    return App.IMG_PATH + imgFileName;
}

function clearFilePathStorage(key) {
    alert("clear me");
    localStorage.removeItem(key);
}

function buildFieldsCollection(layers, site, fromServer) {
    var field_collections = [];
    $.each(layers, function(key, layer) {
        var item = buildFieldsLayer(layer, site, fromServer);
        field_collections.push(item);
    });
    return field_collections;
}

function buildFieldsLayer(layer, site, fromServer) {
    if (fromServer)
        var itemLayer = buildField(layer, {fromServer: fromServer});
    else
        var itemLayer = buildField(layer._data, {fromServer: fromServer});

    var items = itemLayer.fields;
    var p = getSiteProperties(site, fromServer);

    for (propertyCode in p) {
        $.each(items, function(i, item) {
            var propertyValue = p[propertyCode];
            setFieldsValue(item, propertyCode, propertyValue, site, fromServer);
        });
    }
    return itemLayer;
}

function getSiteProperties(site, fromServer) {
    if (fromServer)
        return site.properties;
    else
        return site.properties();
}

function setFieldSelectValue(item, value) {
    item.__value = value;
    for (var k = 0; k < item.config.options.length; k++) {
        item.config.options[k]["selected"] = "";
        if (item.__value == true || item.__value == false) {
            if (item.config.options[k].id == item.__value || item.config.options[k].code == item.__value[j]) {
                item.config.options[k]["selected"] = "selected";
            }
        } else {
            for (var j = 0; j < item.__value.length; j++) {
                if (item.config.options[k].id == item.__value[j] || item.config.options[k].code == item.__value[j]) {
                    item.config.options[k - 1]["selected"] = "selected";
                }
            }
        }
    }
}

function setFieldPhotoValue(item, value, site, fromServer) {
    if (fromServer) {
        localStorage.setItem("filePath", value);
        item.__value = imagePath(value);
    }
    else {
        var files = site.files();
        var imageId = value;
        var imageData = files[imageId];
        if (imageData == null) {
            item.__value = "";
        } else {
            item.__value = SiteCamera.dataWithMimeType(imageData);
            localStorage.setItem("fileNameOffline", imageId);
            localStorage.setItem("fileDataOffline", imageData);
        }
    }
}

function setFieldHierarchyValue(item, value) {
    item.__value = value;
    item.displayHierarchy = Hierarchy.generateField(item.config, item.__value);
}

function setFieldsValue(item, propertyCode, pValue, site, fromServer) {
    if (item.code === propertyCode || parseInt(item["idfield"]) === parseInt(propertyCode)) {
        if (item.widgetType === "photo")
            setFieldPhotoValue(item, pValue, site, fromServer);
        else if (item.widgetType === "select_many" || item.widgetType === "select_one")
            setFieldSelectValue(item, pValue);
        else if (item.widgetType === "hierarchy") {
            setFieldHierarchyValue(item, pValue);
        }
        else if (item.widgetType === "date" && pValue)
            item.__value = convertDateWidgetToParam(pValue);
        else
            item.__value = pValue;
    }
}

function buildField(fieldObj, options) {
    options = options || {};
    var id = null;
    var fieldsBuild = [];
    var fieldsWrapper = {
        cId: localStorage.getItem("cId"),
        userId: getCurrentUser().id,
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
    $.each(fieldObj.fields, function(key, fields) {
        if (options["fromServer"]) {
            id = fields.id;
        }
        else {
            id = fields.idfield;
        }
        var kind = fields.kind;
        var widgetType = kind;
        var config = fields.config;
        var slider = "";
        var ctrue = "";
        var is_required = "";
        var is_mandatory = fields.is_mandatory;
        if (widgetType === "numeric") {
            widgetType = "number";
            config = "";
        }
        if (widgetType === "yes_no") {
            widgetType = "select_one";
            var configOptions = {options: [{"id": 0, "code": "1", "label": "NO"}, {"id": 1, "code": "2", "label": "YES"}]};
            config = configOptions;
            slider = "slider";
            ctrue = "true";
        }
        if (widgetType === "phone") {
            widgetType = "tel";
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
            config: config,
            slider: slider,
            ctrue: ctrue,
            is_mandatory: is_mandatory,
            required: is_required,
            isHierarchy: (kind === "hierarchy" ? true : false),
            displayHierarchy: (kind === "hierarchy" ? Hierarchy.generateField(fields.config, "") : "")
        });
    });
    return fieldsWrapper;
}

function updateFieldValueBySiteId(propertiesFile, field, idHTMLForUpdate, fromServer) {
    var pf = propertiesFile;
    var itemLayer;
    if (fromServer)
        itemLayer = buildField(field, {fromServer: fromServer});
    else
        itemLayer = buildField(field._data, {fromServer: fromServer});

    var items = itemLayer.fields;

    $.each(items, function(i, item) {
        if (item.isPhoto) {
            var idfield = item["idfield"];
            var lPhotoList = PhotoList.getPhotos().length;
            var sId = localStorage.getItem("sId");

            if (fromServer) {
                var filePath = localStorage.getItem("filePath");
                if (filePath == null)
                    propertiesFile.properties[idfield] = "";
                else
                    propertiesFile.properties[idfield] = filePath;
            } else {
                var fileData = localStorage.getItem("fileDataOffline");
                var fileNameLocal = localStorage.getItem("fileNameOffline");
                if (fileData == null || fileNameLocal == null) {
                    propertiesFile.properties[idfield] = "";
                }
                else {
                    var fileName = fileNameLocal;
                    propertiesFile.properties[idfield] = fileName;
                    propertiesFile.files[fileName] = fileData;
                }
            }
            for (var i = 0; i < lPhotoList; i++) {
                if (PhotoList.getPhotos()[i].id == idfield && PhotoList.getPhotos()[i].sId == sId) {
                    var fileName = PhotoList.getPhotos()[i].name();
                    propertiesFile.properties[idfield] = fileName;
                    propertiesFile.files[fileName] = PhotoList.getPhotos()[i].data;
                    break;
                }
            }
        }
        else if (item.widgetType === "date") {
            var nodeId = idHTMLForUpdate + item["idfield"];
            var value = $(nodeId).val();
            if (value != "") {
                value = new Date(value);
                value = dateToParam(value);
            }
            propertiesFile.properties[item["idfield"]] = value;
        }
        else {
            var nodeId = idHTMLForUpdate + item["idfield"];
            var value = $(nodeId).val();
            if (value == null)
                value = "";
            propertiesFile.properties[item["idfield"]] = value;
        }
    });

    return pf;
}

function queryFieldByCollectionIdOffline(callback) {
    var cId = localStorage.getItem("cId");
    Field.all().filter('collection_id', '=', cId).list(callback);
}

function synFieldForCurrentCollection(newFields) {
    queryFieldByCollectionIdOffline(function(fields) {
        removeFieldsInLocalDB(fields);
        addFieldsToLocalDB(newFields);
    });
}

function removeFieldsInLocalDB(fields) {
    fields.forEach(function(field) {
        persistence.remove(field);
    });
    persistence.flush();
}

function addFieldsToLocalDB(fields) {
    $.each(fields, function(index, field) {
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
}

function displayFieldRender(data) {
    var fieldTemplate = Handlebars.compile($("#field_collection-template").html());
    $('#div_field_collection').html(fieldTemplate({field_collections: data}));
    $('#div_field_collection').trigger("create");
}

function displayFieldUpdateTemplate(data) {
    var fieldTemplate = Handlebars.compile($("#update_field_collection-template").html());
    $('#div_update_field_collection').html(fieldTemplate({field_collections: data}));
    $('#div_update_field_collection').trigger("create");
}

function displayFieldUpdateOnlineTemplate(data) {
    var fieldTemplate = Handlebars.compile($("#update_field_collection-online-template").html());
    $('#div_update_field_collection_online').html(fieldTemplate({field_collections: data}));
    $('#div_update_field_collection_online').trigger("create");
}