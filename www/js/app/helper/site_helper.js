var SiteHelper = {
  buildSubmitError: function (error, site, state) {
    var p = [];
    if (error.properties) {
      $.map(error.properties, function (error) {
        $.each(error, function (key, err) {
          p.push({msg: err, id: key});
        });
      });
    }
    var result = {
      isLat: error["lat"] ? true : false,
      isLng: error["lng"] ? true : false,
      isSubmitSites: state,
      lat: error["lat"],
      lng: error["lng"],
      name: site["name"],
      properties: error["properties"],
      errorProperties: p
    };
    return result;
  },
  displayError: function (templateURL, element, fieldData) {
    var content = App.Template.process(templateURL, fieldData);
    element.html(content);
    setTimeout(function () {
      Dialog.showDialog("page-error-submit-site");
    }, 50);
    element.css("z-index", 200000);
  },
  selectedSite: function(){
    var selectedOfflineSites = []
    $('.btn_select_site').each(function(i, site){
      if($(site).hasClass('ui-icon-check'))
        selectedOfflineSites.push($(site).attr('data-id'));
    });
    return selectedOfflineSites;
  }
};
