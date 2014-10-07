LayerMembershipsHelper = {
  build: function(layers, write) {
    var layerMemberships = [];
    $.each(layers, function(i, layer) {
      layerMemberships.push({read: true, write: write, layer_id: layer.id});
    });
    return layerMemberships;
  },
  buildAllLayersOfSite: function(cId, siteData) {
    LayerMembership.fetch(cId, function(layerMemberships) {
      FieldModel.fetch(function(layers) {
        var field_collections = FieldHelper.buildFieldsUpdate(layers, siteData,
            true, layerMemberships);
        FieldController.display("field/updateOnline.html",
            $('#div_update_field_collection_online'),
            "update_online_", {field_collections: field_collections}, true);
      });
    });
  },
  buildCustomerSitePermission: function(site, siteData, cId, sId) {
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
  buildCustomerSiteReadWrite: function(siteState, rw, siteData, cId, sId) {
    $.each(siteState.some_sites, function(i, some_site) {
      if (some_site.id == sId)
        LayerMembershipsHelper.buildSiteWithVisibleLayers(siteData, rw);
      else
        LayerMembershipsHelper.buildAllLayersOfSite(cId, siteData);
    });
  },
  buildSiteWithVisibleLayers: function(siteData, rw) {
    VisibleLayersFor.fetch(function(layers) {
      var layerMemberships = LayerMembershipsHelper.build(layers, rw);
      var field_collections = FieldHelper.buildFieldsUpdate(layers,
          siteData, true, layerMemberships);
      FieldController.display("field/updateOnline.html",
          $('#div_update_field_collection_online'),
          "update_online_", {field_collections: field_collections}, true);
      if(rw === 'none')
        $('#div_update_field_collection_online').hide();
    });
  }
};


