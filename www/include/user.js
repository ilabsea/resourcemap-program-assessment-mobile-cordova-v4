function addUser(email, password) {
    userParams = {
        email: email,
        password: password
    };
    user = new User(userParams);
    persistence.add(user);
    persistence.flush();
    return user;
}

function validateLogin() {
    var email = $("#email").val();
    var psw = $("#password").val();
    if (!isOnline()) {
        User.all().filter('email', "=", email).one(null, function(user) {
            if (user === null) {
                $('#noMailInDb').show().delay(5000).fadeOut();;
            }
            if (user.password() === psw) {
                setCurrentUser(user);
                location.href = "#submitLogin-page";
            }
            else {
                $('#invalidmail').show().delay(5000).fadeOut();;
            }
            $('#noMailInDb').hide();
            $('#invalidmail').hide();
        });
    }
    else {
        authoriseUser(email, psw);
    }
}

function signUp() {
    var email = $('#signupemail').val();
    var password = $('#signuppassword').val();
    var password_confirmation = $('#pswConfirm').val();
    var data = {user: {email: email, password: password, password_confirmation: password_confirmation}};
    if (password === password_confirmation) {
        $("#passmatch").hide();
        showSpinner();
        $.ajax({
            url: App.URL_SIGNUP,
            type: "POST",
            crossDomain: true,
            data: data,
            success: function() {
                hideSpinner();
                $("#exitemail").hide();
                $("#sign_up_success").show().delay(5000).fadeOut();
                location.href = "#page-login";
                $('#form_signup')[0].reset();
            },
            error: function() {
                hideSpinner();
                $('#exitemail').show().delay(5000).fadeOut();;
                $("#sign_up_success").hide();
                location.href = "#page-signup";
            }
        });
    }
    else
        $("#passmatch").show().delay(5000).fadeOut();;
}

function authoriseUser(email, psw) {
    data = {user: {email: email, password: psw}};
    $('#invalidmail').hide();
    showSpinner();
    $.ajax({
        type: "post",
        data: data,
        url: App.AUTH_URL,
        dataType: "json",
        crossDomain: true,
        success: function(response) {
            setAuthToken(response.auth_token);
            hideSpinner();
            User.all().filter('email', "=", email).one(null, function(user) {
                if (user === null) {
                    var currentUser = addUser(email, psw);
                    setCurrentUser(currentUser);
                }
                else {
                    if (user.password() !== psw) {
                        user.password(psw);
                        persistence.flush();
                    }
                    setCurrentUser(user);
                }
                location.href = "#submitLogin-page";
            });
        },
        error: function() {
            hideSpinner();
            $('#invalidmail').show().delay(5000).fadeOut();;
        }
    });
}


function setCurrentUser(user) {
    hideSpinner();
    var currentUser = {id: user.id, password: user.password(), email: user.email()};
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

function getCurrentUser() {
    var u = localStorage.getItem("currentUser");
    if (u)
        return JSON.parse(u);
    return {};
}

function setAuthToken(auth_token) {
    localStorage.setItem("authToken", auth_token);
}

function getAuthToken() {
    var authToken = localStorage.getItem("authToken");
    console.log("auth: " + authToken);
    return authToken;
}

function resetState() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "#page-login";
    return localStorage.getItem("authToken");
}

function storeToken() {
    return localStorage.authToken;
}

function resetState() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "#page-login";
}

function logout() {
    if (!isOnline()) {
        resetState();
    } else {
        $.ajax({
            type: "post",
            url: App.URL_LOGOUT + getAuthToken(),
            dataType: "json",
            crossDomain: true,
            success: function() {
                resetState();
            },
            error: function() {
                resetState();
            }
        });
    }
    $('#form_login').each(function() {
        this.reset();
    });
}