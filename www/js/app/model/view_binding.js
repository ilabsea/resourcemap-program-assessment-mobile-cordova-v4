ViewBinding = {
  __busy: false,
  __msg: "",
  setBusy: function (status) {
    this.__busy = status;
    if (this.__busy)
      Spinner.show();
    else
      Spinner.hide();
  },
  setAlert: function (msg) {
    this.__msg = msg;
    if (!this.__msg)
      alert(this.__msg);
  }
};
