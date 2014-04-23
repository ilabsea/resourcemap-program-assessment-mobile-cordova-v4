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
            var status = navigator.onLine;
            if (isOnline()) {
                alert("online");
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
            alert("submitting")
            addSiteToServer();
        }
    });
    
     jQuery.validator.setDefaults({
          debug: true,
          success: "valid"
        });
        $( "#form_create_site" ).validate({
          rules: {
            field: {
              required: true,
              number: true
            }
         }
     });
    
});
