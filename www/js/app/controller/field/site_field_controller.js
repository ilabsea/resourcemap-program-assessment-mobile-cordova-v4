var SiteFieldController = {
  autoComplete: function (ulElement, data) {
    var $ul = $(ulElement),
        $input = $(data.input),
        value = $input.val();
    $ul.html("");
    if (value && value.length > 0) {
      if (App.isOnline()) {
        SitesByTerm.fetch(value, function (sites) {
          AutoComplete.display("field/site.html", $ul, {sites: sites});
        });
      } else {
        var cId = App.DataStore.get("cId");
        SiteOffline.fetchByCollectionId(cId, function (sites) {
          var sitesJson = SiteFieldController.buildSitesOffline(sites);
          var matches = SiteFieldController.matchSiteOffline(sitesJson, value);
          AutoComplete.display("field/site.html", $ul, {sites: matches});
        });
      }
    }
  },
  matchSiteOffline: function (sites, value) {
    var matches = $.map(sites, function (site) {
      var b = false;
      $.each(site.properties, function (i, p) {
        if (site.name.indexOf(value) > -1 || p.indexOf(value) > -1) {
          b = true;
          return;
        }
      });
      if (b)
        return site;
    });
    return matches;
  },
  buildSitesOffline: function (sites) {
    var sitesJson = [];
    $.map(sites, function (site) {
      var data = {
        name: site.name(),
        properties: site.properties()
      };
      sitesJson.push(data);
    });
    return sitesJson;
  }
};