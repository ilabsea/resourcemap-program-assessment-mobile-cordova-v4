var Dialog = {
  closeDialog: function(element) {
    $("#" + element).hide();
    $.mobile.activePage.removeClass('ui-disabled');
  },
  showDialog:function(element){
    $("#" + element).show();
    $.mobile.activePage.addClass('ui-disabled');
  }
};