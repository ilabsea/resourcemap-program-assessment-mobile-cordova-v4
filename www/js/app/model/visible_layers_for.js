VisibleLayersFor = {
  fetch: function(successCallback) {
    var cId = localStorage.getItem("cId");
    var sId = localStorage.getItem("sId");
    $.ajax({
      url: App.URL_SITE + cId + "/sites/" + sId + "/visible_layers_for?auth_token=" 
          +  App.Session.getAuthToken(),
      type: "GET",
      datatype: 'json',
      success: successCallback,
      error: function(error) {
        console.log("Retriving sites from server : ", error);
      }
    });
  }
};

