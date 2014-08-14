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
  App.DataStore.set("currentUser", JSON.stringify(currentUser));
}

function getCurrentUser() {
  var u = App.DataStore.get("currentUser");
  if (u)
    return JSON.parse(u);
  return {};
}

function setAuthToken(auth_token) {
  App.DataStore.set("authToken", auth_token);
}

function getAuthToken() {
  var authToken = App.DataStore.get("authToken");
  return authToken;
}

function resetState() {
  App.DataStore.remove("authToken");
  App.DataStore.remove("cId");
  App.DataStore.remove("collectionName");
  App.DataStore.remove("currentUser");
  App.DataStore.remove("field_id_arr");
  App.DataStore.remove("sId");
}