function addField(kind, name, code, idfield, config) {
    cId = localStorage.getItem("cId");
    App.userId = localStorage.getItem("userId");
    var fieldParams = {
        idfield: idfield,
        kind: kind,
        name: name,
        code: code,
        config: config,
        collection_id: cId,
        user_id: App.userId
    };
    var field = new Field(fieldParams);
    persistence.add(field);
    persistence.flush();
}

function getFieldUpdateByFieldId(id) {
    var update_field_collection = {update_field_collectionList: []};
    var field_id_arr = new Array();
    var i = 0;
    $.each(id, function(key, data) {
        Field.all().filter('idfield', '=', key).one(null, function(field) {
            var kind = field.kind();
            var multiple = "";
            var config = field.config();
            if (kind == "select_many")
                multiple = "multiple";
            if (kind == "select_one" || kind == "select_many") {
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
            update_field_collection.update_field_collectionList.push({idfield: key, name: field.name(), kind: field.kind(), value: data, config: config, multiple: multiple});
            i++;
            if (i === Object.keys(id).length) {
                var update_fieldTemplate = Handlebars.compile($("#update_field_collection-template").html());
                $('#div_update_field_collection').html(update_fieldTemplate(update_field_collection));
                $('#div_update_field_collection').trigger("create");
            }
        });
        field_id_arr.push(key);
    });
}

function getFieldByCollectionId(collectionId) {
    Field.all().filter('collection_id', '=', collectionId).list(function(fields) {
        var field_id_arr = new Array();
        var field_collection = {field_collectionList: []};
        fields.forEach(function(field) {
            var config = field.config();
            var kind = field.kind();
            var name = field.name();
            field_id_arr.push(field.idfield());
            var multiple = "";
            if (kind === "select_many")
                multiple = "multiple";
            field_collection.field_collectionList.push({idfield: field.idfield(), name: name, kind: kind, config: config, multiple: multiple});
            console.log("FiedID here:" + field_id_arr);
            localStorage["field_id_arr"] = JSON.stringify(field_id_arr);
        });
        var fieldTemplate = Handlebars.compile($("#field_collection-template").html());
        $('#div_field_collection').html(fieldTemplate(field_collection));
        $('#div_field_collection').trigger("create");
    });
}

//================================= online ==============================================
function getFieldsCollection() {
    cId = localStorage.getItem("cId");
    if (isOnline()) {
        $.ajax({
            url: App.URL_FIELD + cId + "/fields?auth_token=" + storeToken(),
            type: "get",
            crossDomain: true,
            datatype: 'json',
            success: function(response) {
                var field_id_arr = new Array();
                var field_collection = {field_collectionList: []};
                $.each(response, function(key, data) {
                    var idfield = data.id;
                    var name = data.name;
                    var kind = data.kind;
                    var code = data.code;
                    var config = data.config;
                    field_id_arr.push(idfield);
                    var multiple = "";
                    switch (kind) {
                        case "numeric" :
                            kind = "number";
                            config = "";
                            break;
                        case "email":
                            kind = "email";
                            break;
                        case "date":
                            kind = "date";
                            break;
                        case "yes_no":
                            kind = "checkbox";
                            break;
                        case "photo":
                            kind = "file";
                            break;
                        case "select_many":
                            multiple = "multiple";
                            break;
                    }
                    field_collection.field_collectionList.push({idfield: idfield, name: name, kind: kind, code: code, multiple: multiple, config: config});
                    localStorage["field_id_arr"] = JSON.stringify(field_id_arr);
                    Field.all().filter('idfield', "=", idfield).one(null, function(field) {
                        if (field === null) {
                            addField(kind, name, code, idfield, config);
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
    else {
        getFieldByCollectionId(cId);
    }
}