App = App || {};
App.Template = {
  process: function (templateName, templateData, callback) {
    var content = Handlebars.templates[templateName](templateData);
    callback(content);
  }
};
