var Operators = {
  '=': function(a, b) {
    if (a == b)
      return true;
    else
      return false;
  },
  '<': function(a, b) {
    if (a < b)
      return true;
    else
      return false;
  },
  '>': function(a, b) {
    if (a > b)
      return true;
    else
      return false;
  },
  '<=': function(a, b) {
    if (a <= b)
      return true;
    else
      return false;
  },
  '>=': function(a, b) {
    if (a >= b)
      return true;
    else
      return false;
  }
};