function requireReload(callback) {
  if (localStorage['no_update_reload'] != undefined)
    localStorage.removeItem('no_update_reload');
  else {
    callback();
  }
}