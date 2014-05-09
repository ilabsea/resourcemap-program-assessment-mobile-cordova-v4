window.lang = window.lang || {};
function HashLang(lang){
    alert("Hash: "+lang);
    
//this.window.lang['kh'] = {
//    
//                        
//                                            
//    };
//window.lang['en'] = {
//                        "form.save": 'save',
//                        "form.login":'login',
//                        "form.signupForm": "Signup",
//                        "form.email":"email",
//                        "form.password":"password",
//                        "form.passwordConfirm": "password confirmation",
//                        "form.phonenumber": "Phon",
//                        "form.haveAccout": "Already have an account"
//    
//                    };
//                    
   var lang = {
        "kh": {
            "ns.special": {
                "app": {
                   "form.save": 'រក្សាទុក',
                            "login":'ការចូល',
                            "email": "អេឡិចត្រូនិច",
                            "password": "លេខសំងាត់",
                            "newAcount": "ចុះឈោះ"
                }
            },
            "ns.common": {}
        },
        "en": {
            "ns.special": {
                "app": {
                     "form.save": 'save',
                        "login":'login',
                        "signupForm": "Signup",
                        "email":"email",
                        "password":"password",
                        "passwordConfirm": "password confirmation",
                        "phonenumber": "Phon",
                        "haveAccout": "Already have an account"
                }
            },
            "ns.common": {}
        },
       };
}

function setLang(lang){  
    
    window.lang = lang;
    alert(window.lang);
    alert("set: "+window.lang);
    HashLang(window.lang);
    
}