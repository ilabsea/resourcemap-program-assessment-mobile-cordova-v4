$(document).ready(function() {

    $('#form_login').validate({
        focusInvalid: false,
        errorPlacement: function() {
        },
        invalidHandler: function() {
            showValidateMessage('#validation_email_psd');
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
            showValidateMessage('#validation_email_psd_confirm');
        }
    });
    $('#form_create_site').validate({
        focusInvalid: false,
        errorPlacement: function(error, element) {
            validateImage();
            addClassError(element);
        },
        invalidHandler: function() {
            showValidateMessage('#validation_create-site');
        },
        submitHandler: function() {
            if ($(".image").attr('require') == "required") {
                if ($('.image').attr('src') != '') {
                    $(".photo").css({"border": "1px solid #f3f3f3"});
                    addSiteToServer();
                } else {
                    $(".photo").css({"border": "1px solid red"});
                    showValidateMessage('#validation_create-site');
                }
            } else {
                addSiteToServer();
            }
        }
    });
    $('#form_update_site').validate({
        focusInvalid: false,
        errorPlacement: function(error, element) {
            validateImage();
            addClassError(element);
        },
        invalidHandler: function() {
            showValidateMessage('#validation_update-site');
        },
        submitHandler: function() {
            var sId = localStorage.getItem("sId");
            if ($(".image").attr('require') == "required") {
                if ($('.image').attr('src') != '') {
                    $(".photo").css({"border": "1px solid #f3f3f3"});
                    updateSiteBySiteId(sId);
                } else {
                    $(".photo").css({"border": "1px solid red"});
                    showValidateMessage('#validation_update-site');
                }
            } else {
                updateSiteBySiteId(sId);
            }
        }
    });
    $('#form_update_site_online').validate({
        focusInvalid: false,
        errorPlacement: function(error, element) {
            validateImage();
            addClassError(element);
        },
        invalidHandler: function() {
            showValidateMessage('#validation_update-site-online');
        },
        submitHandler: function() {
            if ($(".image").attr('require') == "required") {
                if ($('.image').attr('src') != '') {
                    $(".photo").css({"border": "1px solid #f3f3f3"});
                    updateSiteBySiteIdFromServer();
                } else {
                    $(".photo").css({"border": "1px solid red"});
                    showValidateMessage('#validation_update-site-online');
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
    if (element.required && element.value == "") {
        $(element).parent().removeClass('valid');
        $(element).parent().addClass('error');
    }
    else {
        $(element).parent().removeClass('error');
        $(element).parent().addClass('valid');
    }
}

function validateImage() {
    if ($('.image').attr('src') == '' && $(".image").attr('require') == "required") {
        $(".photo").css({"border": "1px solid red"});
    } else {
        $(".photo").css({"border": "1px solid #f3f3f3"});
    }
}

function showValidateMessage(id) {
    $(id).show().delay(4000).fadeOut();
    $(id).focus();
}

function addClassError(element) {
    var $parent = $(element).closest('.ui-select');
    $parent.addClass("error");
}