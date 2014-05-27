function renderFieldsBySite(site) {
    queryFieldByCollectionIdOffline(function(fields) {
        var field_collections = [];
        fields.forEach(function(field) {
            var item = buildField(field, {fromServer: false});
            var properties = site.properties();
            console.log("properties: ",properties);
            var files = site.files();
            for (propertyId in properties) {
                if (parseInt(item["idfield"]) === parseInt(propertyId)) {
                    if (item.widgetType === "photo") {
                        var imageId = properties[propertyId];
                        var imageData = files[imageId];
                        item.__value = SiteCamera.dataWithMimeType(imageData);
                    }
                    else if (item.widgetType === "select_many" || item.widgetType === "select_one") {
                        item.__value = properties[propertyId];
                        for (var k = 0; k < item.config.options.length; k++) {
                            for (var j = 0; j < item.__value.length; j++) {
                                if (item.config.options[k].id == item.__value[j]) {
                                    item.config.options[k]["selected"] = "selected";
                                } else {
                                    if (j === item.__value.length) {
                                        item.config.options[k]["selected"] = "";
                                    }
                                }
                            }
                        }
                    }
                    else if (item.widgetType === "hierarchy") {
                        item.__value = properties[propertyId];
                        item.displayHierarchy = Hierarchy.generateField(item.config, item.__value);
                    }
                    else if (item.widgetType === "date") {
                        var val = properties[propertyId];
                        if (val)
                            item.__value = convertDateWidgetToParam(val);
                    }
                    else
                        item.__value = properties[propertyId];
                    field_collections.push(item);
                    break;
                }
            }
        });
        var fieldTemplate = Handlebars.compile($("#update_field_collection-template").html());
        $('#div_update_field_collection').html(fieldTemplate({field_collections: field_collections}));
        $('#div_update_field_collection').trigger("create");
    });
}

function buildField(fieldObj, options) {
    options = options || {};
    var field = {};
    var id = null;
    if (options["fromServer"]) {
        field = fieldObj;
        id = fieldObj.id;
    }
    else {
        field = fieldObj._data;
        id = fieldObj.idfield();
    }
    var kind = field.kind;
    var widgetType = kind;
    var config = field.config;
    var slider = "";
    var ctrue = "";
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
    var fields = {
        idfield: id,
        name: field.name,
        kind: kind,
        code: field.code,
        multiple: (kind === "select_many" ? "multiple" : ""),
        isPhoto: (kind === "photo" ? true : false),
        widgetType: widgetType,
        config: config,
        slider: slider,
        ctrue: ctrue,
        cId: localStorage.getItem("cId"),
        userId: getCurrentUser().id
    };
    if (widgetType === "hierarchy") {
        fields.isHierarchy = true;
        fields.displayHierarchy = Hierarchy.generateField(fields.config, "");
    }
    return fields;
}

function addField(fields) {
    cId = localStorage.getItem("cId");
    var fieldParams = {
        idfield: fields.idfield,
        kind: fields.kind,
        name: fields.name,
        code: fields.code,
        config: fields.config,
        multiple: fields.multiple,
        isPhoto: fields.isPhoto,
        widgetType: fields.widgetType,
        slider: fields.slider,
        ctrue: fields.ctrue,
        collection_id: cId,
        user_id: getCurrentUser().id
    };
    var field = new Field(fieldParams);
    persistence.add(field);
    persistence.flush();
}

function getFieldsCollection() {
    if (isOnline())
        renderFieldByCollectionIdOnline();
    else
        renderFieldByCollectionIdOffline();
}

function renderFieldByCollectionIdOnline() {
    var cId = localStorage.getItem("cId");
    $.ajax({
        url: App.URL_FIELD + cId + "/fields?auth_token=" + getAuthToken(),
        type: "get",
        crossDomain: true,
        datatype: 'json',
        success: function(response) {
            var field_id_arr = new Array();
            var field_collections = [];
            $.each(response, function(key, properties) {
                field_id_arr.push(properties.id);
                var fields = buildField(properties, {fromServer: true});
                console.log("fields : ", fields);
                field_collections.push(fields);
                Field.all().filter('idfield', "=", properties.id).one(null, function(field) {
                    if (field === null) {
                        addField(fields);
                    }
                });
            });
            localStorage["field_id_arr"] = JSON.stringify(field_id_arr);
            displayFieldRender(field_collections);
        },
        error: function(error) {
            console.log("erro:  " + error);
        }
    });
}

function renderFieldByCollectionIdOffline() {
    queryFieldByCollectionIdOffline(function(fields) {
        var field_collections = [];
        var field_id_arr = new Array();
        fields.forEach(function(field) {
            field_id_arr.push(field.idfield());
            var item = buildField(field, {fromServer: false});
            field_collections.push(item);
        });
        localStorage["field_id_arr"] = JSON.stringify(field_id_arr);
        displayFieldRender(field_collections);
    });
}

function queryFieldByCollectionIdOffline(callback) {
    var cId = localStorage.getItem("cId");
    Field.all().filter('collection_id', '=', cId).list(callback);
}

function displayFieldRender(data) {
    var fieldTemplate = Handlebars.compile($("#field_collection-template").html());
    $('#div_field_collection').html(fieldTemplate({field_collections: data}));
    $('#div_field_collection').trigger("create");
}