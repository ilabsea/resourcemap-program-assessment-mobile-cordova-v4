App = App || {};
App.Template = {
  process: function (templateName, templateData, callback) {
    console.log('template', templateName);
    console.time('collection')
    var content = Handlebars.templates[templateName](templateData);
    console.timeEnd('collection')
    callback(content);
  }
};
