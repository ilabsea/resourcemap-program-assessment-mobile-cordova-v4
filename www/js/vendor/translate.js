Translation = {
  setLang: function(currentLang) {
    localStorage['currentLang'] = currentLang;
    i18n.init({lng: currentLang}, function() {
      $(document.body).i18n();
    });
    jqueryValidationForm = jquery_validation[currentLang];
    $.extend($.validator.messages, jqueryValidationForm);
  },
  getLang: function() {
    return localStorage['currentLang'] ? localStorage['currentLang'] : "en";
  },
  renderLang: function() {
    var langs = [{value: "en", text: 'English'}, {value: "kh", text: "ខ្មែរ"}];
    var currentLang = Translation.getLang();
    for (var i = 0; i < langs.length; i++) {
      if (langs[i].value === currentLang) {
        langs[i].selected = true;
        break;
      }
    }
    Translation.displayTemplate({langs: langs});
  },
  translateLang: function(ele) {
    Translation.setLang($('#' + ele).val());
  },
  displayTemplate: function(language) {
    App.Template.process("language/menu.html", language, function(content) {
      $('#div-language').html(content);
      $('#div-language').trigger("create");
    });
  }
};
