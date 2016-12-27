function Photo(id, data, format) {
  this.id = id;
  this.data = data;
  this.format = format;
  var date = new Date();
  this.name =  "" + date.getTime() + "_" + this.id + "." + this.format
}
