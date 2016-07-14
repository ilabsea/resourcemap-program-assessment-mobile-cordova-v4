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
    var cameraOptions = CameraModel.setOptions(type);
    console.log(' Camera.DestinationType.FILE_URI : ',  Camera.DestinationType.FILE_URI);
    navigator.camera.getPicture(SiteCamera.onSuccess, SiteCamera.onFail, cameraOptions);
  },
  onSuccess: function(imageURI) {
    SiteCamera.displayImage(imageURI);
  },
  displayImage: function(imageURI){

    SiteCamera.getFileEntry(imageURI);
    // validateImage(imageId);
  },
  getFileEntry: function(imgUri) {
    window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {
      console.log('fileEntry : ', fileEntry);
      fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            console.log("Successful file read: " + this.result);
            var imageId = SiteCamera.imageId();
            var image = document.getElementById(imageId);
            image.src = this.result;
        };
        reader.readAsDataURL(file);
        console.log('reader : ', reader._result);
      }, function(error){
        console.log('error fileEntry');
      });
    }, function (error) {
      console.log('error resolveLocalFileSystemURL ; ', error);
    });
  },
  toDataURI: function(imageURI){
    var reader  = new FileReader();
    // reader.readAsDataURL(imageURI);
    reader.onloadend = function (e) {
      img.attr('src', reader.result);
      img.css('display', 'block');
    }
    return reader;
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
