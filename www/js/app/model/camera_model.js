CameraModel = {
  openCameraDialog: function (idField) {
    var site = MyMembershipObj.getSite();
    if (site != "" && !MyMembershipController.canEdit(site)) {
      return false;
    } else {
      CameraModel.handleOpenCamera(idField);
    }
  },
  invokeCamera: function (cameraType) {
    var idField = $('#currentCameraImage').val();
    SiteCamera.takePhoto(idField, cameraType);
    CameraModel.closeDialog();
  },
  closeDialog: function() {
    $("#cameraDialog").hide();
    $.mobile.activePage.removeClass('ui-disabled');
  },
  handleOpenCamera: function (idField) {
    $('#currentCameraImage').val(idField);
    localStorage['no_update_reload'] = 1;
    $.mobile.activePage.addClass("ui-disabled");
    $("#cameraDialog").show();
    $("#cameraDialog").css("z-index", 200000);
  }
};