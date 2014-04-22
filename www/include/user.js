function addUser(email, password) {
    userParams = {
        email: email,
        password: password
    };
    user = new User(userParams);
    persistence.add(user);
    persistence.flush();
}

function validateLogin() {
    var email = $("#email").val();
    var psw = $("#password").val();
    if (!isOnline()) {
        User.all().filter('email', "=", email).one(null, function(user) {
            if (user === null) {
                $('#noMailInDb').show();
            }
            if (user.password() === psw) {
                App.userId = user.id;
                localStorage.setItem("userId", App.userId);
                location.href = "#submitLogin-page";
            }
            else {
                $('#invalidmail').slideDown();
            }
            $('#noMailInDb').hide();
            $('#invalidmail').hide();
        });
    } else {
        getAuthToken(email, psw);
    }
}
// ============================== online ===========================================
function signUp() {
    email = $('#signupemail').val();
    password = $('#signuppassword').val();
    password_confirmation = $('#pswConfirm').val();
    data = {user: {email: email, password: password, password_confirmation: password_confirmation}};
    if (password === password_confirmation) {
        $("#passmatch").hide();
        $.ajax({
            url: App.URL_SIGNUP,
            type: "POST",
            crossDomain: true,
            data: data,
            success: function() {
                $("#exitemail").hide();
                location.href = "#page-login";
                $('#form_signup').each(function() {
                    this.reset();
                });
            },
            error: function() {
                $("#exitemail").show();
                location.href = "#page-signup";
            }
        });
    }
    else
        $("#passmatch").slideDown();
}

function getAuthToken(email, psw) {
    data = {user: {email: email, password: psw}};
    $('#invalidmail').hide();
    $.ajax({
        type: "post",
        data: data,
        url: App.AUTH_URL,
        dataType: "json",
        crossDomain: true,
        success: function(response) {
            localStorage.authToken = response.auth_token;
            location.href = "#submitLogin-page";
            User.all().filter('email', "=", email).one(null, function(user) {
                if (user === null) {
                    addUser(email, psw);
                    User.all().filter('email', "=", email).one(null, function(user) {
                        App.userId = user.id;
                        localStorage.setItem("userId", App.userId);
                    });
                } else {
                    if (user.password() !== psw) {
                        user.password(psw);
                        persistence.flush();
                    } else {
                        App.userId = user.id;
                        localStorage.setItem("userId", App.userId);
                    }
                }
            });
        },
        error: function() {
            $('#invalidmail').show();
        }
    });
}

function storeToken() {
    return localStorage.authToken;
}

function logout() {
    if (!isOnline()){
        localStorage.clear();
        sessionStorage.clear();
        var len = history.length;
        history.go(-len+1);
    } else {
        $.ajax({
            type: "post",
            url: App.URL_LOGOUT + storeToken(),
            dataType: "json",
            crossDomain: true,
            success: function() {
                localStorage.clear();
                sessionStorage.clear();
                var len = history.length;
                history.go(-len+1);
            },
            error: function() {
                alert("logout fail");
            }
        });
    }
}