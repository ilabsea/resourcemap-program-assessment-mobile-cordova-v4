function Photo(sId, id, data, format) {
  this.sId = sId;
  this.id = id;
  this.data = data;
  this.format = format;
  this.name = function() {
    var date = new Date();
    return "" + date.getTime() + "_" + this.id + "." + this.format;
  };
}
