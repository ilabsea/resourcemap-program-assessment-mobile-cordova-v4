SiteCamera = {
  format: "jpeg",
  dataWithMimeType: function(data) {
    return 'data:image/jpeg;base64,' + data;
  },
  takePhoto: function(idField, updated, cameraType) {
    var type;
    if (cameraType === "camera") {
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
    var imageId = SiteCamera.imageId();
    var image = document.getElementById(imageId);
    var photo = new Photo(SiteCamera.id, imageData, SiteCamera.format);
    image.src = SiteCamera.dataWithMimeType(imageData);

    PhotoList.add(photo);
    ValidationHelper.validateImageChange(imageId);
  },
  imageId: function() {
    var imageId;
    if (SiteCamera.updated === 'update')
      imageId = "update_" + SiteCamera.id;
    else if (SiteCamera.updated === 'update_online')
      imageId = "update_online_" + SiteCamera.id;
    else
      imageId = SiteCamera.id;
    return  imageId;
  },
  imagePath: function(imgFileName) {
    return App.IMG_PATH + imgFileName;
  },
  onFail: function() {
  }
};