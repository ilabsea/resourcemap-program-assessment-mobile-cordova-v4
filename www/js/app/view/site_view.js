var SiteView = {
  display: function (element, siteData) {
    App.Template.process("site/list.html", siteData, function (content) {
      element.html(content);
      element.listview("refresh");
    });
  },
  displayUpdateLatLng: function (templateURL, element, suffix, siteUpdateData) {
    App.Template.process(templateURL, siteUpdateData, function (content) {
      element.html(content);
      element.trigger("create");
      InvisibleLayer.invisibleNameLatLng("update_wrapSiteLocation" + suffix,
          "update_wrapSiteName" + suffix, function () {
          });
    });
  }
};