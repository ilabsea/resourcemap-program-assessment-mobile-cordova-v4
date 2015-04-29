var UserFieldController = {
  autoComplete: function (ulElement, data, members) {
    var $ul = $(ulElement),
        $input = $(data.input),
        value = $input.val();
    $ul.html("");
    var str = $ul.attr("data-input");
    var id = str.substring(1, str.length);
    var idfield = id.substring(id.lastIndexOf('_') + 1);
    var matches = UserFieldController.matchStart(members, value);
    var match_value = "";

    if (value && value.length > 0) {
      if (matches.length === 0) {
        ValidList.addValid(new Valid(id, false));
        ValidationHelper.AddClassUserError(id);
      }
      else {
        ValidList.addValid(new Valid(id, true));
        match_value = matches[0].user_email;
        ValidationHelper.removeClassUserError(id);
      }
      AutoComplete.display("field/user.html", $ul, {members: matches});
    } else
      ValidationHelper.removeClassUserError(id);

    SearchList.add(new SearchField(idfield, match_value));
  },
  getLi: function (liElement) {
    var text = $(liElement).text();
    var ul = $(liElement).closest("ul");
    var id = $(ul).attr("data-input");
    $(id).val(text);
    ul.children().addClass('ui-screen-hidden');

    id = id.substring(1, id.length);
    var idfield = id.substring(id.lastIndexOf('_') + 1);
    SearchList.add(new SearchField(idfield, text));
  },
  matchStart: function (members, inputValue) {
    var matches = $.map(members, function (member) {
      if (member.user_email.toUpperCase().indexOf(inputValue.toUpperCase()) === 0) {
        return member;
      }
    });
    return matches;
  },
  hideLi: function (e) {
    var container = $(".autocomplete");

    if (!container.is(e.target)
        && container.has(e.target).length === 0) {
      container.addClass('ui-screen-hidden');
    }
  }
};