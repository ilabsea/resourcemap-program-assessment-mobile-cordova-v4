SiteCamera = {
  format: "jpeg",
  dataWithMimeType: function(data) {
    return 'data:image/jpeg;base64,' + data;
  },

  dataWithoutMimeType: function(imageData){
    return imageData.replace("data:image/jpeg;base64,", "")
  },

  takePhoto: function(idField, cameraType) {
    var type = cameraType == "camera" ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.SAVEDPHOTOALBUM;
    SiteCamera.id = idField;
    var cameraOptions = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: type,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 800,
      correctOrientation: true
    };
    navigator.camera.getPicture(SiteCamera.onSuccess, SiteCamera.onFail, cameraOptions);
  },
  onSuccess: function(imageData) {
    var image = document.getElementById(SiteCamera.id);
    var field = FieldController.findFieldById(SiteCamera.id)

    var date = new Date()

    field.__value = SiteCamera.dataWithMimeType(imageData)
    field.__filename = "" + date.getTime() + "_" + SiteCamera.id + "." + SiteCamera.format

    image.src = field.__value;
    validateImage(SiteCamera.id);
  },

  onFail: function() {
    App.log("Failed to take photo.");
  }
};
