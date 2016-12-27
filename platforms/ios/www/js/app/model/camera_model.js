CameraModel = {
  fieldId: '',
  openCameraDialog: function (fieldId) {
    CameraModel.fieldId = fieldId;
    var site = MyMembershipObj.getSite();
    if (site != "" && !MyMembershipController.canEdit(site))
      return false;
    else
      CameraModel.handleOpenCamera();
  },

  invokeCamera: function (cameraType) {
    SiteCamera.takePhoto(CameraModel.fieldId, cameraType);
    CameraModel.closeDialog();
  },

  closeDialog: function() {
    $("#cameraDialog").hide();
    $.mobile.activePage.removeClass('ui-disabled');
  },

  handleOpenCamera: function () {
    // localStorage['no_update_reload'] = 1;
    $.mobile.activePage.addClass("ui-disabled");
    $("#cameraDialog").show();
  }
};
