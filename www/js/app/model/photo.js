PhotoList = {
  photos: [],
  add: function(photo) {
    PhotoList.remove(photo.id);
    PhotoList.photos.push(photo);
  },
  remove: function(id) {
    for (var i = 0; i < PhotoList.count(); i++) {
      var photo = PhotoList.getPhotos()[i];
      if (photo.id === id) {
        return PhotoList.photos.splice(i, 1);
      }
    }
  },
  getPhotos: function() {
    return PhotoList.photos;
  },
  clear: function() {
    PhotoList.photos = [];
  },
  count: function() {
    return PhotoList.getPhotos().length;
  }
};

function Photo(id, data, format) {
  this.id = id;
  this.data = data;
  this.format = format;
  var date = new Date();
  this.name = "" + date.getTime() + "_" + this.id + "." + this.format;
}