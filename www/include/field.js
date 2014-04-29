function renderFieldsFromLocalDB(properties) {  
    var fieldIds = [];
    for (pro in properties){
       fieldIds.push(parseInt(pro)) 
    }
    
    queryFieldByCollectionIdOffline(function(fields) {
        var field_collections = [];
        
      
        fields.forEach(function(field) {
            var item = buildField(field, {fromServer: false});
            for (propertyId in properties){
                if(parseInt(item["idfield"])=== parseInt(propertyId)){
                    item.__value = properties[propertyId];
                }
            }
            field_collections.push(item);
        });
        
        
        
        var fieldTemplate = Handlebars.compile($("#field_collection-template").html());
        $('#div_update_field_collection').html(fieldTemplate({field_collections: field_collections}));
        $('#div_update_field_collection').trigger("create");
    })
    
//    Field.all().filter('idfield', 'in', fieldIds).list(null, function(fields) {
//        var field_id_arr = new Array();
//        var field_collections = [];
//        fields.forEach(function(field) {
//            var item = buildField(field, false);
//            field_collections.push(item);
//            localStorage["field_id_arr"] = JSON.stringify(field_id_arr);
//        });
//        var fieldTemplate = Handlebars.compile($("#field_collection-template").html());
//        $('#div_field_collection').html(fieldTemplate({field_collections: field_collections}));
//        $('#div_field_collection').trigger("create");
//    });
}

function buildField(fieldObj, options) {
    options = options || {};
    var field = {};
    var id = null;
    if(options["fromServer"]){
       field = fieldObj;
       id =  fieldObj.id;
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
        widgetType = "checkbox";
        var configOptions = {options: [{"id": 1, "code": "1", "label": "YES"}, {"id": 2, "code": "2", "label": "NO"}]};
        config = configOptions;
        slider = "slider";
        ctrue = "true";
    }
    if (widgetType === "phone") {
        widgetType = "tel";
    }
    var fields = {  idfield: id,
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

function renderFieldByCollectionIdOnline(){
    var cId = localStorage.getItem("cId")
    $.ajax({
        url: App.URL_FIELD + cId + "/fields?auth_token=" + storeToken(),
        type: "get",
        crossDomain: true,
        datatype: 'json',
        success: function(response) {
            var field_id_arr = new Array();
            var field_collections =  [];
            $.each(response, function(key, properties) {
                field_id_arr.push(properties.id);
                var fields = buildField(properties, {fromServer: true} );
                field_collections.push(fields);
                localStorage["field_id_arr"] = JSON.stringify(field_id_arr);
                Field.all().filter('idfield', "=", properties.id).one(null, function(field) {
                    if (field === null) {
                        addField(fields);
                    }
                });
            });
            var fieldTemplate = Handlebars.compile($("#field_collection-template").html());
            $('#div_field_collection').html(fieldTemplate({field_collections: field_collections}));
            $('#div_field_collection').trigger("create");
        },
        error: function(error) {
            console.log("erro:  " + error);
            alert("err" + error);
        }
    });
}

function renderFieldByCollectionIdOffline() {
   queryFieldByCollectionIdOffline(function(fields) {
        var field_collections = [];
        fields.forEach(function(field) {
            var item = buildField(field, {fromServer: false} );
            field_collections.push(item);
        });
        var fieldTemplate = Handlebars.compile($("#field_collection-template").html());
        $('#div_field_collection').html(fieldTemplate({field_collections: field_collections}));
        $('#div_field_collection').trigger("create");
    })
}

function queryFieldByCollectionIdOffline(callback) {
     var cId = localStorage.getItem("cId");
     Field.all().filter('collection_id', '=', cId).list(callback);
}