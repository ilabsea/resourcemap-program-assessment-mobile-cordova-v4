function dateToParam(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  if (mm < 10) {
    mm = '0' + mm;
  }
  var yyyy = date.getFullYear();
  return  mm + "/" + dd + "/" + yyyy;
}

function convertDateWidgetToParam(date) {
  var d;
  if (date.indexOf("-") !== -1) { //native HTML5 date
    var items = date.split("-");
    d = items[2] + "/" + items[1] + "/" + items[0];
    return d;
  }
  else if (date.indexOf("/") !== -1) { //native HTML5 date
    var items = date.split("/");
    d = items[2] + "-" + items[1] + "-" + items[0];
    return d;
  }
  else {
    return date;//unsported
  }
}
