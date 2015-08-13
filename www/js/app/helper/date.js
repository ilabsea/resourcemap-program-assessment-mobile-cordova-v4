function dateToParam(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  if (mm < 10) {
    mm = '0' + mm;
  }
  var yyyy = date.getFullYear();
  return  mm + "/" + dd + "/" + yyyy;
}

function convertDateWidgetToParam(format) {
  var d;
  if (format.indexOf("-") !== -1) { //native HTML5 date
    var items = format.split("-");
    d = items[2] + "/" + items[1] + "/" + items[0];
    return d;
  }
  else if (format.indexOf("/") !== -1) { //native HTML5 date
    var items = format.split("/");
    d = items[2] + "-" + items[1] + "-" + items[0];
    return d;
  }
  else {
    return format;//unsported
  }
}