var JSHelper = {
  endWith: function (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }
};