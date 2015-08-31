var SiteView = {
  display: function (element, siteData) {
    App.Template.process("site/list.html", siteData, function (content) {
      element.append(content);
      element.listview("refresh");
    });
  },
  displayUpdateLatLng: function (templateURL, element, siteUpdateData) {
    App.Template.process(templateURL, siteUpdateData, function (content) {
      element.html(content);
      element.trigger("create");
    });
  },
  displayError: function (templateURL, element, fieldData) {
    App.Template.process(templateURL, fieldData, function (content) {
      element.html(content);
      setTimeout(function () {
        Dialog.showDialog("page-error-submit-site");
      }, 50);
      element.css("z-index", 200000);
    });
  }
};