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
  },

  find: function(fieldId) {
    $.each(this.photos, function(_, photo){
      if (photo.id == fieldId)
        return photo;
    })
    return false;
  },

  value: function(fieldId) {
    var photo = this.find(fieldId)
    if(photo)
      return photo.value()
    return {}
  }
};
