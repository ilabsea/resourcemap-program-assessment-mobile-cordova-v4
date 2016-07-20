ViewBinding = {
  __busy: false,
  __msg: "",
  
  setBusy: function (status) {
    this.__busy = status;
    i18n.t('global.ajax-loader')
    if (this.__busy)
      Spinner.show();
    else{
      Spinner.hide();
      $('.ui-loader > h1').text(i18n.t('global.ajax-loader'))
    }
  },

  setMessage: function(message){
    $('.ui-loader > h1').text(message)
  },

  setAlert: function (msg) {
    this.__msg = msg;
    if (!this.__msg)
      alert(this.__msg);
  }
};
