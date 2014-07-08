function renderFieldsBySite(site) {
    queryFieldByCollectionIdOffline(function(fields) {
        var field_collections = [];
        fields.forEach(function(field) {
            var item = buildFieldsCollection(field, site, false);
            field_collections.push(item);
        });
        displayFieldUpdateTemplate(field_collections);
    });
}

function renderFieldsBySiteFromServer(site) {
    ViewBinding.setBusy(true);
    FieldModel.fetch(function(response) {
        var field_collections = [];
        $.each(response, function(key, properties) {
            var item = buildFieldsCollection(properties, site, true);
            field_collections.push(item);
        });
        displayFieldUpdateOnlineTemplate(field_collections);
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
        var fields = {};
        $.each(response, function(key, properties) {
            $.each(properties.fields, function(i, fieldsInside) {
                field_id_arr.push(fieldsInside.id);
            });
            fields = buildField(properties, {fromServer: true});
            field_collections.push(fields);
            Field.all().filter('id_wrapper', "=", fields.id_wrapper).one(null, function(field) {
                console.log("field", fields);
                if (field === null) {
                    addField(fields);
                }
            });
        });

        localStorage["field_id_arr"] = JSON.stringify(field_id_arr);
        synFieldForCurrentCollection(field_collections);
        displayFieldRender(field_collections);
    });
}

function renderFieldByCollectionIdOffline() {
    var field_collections = [];
    queryFieldByCollectionIdOffline(function(fields) {
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