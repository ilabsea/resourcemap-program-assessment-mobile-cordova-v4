$(document).ready(function() {
    $('#form_login').validate({
        errorPlacement: function(error, element) {
            error.insertAfter($(element).parent());
        },
        submitHandler: function() {
            validateLogin();
        }
    });
    $('#form_signup').validate({
        errorPlacement: function(error, element) {
            error.insertAfter($(element).parent());
        },
        submitHandler: function() {
            if (isOnline()) {
                $("#internet").hide();
                signUp();
            }
            else
                $("#internet").show();
        }
    });
    $('#form_create_site').validate({
        rules: {
            things: {
                required: true
            }
        },
        errorPlacement: function(error, element) {
//            error.insertAfter($(element).parent());
//console.log($("select"))
            if ($('img.photoPreview', this).attr('src') != '' && $(".image").attr('require') == "required") {
                $(".photo").css({"border": "1px solid red"});
            }
        },
        submitHandler: function() {
            if ($('img.photoPreview', this).attr('src') == '') {
                $(".photo").css({"border": ""});
                addSiteToServer();
            }
        }
    });
    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
});