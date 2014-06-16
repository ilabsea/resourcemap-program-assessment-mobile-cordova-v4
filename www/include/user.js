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
                $('#noMailInDb').show().delay(5000).fadeOut();
            }
            if (user.password() === psw) {
                setCurrentUser(user);
                location.href = "#submitLogin-page";
            }
            else {
                $('#invalidmail').show().delay(5000).fadeOut();
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
        ViewBinding.setBusy(true);
        UserModel.create(App.URL_SIGNUP, data, function() {
            $("#exitemail").hide();
            $("#sign_up_success").show().delay(4000).fadeOut();
            location.href = "#page-login";
            $('#form_signup')[0].reset();
        }, function() {
            $('#exitemail').show().delay(4000).fadeOut();
            $("#sign_up_success").hide();
            location.href = "#page-signup";
        });
    }
    else
        $("#passmatch").show().delay(5000).fadeOut();
}

function authoriseUser(email, psw) {
    var data = {user: {email: email, password: psw}};
    $('#invalidmail').hide();
    ViewBinding.setBusy(true);
    UserModel.create(App.AUTH_URL, data, function(response) {
        setAuthToken(response.auth_token);
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
    }, function() {
        $('#invalidmail').show().delay(5000).fadeOut();
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
        UserModel.create(App.URL_LOGOUT+ getAuthToken(), "", resetState(), resetState())
        }
    $('#form_login').each(function() {
        this.reset();
    });
}
