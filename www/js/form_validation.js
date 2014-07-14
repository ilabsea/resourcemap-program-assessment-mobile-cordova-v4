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
        errorPlacement: function(error, element) {
            if ($('img.photoPreview', this).attr('src') != '' && $(".image").attr('require') == "required") {
                $(".photo").css({"border": "1px solid red"});
            }
        },
        submitHandler: function() {
            if ($(".image").attr('require') == "required") {
                if ($('img.photoPreview', this).attr('src') == '') {
                    $(".photo").css({"border": ""});
                    addSiteToServer();
                } else {
                    $(".photo").css({"border": "1px solid red"});
                }
            } else {
                addSiteToServer();
            }

        }
    });
    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
});