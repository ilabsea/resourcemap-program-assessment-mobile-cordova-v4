App = App || {};
App.Template = {
  process: function (templateName, templateData, callback) {
     this._compile(templateName, templateData, callback)
  },
  _compile: function (templateName, templateData, callback) {
    var content = Handlebars.templates[templateName](templateData);
    callback(content);
  }
};
