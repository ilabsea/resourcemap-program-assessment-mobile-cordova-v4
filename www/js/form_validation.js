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
            error.insertAfter($(element).parent());
        },
        submitHandler: function() {
            addSiteToServer();
        }
    });
    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
});
