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
                $('#noMailInDb').show();
            }
            if (user.password() === psw) {
                setCurrentUser(user);
                location.href = "#submitLogin-page";
            }
            else {
                $('#invalidmail').slideDown();
            }
            $('#noMailInDb').hide();
            $('#invalidmail').hide();
        });
    } 
    else {
        authoriseUser(email, psw);
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
                $('#form_signup')[0].reset();
            },
            error: function() { 
                $('#exitemail').show();
                location.href = "#page-signup";
            }
        });
    }
    else
        $("#passmatch").slideDown();
}

function authoriseUser(email, psw) {
    data = {user: {email: email, password: psw}};
    $('#invalidmail').hide();
    $.ajax({
        type: "post",
        data: data,
        url: App.AUTH_URL,
        dataType: "json",
        crossDomain: true,
        success: function(response) {
            setAuthToken( response.auth_token);
            location.href = "#submitLogin-page";
            
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
            });
        },
        error: function() {
            $('#invalidmail').show();
        }
    });
}
function setCurrentUser(user){
  var currentUser = { id: user.id, password: user.password(), email: user.email()} 
  localStorage.setItem("currentUser", JSON.stringify(currentUser) );
}
function getCurrentUser(){
  var u = localStorage.getItem("currentUser")
  if(u)
    return JSON.parse(u);
  return {};
}
function setAuthToken(auth_token){
   localStorage.setItem("authToken", auth_token);
}
function getAuthToken(){
    return localStorage.getItem("authToken");
}
function storeToken() {
  return localStorage.authToken;
}

function resetState(){
   localStorage.clear();
   sessionStorage.clear();
   window.location.href = App.AUTH_URL;
}
function logout() {
    if (!isOnline()){
        resetState();  
    } else {
        $.ajax({
            type: "post",
            url: App.URL_LOGOUT + storeToken(),
            dataType: "json",
            crossDomain: true,
            success: function() {
                resetState();
            },
            error: function() {
                alert("logout fail");
            }
        });
    }
}