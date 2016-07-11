App = App || {};
App.Template = {
  process: function (templateName, templateData) {
    App.log("tempate name: " + templateName);
    var content = Handlebars.templates[templateName](templateData);
    return content;
  }
};
