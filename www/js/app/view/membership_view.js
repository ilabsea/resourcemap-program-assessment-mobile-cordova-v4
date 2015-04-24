var MembershipView = {
  display: function (templateURL, element, members) {
    App.Template.process(templateURL, members, function (content) {
      element.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
      element.listview("refresh");
      element.html(content);
      element.listview("refresh");
      element.trigger("updatelayout");
    });
  }
};