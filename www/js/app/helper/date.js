function dateToParam(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  if (mm < 10) {
    mm = '0' + mm;
  }
  var yyyy = date.getFullYear();
  return  mm + "/" + dd + "/" + yyyy;
}

function prepareForClient(date) {
  if (date.indexOf("/") !== -1) {
    var items = date.split("/");
    d = items[2] + "-" + items[1] + "-" + items[0];
    return d;
  }
  else {
    return date;
  }
}

function prepareForServer(date){
  if (date.indexOf("-") !== -1) {
    var items = date.split("-");
    d = items[2] + "/" + items[1] + "/" + items[0];
    return d;
  }
  else {
    return date;
  }
}
