function Photo(id, data, format) {
  this.id = id;
  this.data = data;
  this.format = format;
}

Photo.prototype.name = function(){
  var date = new Date();
  return "" + date.getTime() + "_" + this.id + "." + this.format;
}

// properties[fieldId] = fileName;
// files[fileName] = PhotoList.getPhotos()[p].data;
Photo.prototype.value = function(){
  return { filename: photo.name(), data: photo.data }
}
