var SiteFieldController = {
  autoComplete: function (ulElement, data) {
    var $ul = $(ulElement),
        $input = $(data.input),
        value = $input.val();
    $ul.html("");
    if (value && value.length > 0) {
      if (App.isOnline()) {
        SitesByTerm.fetch(value, function (sites) {
          AutoComplete.display("field/site.html", $ul, {sites: sites});
        });
      }
    }
  }
};