$(function(){
  $("#btn-server-url").on('click', function(){
    $('#txt-url').val(RmSetting.url());
  });

  $("#form-change-server-url").validate({
    focusInvalid: false,
    errorPlacement: function () {
    },
    submitHandler: function () {
      url = $('#txt-url').val();
      App.DataStore.set("endPoint", normalizeUrl(url));
      $('#url-error').text('');
      $( "#popup-change-server-url" ).popup( "close" )
    },
    invalidHandler: function () {
      $('#url-error').text('Please enter a valid url');
    }
  });

  function normalizeUrl(url){
    return (url.slice(-1) == '/') ? url.slice(0, -1) : url;
  }
});
