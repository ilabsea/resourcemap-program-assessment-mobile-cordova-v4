function renderFieldsBySite(site) {
    queryFieldByCollectionIdOffline(function(layers) {
        var field_collections= buildFieldsCollection(layers, site, false);
        displayFieldUpdateTemplate({field_collections: field_collections});
    });
}

function renderFieldsBySiteFromServer(site) {
    FieldModel.fetch(function(layers) {
        var field_collections= buildFieldsCollection(layers, site, true);
        displayFieldUpdateOnlineTemplate({field_collections: field_collections});
    });
}

function getFieldsCollection() {
    if (isOnline())
        renderFieldByCollectionIdOnline();
    else
        renderFieldByCollectionIdOffline();
}

function renderFieldByCollectionIdOnline() {
    FieldModel.fetch(function(response) {
        var field_id_arr = new Array();
        var field_collections = [];
        $.each(response, function(key, properties) {
            $.each(properties.fields, function(i, fieldsInside) {
                field_id_arr.push(fieldsInside.id);
            });
            var fields = buildField(properties, {fromServer: true});
            
            field_collections.push(fields);
        });
        localStorage["field_id_arr"] = JSON.stringify(field_id_arr);
        synFieldForCurrentCollection(field_collections);
        displayFieldRender({field_collections: field_collections});
    });
}

function renderFieldByCollectionIdOffline() {
    queryFieldByCollectionIdOffline(function(fields) {
        var field_id_arr = new Array();
        var field_collections = [];
        fields.forEach(function(field) {
            $.each(field.fields(), function(i, fieldsInfield){
                field_id_arr.push(fieldsInfield.idfield);
            });
            var item = buildField(field._data, {fromServer: false});
            field_collections.push(item);
        });
        localStorage["field_id_arr"] = JSON.stringify(field_id_arr);
        displayFieldRender({field_collections: field_collections});
    });
}