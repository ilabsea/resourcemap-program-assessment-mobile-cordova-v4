SiteCamera = {
  format: "jpeg",
  dataWithMimeType: function(data) {
    return 'data:image/jpeg;base64,' + data;
  },
  takePhoto: function(idField, cameraType) {
    var type;
    if (cameraType === "camera") {
      type = Camera.PictureSourceType.CAMERA;
    }
    else {
      type = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    }
    SiteCamera.id = idField;
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
    var imageId = SiteCamera.id;
    return  imageId;
  },
  imagePath: function(imgFileName) {
    return App.IMG_PATH + imgFileName;
  },
  onFail: function() {
  }
};