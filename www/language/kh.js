window.lang = window.lang || {};
function HashLang(){
this.window.lang['kh'] = {"form.save": 'រក្សាទុក', "form.login":'ការចូល'};
}
function setLang(lang){  
    window.lang = lang;
    alert("set: "+window.lang);
    
}

