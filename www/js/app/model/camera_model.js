CameraModel = {
  openCameraDialog: function (idField, updated) {
    var site = MyMembershipObj.getSite();
    if (site != "" && !MyMembershipController.canEdit(site)) {
      return false;
    } else {
      CameraModel.handleOpenCamera(idField, updated);
    }
  },
  invokeCamera: function (cameraType) {
    var idField = $('#currentCameraImage').val();
    var updated = $('#currentCameraImageType').val();
    SiteCamera.takePhoto(idField, updated, cameraType);
    CameraModel.closeDialog();
  },
  closeDialog: function() {
    $("#cameraDialog").hide();
    $.mobile.activePage.removeClass('ui-disabled');
  },
  handleOpenCamera: function (idField, updated) {
    $('#currentCameraImage').val(idField);
    $('#currentCameraImageType').val(updated);
    localStorage['no_update_reload'] = 1;
    $.mobile.activePage.addClass("ui-disabled");
    $("#cameraDialog").show();
    $("#cameraDialog").css("z-index", 200000);
  }
};