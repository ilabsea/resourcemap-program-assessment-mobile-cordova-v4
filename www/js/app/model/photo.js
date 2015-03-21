PhotoList = {
  photos: [],
  add: function(photo) {
    PhotoList.photos.push(photo);
    var previousName = App.DataStore.get("photoName_" + photo.id);
    if (previousName){ 
      alert("have previous name store");
      this.remove(previousName);
    }else{
      alert("no previous name : ", JSON.stringify(photo.name));
    }
    App.DataStore.set("photoName_" + photo.id, photo.name);
  },
  remove: function(name) {
    for (var i = 0; i < PhotoList.count(); i++) {
      var photo = PhotoList.getPhotos()[i];
      if (photo.name === name) {
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
  this.id = id; //field id
  this.data = data;
  this.format = format;
  var date = new Date();
  this.name = "" + date.getTime() + "_" + this.id + "." + this.format;
}