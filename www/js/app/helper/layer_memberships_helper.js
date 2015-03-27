LayerMembershipsHelper = {
  build: function (layers, write) {
    var layerMemberships = [];
    $.map(layers, function (layer) {
      layerMemberships.push({read: true, write: write, layer_id: layer.id});
    });
    return layerMemberships;
  },
  buildAllLayersOfSite: function (cId, siteData) {
    LayerMembership.fetch(cId, function (layerMemberships) {
      FieldModel.fetch(function (layers) {
        var field_collections = FieldHelper.buildFieldsUpdate(layers, siteData,
            true, layerMemberships);
        FieldView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu-update-online'),
            {field_collections: field_collections}, "update_online_");
        FieldView.display("field/updateOnline.html",
            $('#div_update_field_collection_online'),
            "update_online_", {field_collections: field_collections}, true);
      });
    });
  },
  buildCustomerSitePermission: function (site, siteData, cId, sId) {
    if (site.write.some_sites.length !== 0) 
      LayerMembershipsHelper.buildCustomerSiteReadWrite(site.write, true, siteData
          , cId, sId);
    else if (site.read.some_sites.length !== 0) 
      LayerMembershipsHelper.buildCustomerSiteReadWrite(site.read, false, siteData,
          cId, sId);
    else if (site.none.some_sites.length !== 0) 
      LayerMembershipsHelper.buildCustomerSiteReadWrite(site.none, "none", siteData,
          cId, sId);
  },
  buildCustomerSiteReadWrite: function (siteState, rw, siteData, cId, sId) {
    $.map(siteState.some_sites, function (some_site) {
      if (some_site.id == sId)
        LayerMembershipsHelper.buildSiteWithVisibleLayers(siteData, rw);
      else{
        $('#div_update_field_collection_online').show();
        LayerMembershipsHelper.buildAllLayersOfSite(cId, siteData);
      }
    });
  },
  buildSiteWithVisibleLayers: function (siteData, rw) {
    VisibleLayersFor.fetch(function (layers) {
      var layerMemberships = LayerMembershipsHelper.build(layers, rw);
      var field_collections = FieldHelper.buildFieldsUpdate(layers,
          siteData, true, layerMemberships);
      FieldView.displayLayerMenu("layer/menu.html", $('#ui-btn-layer-menu-update-online'),
          {field_collections: field_collections}, "update_online_");
      FieldView.display("field/updateOnline.html",
          $('#div_update_field_collection_online'),
          "update_online_", {field_collections: field_collections}, true);
      if (rw === 'none')
        $('#div_update_field_collection_online').hide();
    });
  }
};


