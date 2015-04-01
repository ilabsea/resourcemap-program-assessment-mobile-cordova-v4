var FieldOnlineController = {
  renderByCollectionId: function () {
    var cId = App.DataStore.get("cId");
    LayerMembership.fetch(cId, function (layerMemberships) {
      FieldModel.fetch(function (layers) {
        var field_id_arr = new Array();
        var location_fields_id = new Array();
        var field_collections = $.map(layers, function (layer) {
          $.map(layer.fields, function (field) {
            field_id_arr.push(field.id);
            if (field.kind === "location")
              location_fields_id.push(field.id);
          });
          var fields = FieldHelper.buildField(layer, {fromServer: true},
          layerMemberships);
          return fields;
        });
        
        App.DataStore.set("field_id_arr", JSON.stringify(field_id_arr));
        App.DataStore.set("location_fields_id", JSON.stringify(location_fields_id));
        FieldController.synForCurrentCollection(field_collections);
        FieldView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu'),
            {field_collections: field_collections}, "");
        FieldView.display("field/add.html", $('#div_field_collection'), "",
            {field_collections: field_collections}, false);
      });
    });
  },
  renderUpdate: function (siteData) {
    var cId = App.DataStore.get("cId");
    var sId = localStorage.getItem("sId");

    SitesPermission.fetch(cId, function (site) {
      if ((!site.read && !site.write && !site.none)
          || (site.read.all_sites && site.write.all_sites && site.none.all_sites))
        LayerMembershipsHelper.buildAllLayersOfSite(cId, siteData);
      else
        LayerMembershipsHelper.buildCustomerSitePermission(site, siteData, cId, sId);
    });
  }
};