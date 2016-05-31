PhotoList = {
  photos: [],
  add: function(photo) {
    PhotoList.remove(photo.sId, photo.id);
    PhotoList.photos.push(photo);
  },
  remove: function(sId, id) {
    for (var i = 0; i < PhotoList.count(); i++) {
      var photo = PhotoList.getPhotos()[i];
      if (photo.id === id && photo.sId === sId) {
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
