$(document).ready(function() {

    $('#form_login').validate({
        focusInvalid: false,
        errorPlacement: function() {
        },
        invalidHandler: function() {
            $('#validation_email_psd').show().delay(4000).fadeOut();
        },
        submitHandler: function() {
            validateLogin();
        }
    });

    $('#form_signup').validate({
        focusInvalid: false,
        errorPlacement: function() {
        },
        submitHandler: function() {
            if (isOnline()) {
                $("#internet").hide();
                signUp();
            }
            else
                $("#internet").show();
        },
        invalidHandler: function(event, validator) {
            $('#validation_email_psd_confirm').show().delay(4000).fadeOut();
        }
    });

    $('#form_create_site').validate({
        focusInvalid: false,
        errorPlacement: function(error, element) {
            if ($('.image').attr('src') == '' && $(".image").attr('require') == "required") {
                $(".photo").css({"border": "1px solid red"});
            }
            else{
                $(".photo").css({"border": "1px solid #f3f3f3"});
            }
            if (($(element).parent()).is(".ui-select")) {
                $(element).parent().css({"border": "2px solid red",
                    "border-radius": "16px"});
            }
        },
        invalidHandler: function() {
            $('#validation_create-site').show().delay(4000).fadeOut();
            $("#validation_create-site").focus();
        },
        submitHandler: function() {
            if ($(".image").attr('require') == "required") {
                if ($('.image').attr('src') != '') {
                    $(".photo").css({"border": "1px solid #f3f3f3"});
                    addSiteToServer();
                } else {
                    $(".photo").css({"border": "1px solid red"});
                }
            } else {
                addSiteToServer();
            }
        }
    });

    $('#form_update_site').validate({
        focusInvalid: false,
        errorPlacement: function(error, element) {
            if ($('.image').attr('src') == '' && $(".image").attr('require') == "required") {
                $(".photo").css({"border": "1px solid red"});
            }
            if (($(element).parent()).is(".ui-select")) {
                $(element).parent().css({"border": "2px solid red",
                    "border-radius": "16px"});
            }
        },
        invalidHandler: function() {
            $('#validation_update-site').show().delay(4000).fadeOut();
            $("#validation_update-site").focus();
        },
        submitHandler: function() {
            var sId = localStorage.getItem("sId");
            if ($(".image").attr('require') == "required") {
                if ($('.image').attr('src') != '') {
                    $(".photo").css({"border": "1px solid #f3f3f3"});
                    updateSiteBySiteId(sId);
                } else {
                    $(".photo").css({"border": "1px solid red"});
                }
            } else {
                updateSiteBySiteId(sId);
            }
        }
    });

    $('#form_update_site_online').validate({
        focusInvalid: false,
        errorPlacement: function(error, element) {
            if ($('.image').attr('src') == '' && $(".image").attr('require') == "required") {
                $(".photo").css({"border": "1px solid red"});
            }else{
                $(".photo").css({"border": "1px solid #f3f3f3"});
            }
            if (($(element).parent()).is(".ui-select")) {
                $(element).parent().css({"border": "2px solid red",
                    "border-radius": "16px"});
            }
        },
        invalidHandler: function() {
            $('#validation_update-site-online').show().delay(4000).fadeOut();
            $("#validation_update-site-online").focus();
        },
        submitHandler: function() {
            if ($(".image").attr('require') == "required") {
                if ($('.image').attr('src') != '') {
                    $(".photo").css({"border": "1px solid #f3f3f3"});
                    updateSiteBySiteIdFromServer();
                } else {
                    $(".photo").css({"border": "1px solid red"});
                }
            } else {
                updateSiteBySiteIdFromServer();
            }
        }
    });

    jQuery.validator.setDefaults({
        debug: true,
        success: "valid",
        ignore: ":hidden:not(select)"
    });
});

function validateToRemoveStyle(element) {
    if (element.value != '') {
        $(element).parent().css({"border": "1px solid #f3f3f3",
            "border-radius": "16px"});
    }
    else {
        $(element).parent().css({"border": "2px solid red",
            "border-radius": "16px"});
    }
}
