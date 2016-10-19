$(document).on("mobileinit", function() {
  $(document).delegate('#page-change-server', 'pageshow', function () {
    $('#txt-url').val(RmSetting.url());
  });
})
$(function(){
  $("#form-change-server-url").validate({
    focusInvalid: false,
    errorPlacement: function () {
    },
    submitHandler: function () {
      $("#dialog-confirm-change-server").show();
      $('#url-error').text('');
    },
    invalidHandler: function () {
      $('#url-error').text('Please enter a valid url');
    }
  });

  $('#btn-confirm-change-server').on('click', function(){
    url = $('#txt-url').val();
    $("#dialog-confirm-change-server").hide();
    App.changeServerUrl(normalizeUrl(url));
  });

  $('#btn-cancel-change-server').on('click', function(){
    $("#dialog-confirm-change-server").hide();
  });

  function normalizeUrl(url){
    return (url.slice(-1) == '/') ? url.slice(0, -1) : url;
  }
});
