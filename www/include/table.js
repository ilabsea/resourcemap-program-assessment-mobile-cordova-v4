function createTables() {
    Collection = persistence.define('collections', {
        idcollection: "INT",
        name: "TEXT",
        description: "TEXT",
        user_id: "INT"
    });

    User = persistence.define('users', {
        email: "TEXT",
        password: "TEXT"
    });

    Site = persistence.define('sites', {
        idsite: "INT",
        name: "TEXT",
        lat: "INT",
        lng: "INT",
        created_at: "DATE",
        collection_id: "INT",
        collection_name: "TEXT",
        user_id: "INT",
        properties: "JSON",
        files: "JSON"
    });

    Field = persistence.define('fields', {
        idfield: "INT",
        kind: "TEXT",
        name: "TEXT",
        code: "TEXT",
        multiple: "TEXT",
        isPhoto: "INT",
        widgetType: "TEXT",
        collection_id: "INT",
        config: "JSON",
        slider: "TEXT",
        ctrue: "TEXT",
        isHierarchy: "INT",
        user_id: "INT"
    });
}