var UserFieldController = {
  autoComplete: function (ulElement, data, members) {
    var $ul = $(ulElement),
        $input = $(data.input),
        value = $input.val();
    $ul.html("");
    var str = $ul.attr("data-input");
    var id = str.substring(1, str.length);
    var matches = UserFieldController.matchStart(members, value);
    var match_value = "";

    if (value && value.length > 0) {
      UserFieldController.triggerValidation(matches, id);
      AutoComplete.display("field/user.html", $ul, {members: matches});
    } else
      ValidationHelper.removeClassUserError(id);

    var idfield = id.substring(id.lastIndexOf('_') + 1);
    UserList.add(new UserField(idfield, match_value));
  },
  triggerValidation: function (matches, idElement) {
    if (matches.length === 0)
      ValidationHelper.AddClassUserError(idElement);
    else {
      match_value = matches[0].user_email;
      ValidationHelper.removeClassUserError(idElement);
    }
  },
  getLi: function (liElement) {
    var text = $(liElement).text();
    var ul = $(liElement).closest("ul");
    var id = $(ul).attr("data-input");
    $(id).val(text);
    var idfield = id.substring(id.lastIndexOf('_') + 1);
    UserList.add(new UserField(idfield, text));
    ul.children().addClass('ui-screen-hidden');
  },
  matchStart: function (members, inputValue) {
    var matches = $.map(members, function (member) {
      if (member.user_email.toUpperCase().indexOf(inputValue.toUpperCase()) === 0) {
        return member;
      }
    });
    return matches;
  }
};