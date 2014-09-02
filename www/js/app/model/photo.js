PhotoList = {
  photos: [],
  add: function(photo) {
    PhotoList.remove(photo.sId, photo.id);
    PhotoList.photos.push(photo);
  },
  remove: function(sId, id) {
    for (var i = 0; i < PhotoList.count(); i++) {
      var photo = PhotoList.getPhotos()[i];
      if (photo.id == id && photo.sId == sId) {
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

function Photo(sId, id, data, format) {
  this.sId = sId;
  this.id = id;
  this.data = data;
  this.format = format;
  this.name = function() {
    var date = new Date();
    return "" + date.getTime() + "_" + this.sId + "_" + this.id + "." + this.format;
  };
}

SiteCamera = {
  format: "jpeg",
  dataWithMimeType: function(data) {
    return 'data:image/jpeg;base64,' + data;
  },
  takePhoto: function(idField, updated, cameraType) {
    var type;
    if (cameraType == "camera") {
      type = Camera.PictureSourceType.CAMERA;
    }
    else {
      type = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    }
    SiteCamera.id = idField;
    SiteCamera.updated = updated;
    var cameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: type,
      encodingType: Camera.EncodingType.JPEG
    };
    navigator.camera.getPicture(SiteCamera.onSuccess, SiteCamera.onFail, cameraOptions);
  },
  onSuccess: function(imageData) {
    var sId = localStorage.getItem("sId");
    var imageId = SiteCamera.imageId();
    var image = document.getElementById(imageId);
    var photo = new Photo(sId, SiteCamera.id, imageData, SiteCamera.format);
    image.src = SiteCamera.dataWithMimeType(imageData);

    PhotoList.add(photo);
    validateImage(imageId);
  },
  imageId: function() {
    var imageId;
    if (SiteCamera.updated == 'update')
      imageId = "update_" + SiteCamera.id;
    else if (SiteCamera.updated == 'update_online')
      imageId = "update_online_" + SiteCamera.id;
    else
      imageId = SiteCamera.id;
    return  imageId;
  },
  onFail: function() {
  }
};

function openCameraDialog(idField, updated) {
  $('#currentCameraImage').val(idField);
  $('#currentCameraImageType').val(updated);
  $.mobile.changePage("#cameraDialog", {role: "dialog"});
  localStorage['no_update_reload'] = 1;
}

function invokeCamera(cameraType) {
  var idField = $('#currentCameraImage').val();
  var updated = $('#currentCameraImageType').val();
  SiteCamera.takePhoto(idField, updated, cameraType);
  closeDialog();
}

function closeDialog() {
  $('#cameraDialog').dialog('close');
}

function imagePath(imgFileName) {
  return App.IMG_PATH + imgFileName;
}