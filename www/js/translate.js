Translation = {
  setLang: function(currentLang){
    localStorage['currentLang'] = currentLang;
    i18n.init({lng: currentLang}, function(){
        $(document.body).i18n();
    });
  },
  getLang: function(){
    return localStorage['currentLang'] ? localStorage['currentLang'] : "en";   
  },
  renderLang: function(){
    var langs = [{ value: "en", text: 'English' }, { value: "kh",  text: "ខ្មែរ" }];
    var currentLang = Translation.getLang();
    for(var i=0 ; i<langs.length; i++){
        if(langs[i].value === currentLang){
            langs[i].selected = true;
            break;
        }
    }
    var languageTemplate = Handlebars.compile($("#language-template").html());
    $('#div-language').html(languageTemplate({langs: langs}));
    $('#div-language').trigger("create");
  },
  translateLang: function(ele){
    Translation.setLang($('#' +ele).val());
  }
  
    
};