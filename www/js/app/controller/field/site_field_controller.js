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
  },
  getLi: function (liElement) {
    var text = $(liElement).text();
    var ul = $(liElement).closest("ul");
    var id = $(ul).attr("data-input");
    $(id).val(text);
    ul.children().addClass('ui-screen-hidden');

    id = id.substring(1, id.length);
    var idfield = id.substring(id.lastIndexOf('_') + 1);
    SearchList.add(new SearchField(idfield, liElement.id));
  }
};