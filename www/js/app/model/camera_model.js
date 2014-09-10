CameraModel = {
  openCameraDialog: function(idField, updated) {
    $('#currentCameraImage').val(idField);
    $('#currentCameraImageType').val(updated);
    localStorage['no_update_reload'] = 1;
    $.mobile.activePage.addClass("ui-disabled");
    $("#cameraDialog").show();
    $("#cameraDialog").css("z-index", 200000);
  },
  invokeCamera: function(cameraType) {
    var idField = $('#currentCameraImage').val();
    var updated = $('#currentCameraImageType').val();
    SiteCamera.takePhoto(idField, updated, cameraType);
    CameraModel.closeDialog();
  },
  closeDialog: function() {
    $("#cameraDialog").hide();
    $.mobile.activePage.removeClass('ui-disabled');
  }
};