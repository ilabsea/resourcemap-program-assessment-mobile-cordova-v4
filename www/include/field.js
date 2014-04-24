function getFieldUpdateByFieldId(id) {
    var update_field_collection = {update_field_collectionList: []};
    var field_id_arr = new Array();
    var i = 0;
    $.each(id, function(key, data) {
        Field.all().filter('idfield', '=', key).one(null, function(field) {
            var widgetType = field.widgetType();
            var config = field.config();
            var multiple = "";
            var isPhoto = "";
            if (widgetType === "select_many")
                multiple = "multiple";
            if (widgetType === "photo")
                isPhoto = "isPhoto";
            if (widgetType === "select_many" && widgetType === "select_one") {
                for (var k = 0; k < config.options.length; k++) {
                    for (var j = 0; j < data.length; j++) {
                        if (config.options[k].id == data[j]) {
                            config.options[k]["selected"] = "selected";
                            break;
                        } else {
                            if (j === data.length - 1)
                                config.options[k]["selected"] = "";
                        }
                    }
                }
            }
            update_field_collection.update_field_collectionList.push({idfield: key, name: field.name(), widgetType: widgetType, value: data, config: field.config(), multiple: multiple, slider: field.slider(), ctrue: field.ctrue, isPhoto: isPhoto});
            i++;
            if (i === Object.keys(id).length) {
                var update_fieldTemplate = Handlebars.compile($("#update_field_collection-template").html());
                $('#div_update_field_collection').html(update_fieldTemplate(update_field_collection));
                $('#div_update_field_collection').trigger("create");
            }
        });
        field_id_arr.push(key);
    });
    localStorage["field_id_arr"] = JSON.stringify(field_id_arr);
}

function displayFieldForUpdate() {
    var update_field_collection = JSON.parse(localStorage["update_field_collection"]);
    var update_fieldTemplate = Handlebars.compile($("#update_field_collection-template").html());
    $('#div_update_field_collection').html(update_fieldTemplate(update_field_collection));
    $('#div_update_field_collection').trigger("create");
}

function buildField(fieldObj) {
    var kind = fieldObj.kind;
    var widgetType = kind;
    var config = fieldObj.config;
    var slider = "";
    var ctrue = "";
    if (widgetType === "numeric") {
        widgetType = "number";
        config = "";
    }
    if (widgetType === "yes_no") {
        widgetType = "checkbox";
        var configg = {options: [{"id": 1, "code": "1", "label": "YES"}, {"id": 2, "code": "2", "label": "NO"}]};
        config = configg;
        slider = "slider";
        ctrue = "true";
    }
    if (widgetType === "phone") {
        widgetType = "tel";
    }
    var fields = {idfield: fieldObj.id,
        name: fieldObj.name,
        kind: kind,
        code: fieldObj.code,
        multiple: (kind === "select_many" ? "multiple" : ""),
        isPhoto: (kind === "photo" ? true : false),
        widgetType: widgetType,
        config: config,
        slider: slider,
        ctrue: ctrue,
        cId: localStorage.getItem("cId"),
        userId: localStorage.getItem("userId")
    };
    return fields;
}

function addField(fields) {
    cId = localStorage.getItem("cId");
    App.userId = localStorage.getItem("userId");
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
        user_id: App.userId
    };
    var field = new Field(fieldParams);
    persistence.add(field);
    persistence.flush();
}

function getFieldsCollection() {
    if (isOnline())
        getFieldByCollectionIdOnline();
    else
        getFieldByCollectionIdOffline(cId);
}

function getFieldByCollectionIdOnline() {
    cId = localStorage.getItem("cId");
    $.ajax({
        url: App.URL_FIELD + cId + "/fields?auth_token=" + storeToken(),
        type: "get",
        crossDomain: true,
        datatype: 'json',
        success: function(response) {
            var field_id_arr = new Array();
            var field_collection = {field_collectionList: []};
            $.each(response, function(key, properties) {
                field_id_arr.push(properties.id);
                var fields = buildField(properties);
                field_collection.field_collectionList.push(fields);
                localStorage["field_id_arr"] = JSON.stringify(field_id_arr);
                Field.all().filter('idfield', "=", properties.id).one(null, function(field) {
                    if (field === null) {
                        addField(fields);
                    }
                });
            });
            var fieldTemplate = Handlebars.compile($("#field_collection-template").html());
            $('#div_field_collection').html(fieldTemplate(field_collection));
            $('#div_field_collection').trigger("create");
        },
        error: function(error) {
            console.log("erro:  " + error);
            alert("err" + error);
        }
    });
}

function getFieldByCollectionIdOffline(collectionId) {
    Field.all().filter('collection_id', '=', collectionId).list(function(fields) {
        var field_id_arr = new Array();
        var field_collection = {field_collectionList: []};
        fields.forEach(function(field) {
            var config = field.config();
            var widgetType = field.widgetType();
            var name = field.name();
            field_id_arr.push(field.idfield());
            var multiple = "";
            var isPhoto = "";
            if (widgetType === "select_many")
                multiple = "multiple";
            if (widgetType === "photo")
                isPhoto = "isPhoto";
            field_collection.field_collectionList.push({idfield: field.idfield(), name: name, widgetType: widgetType, config: config, multiple: multiple, slider: field.slider(), ctrue: field.ctrue, isPhoto: isPhoto});
            console.log("FiedID here:" + field_id_arr);
            localStorage["field_id_arr"] = JSON.stringify(field_id_arr);
        });
        var fieldTemplate = Handlebars.compile($("#field_collection-template").html());
        $('#div_field_collection').html(fieldTemplate(field_collection));
        $('#div_field_collection').trigger("create");
    });
}