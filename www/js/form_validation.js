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
            if ($('.image').attr('src') == '' && $(".image").attr('require') == "required") {
                $(".photo").css({"border": "1px solid red"});
            }
            if (($(element).parent()).is(".ui-select")) {
                $(element).parent().css({"border": "2px solid red",
                    "border-radius": "16px"});
            }
            console.log(element);
        },
        submitHandler: function() {
            if ($(".image").attr('require') == "required") {
                if ($('.image').attr('src') != '') {
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

    $('#form_update_site').validate({
        errorPlacement: function(error, element) {
            if ($('.image').attr('src') == '' && $(".image").attr('require') == "required") {
                $(".photo").css({"border": "1px solid red"});
            }
            if (($(element).parent()).is(".ui-select")) {
                $(element).parent().css({"border": "2px solid red",
                    "border-radius": "16px"});
            }
        },
        submitHandler: function() {
            var sId = localStorage.getItem("sId");
            if ($(".image").attr('require') == "required") {
                if ($('.image').attr('src') != '') {
                    $(".photo").css({"border": ""});
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
        errorPlacement: function(error, element) {
            if ($('.image').attr('src') == '' && $(".image").attr('require') == "required") {
                $(".photo").css({"border": "1px solid red"});
            }
            if (($(element).parent()).is(".ui-select")) {
                $(element).parent().css({"border": "2px solid red",
                    "border-radius": "16px"});
            }
        },
        submitHandler: function() {
            if ($(".image").attr('require') == "required") {
                if ($('.image').attr('src') != '') {
                    $(".photo").css({"border": ""});
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
    console.log("value :", element.value);
    if (element.value != '') {
        $(element).parent().css({"border": "1px solid #f3f3f3",
            "border-radius": "16px"});
    }
    else {
        $(element).parent().css({"border": "2px solid red",
            "border-radius": "16px"});
    }
//        ($(element).parent()).removeAttr("style");
}
