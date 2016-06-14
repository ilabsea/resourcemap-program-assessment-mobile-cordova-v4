App = App || {};
App.Template = {
  process: function (templateName, templateData) {
    var content = Handlebars.templates[templateName](templateData);
    return content;
  }
};
