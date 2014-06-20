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