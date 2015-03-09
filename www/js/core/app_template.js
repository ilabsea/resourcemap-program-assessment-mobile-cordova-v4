App = App || {};
App.Template = {
  process: function (templateURL, templateData, callback) {
    var path = "js/app/template/" + templateURL;
    var templateText = App.Cache.get(templateURL);

    if (templateText != null) {
      App.Template._compile(templateText, templateData, callback);
      return;
    }

    $.ajax({
      url: path,
      cache: true,
      success: function (templateText) {
        App.Cache.set(templateURL, templateText);
        App.Template._compile(templateText, templateData, callback);
      }
    });
  },
  _compile: function (templateText, templateData, callback) {
    var template = Handlebars.compile(templateText);
    var content = template(templateData);
    callback(content);
  }
};